import { Elysia, t } from 'elysia';
import { PrismaClient, EmployeeStatus, EmployeeRole } from '@prisma/client';

const prisma = new PrismaClient();

/* ------------------------- DTOs & tiny helpers ------------------------- */

type EmployeeDTO = {
  id: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  role: 'Owner' | 'Manager' | 'Cashier' | 'Stock';
  status?: 'ACTIVE' | 'DISABLED';
  createdAt?: string;
  disabledAt?: string | null;
};

type OwnerDTO = Omit<EmployeeDTO, 'status' | 'createdAt' | 'disabledAt'>;

function splitName(name: string | null | undefined): { first: string; last: string } {
  const safe = String(name ?? '').trim();
  if (!safe) return { first: 'Owner', last: '' };
  const parts = safe.split(/\s+/);
  return { first: parts[0], last: parts.slice(1).join(' ') || '' };
}

function toRoleDisplay(role: EmployeeRole): EmployeeDTO['role'] {
  switch (role) {
    case 'OWNER': return 'Owner';
    case 'MANAGER': return 'Manager';
    case 'CASHIER': return 'Cashier';
    default: return 'Stock';
  }
}

function fromRoleDisplay(role: EmployeeDTO['role']): EmployeeRole {
  switch (role) {
    case 'Owner': return 'OWNER';
    case 'Manager': return 'MANAGER';
    case 'Cashier': return 'CASHIER';
    default: return 'STOCK';
  }
}

function toEmployeeDTO(e: any): EmployeeDTO {
  const { first, last } = splitName(e.fullName);
  return {
    id: e.id,
    firstName: first,
    lastName: last,
    username: e.username ?? null,
    email: e.email ?? null,
    phone: e.mobileNumber ?? null,
    role: toRoleDisplay(e.role),
    status: e.status,
    createdAt: e.createdAt?.toISOString?.() ?? undefined,
    disabledAt: e.disabledAt ? e.disabledAt.toISOString() : null,
  };
}

/* ------------------------------ Schemas ------------------------------ */

const paramsMerchant = t.Object({
  merchantId: t.String({ minLength: 1 }),
});

const paramsEmp = t.Object({
  merchantId: t.String({ minLength: 1 }),
  employeeId: t.String({ minLength: 1 }),
});

const createBody = t.Object({
  fullName: t.String({ minLength: 1 }),
  username: t.Optional(t.String()),
  email: t.Optional(t.String()),
  phone: t.Optional(t.String()),
  role: t.Union([
    t.Literal('Manager'),
    t.Literal('Cashier'),
    t.Literal('Stock'),
  ]),
});

const updateBody = t.Partial(
  t.Object({
    fullName: t.String(),
    username: t.String(),
    email: t.String(),
    phone: t.String(),
    role: t.Union([
      t.Literal('Manager'),
      t.Literal('Cashier'),
      t.Literal('Stock'),
    ]),
    status: t.Union([t.Literal('ACTIVE'), t.Literal('DISABLED')]),
  })
);

/* ------------------------------ Route set ------------------------------ */

export const MerchantEmployees = new Elysia({ prefix: '/merchant' })

  /**
   * GET /api/merchant/:merchantId/employees
   * Returns { owner, employees[] }
   */
  .get(
    '/:merchantId/employees',
    async ({ params, set }) => {
      // Load merchant + owner
      const merchant = await prisma.merchant.findUnique({
        where: { id: params.merchantId },
        include: {
          owner: true,
        },
      });
      if (!merchant) {
        set.status = 404;
        return { message: 'Merchant not found' };
      }

      // Owner DTO
      const { first, last } = splitName(merchant.owner?.name);
      const owner: OwnerDTO = {
        id: merchant.owner?.id ?? '',
        firstName: first,
        lastName: last,
        // You can surface owner contacts if you want:
        email: merchant.owner?.email ?? null,
        phone: merchant.owner?.phone ?? null,
        username: null,
        role: 'Owner',
      };

      // Employees (not including owner)
      const emps = await prisma.employee.findMany({
        where: { merchantId: params.merchantId },
        orderBy: { createdAt: 'desc' },
      });

      const employees = emps.map(toEmployeeDTO);
      return { owner, employees };
    },
    {
      params: paramsMerchant,
      detail: { tags: ['Employees'], summary: 'List employees for merchant' },
    }
  )

  /**
   * POST /api/merchant/:merchantId/employees
   * Create employee row (ACTIVE by default)
   */
  .post(
    '/:merchantId/employees',
    async ({ params, body, set }) => {
      // Ensure merchant exists
      const m = await prisma.merchant.findUnique({
        where: { id: params.merchantId },
        select: { id: true },
      });
      if (!m) {
        set.status = 404;
        return { message: 'Merchant not found' };
      }

      // Optional: enforce unique username at app-level (DB already has unique)
      if (body.username) {
        const exists = await prisma.employee.findUnique({
          where: { username: body.username },
          select: { id: true },
        });
        if (exists) {
          set.status = 409;
          return { message: 'Username already taken' };
        }
      }

      // Optional: link to existing User by email if provided
      let linkUserId: string | undefined = undefined;
      if (body.email) {
        const user = await prisma.user.findUnique({
          where: { email: body.email },
          select: { id: true },
        });
        if (user) linkUserId = user.id;
      }

      const created = await prisma.employee.create({
        data: {
          merchantId: params.merchantId,
          userId: linkUserId,
          fullName: body.fullName.trim(),
          username: body.username?.trim(),
          email: body.email?.trim(),
          mobileNumber: body.phone?.trim(),
          role: fromRoleDisplay(body.role),
          status: 'ACTIVE',
        },
      });

      set.status = 201;
      return toEmployeeDTO(created);
    },
    {
      params: paramsMerchant,
      body: createBody,
      detail: { tags: ['Employees'], summary: 'Create employee' },
    }
  )

  /**
   * PATCH /api/merchant/:merchantId/employees/:employeeId
   * Update profile, role, or status (ACTIVE/DISABLED)
   */
  .patch(
    '/:merchantId/employees/:employeeId',
    async ({ params, body, set }) => {
      const emp = await prisma.employee.findFirst({
        where: { id: params.employeeId, merchantId: params.merchantId },
      });
      if (!emp) {
        set.status = 404;
        return { message: 'Employee not found' };
      }

      // If status flips to DISABLED set disabledAt, if ACTIVE clear it
      let disabledAt: Date | null | undefined = undefined;
      if (body.status === 'DISABLED') disabledAt = new Date();
      if (body.status === 'ACTIVE') disabledAt = null;

      // Unique username guard when changing username
      if (body.username && body.username !== emp.username) {
        const exists = await prisma.employee.findUnique({
          where: { username: body.username },
          select: { id: true },
        });
        if (exists) {
          set.status = 409;
          return { message: 'Username already taken' };
        }
      }

      const updated = await prisma.employee.update({
        where: { id: emp.id },
        data: {
          fullName: body.fullName?.trim(),
          username: body.username?.trim(),
          email: body.email?.trim(),
          mobileNumber: body.phone?.trim(),
          role: body.role ? fromRoleDisplay(body.role) : undefined,
          status: body.status as EmployeeStatus | undefined,
          disabledAt,
        },
      });

      return toEmployeeDTO(updated);
    },
    {
      params: paramsEmp,
      body: updateBody,
      detail: { tags: ['Employees'], summary: 'Update employee' },
    }
  )

  /**
   * POST /api/merchant/:merchantId/employees/:employeeId/disable
   */
  .post(
    '/:merchantId/employees/:employeeId/disable',
    async ({ params, set }) => {
      const emp = await prisma.employee.findFirst({
        where: { id: params.employeeId, merchantId: params.merchantId },
      });
      if (!emp) {
        set.status = 404;
        return { message: 'Employee not found' };
      }
      const updated = await prisma.employee.update({
        where: { id: emp.id },
        data: { status: 'DISABLED', disabledAt: new Date() },
      });
      return toEmployeeDTO(updated);
    },
    {
      params: paramsEmp,
      detail: { tags: ['Employees'], summary: 'Disable employee access' },
    }
  )

  /**
   * POST /api/merchant/:merchantId/employees/:employeeId/enable
   */
  .post(
    '/:merchantId/employees/:employeeId/enable',
    async ({ params, set }) => {
      const emp = await prisma.employee.findFirst({
        where: { id: params.employeeId, merchantId: params.merchantId },
      });
      if (!emp) {
        set.status = 404;
        return { message: 'Employee not found' };
      }
      const updated = await prisma.employee.update({
        where: { id: emp.id },
        data: { status: 'ACTIVE', disabledAt: null },
      });
      return toEmployeeDTO(updated);
    },
    {
      params: paramsEmp,
      detail: { tags: ['Employees'], summary: 'Enable employee access' },
    }
  )

  /**
   * DELETE /api/merchant/:merchantId/employees/:employeeId
   * Hard-delete the employee row.
   */
  .delete(
    '/:merchantId/employees/:employeeId',
    async ({ params, set }) => {
      const emp = await prisma.employee.findFirst({
        where: { id: params.employeeId, merchantId: params.merchantId },
        select: { id: true },
      });
      if (!emp) {
        set.status = 404;
        return { message: 'Employee not found' };
      }
      await prisma.employee.delete({ where: { id: emp.id } });
      set.status = 204;
      return null;
    },
    {
      params: paramsEmp,
      detail: { tags: ['Employees'], summary: 'Delete employee' },
    }
  );
