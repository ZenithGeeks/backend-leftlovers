import { Elysia, t } from 'elysia'
import { PrismaClient, Role, UserStatus, MerchantStatus, Prisma, } from '@prisma/client'
import { CreateMerchantUserBodySchema, ErrorSchema, MerchantUserResponseSchema } from '../../types'

const prisma = new PrismaClient()
function parseDOB(input?: string | null): Date | null {
    if (!input) {
        return null
    }

    const d = new Date(input)

    return isNaN(d.getTime()) ? null : d
}
function normEmail(e: string) {
    return e.trim().toLowerCase()
}

export const Merchant = new Elysia({ prefix: '/merchant' })
    .post(
        "/user",
        async ({ body, set }) => {
            try {
                const id = body.id?.trim()

                if (!id) {
                    set.status = 400

                    return { message: "User ID is required" }
                }

                const name = body.name?.trim()

                if (!name) {
                    set.status = 400

                    return { message: "Name is required" }
                }

                const email = normEmail(body.email)
                const phone = body.phone?.trim() || null
                const avatarUrl = body.avatarUrl ?? null
                const dob = parseDOB(body.dob)

                if (!dob) {
                    set.status = 400

                    return { message: "Invalid or missing date of birth" }
                }

                const status: UserStatus = body.status
                const user = await prisma.user.create({
                    data: {
                        id,
                        name,
                        email,
                        phone,
                        avatarUrl,
                        dob,
                        role: Role.MERCHANT,
                        status,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        dob: true,
                        avatarUrl: true,
                        role: true,
                        status: true,
                    },
                })
                set.status = 201

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    dob: user.dob ? user.dob.toISOString() : null,
                    avatarUrl: user.avatarUrl,
                    role: user.role,
                    status: user.status,
                }
            } catch (err: any) {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    if (err.code === "P2002") {
                        set.status = 409

                        return { message: "User already exists" }
                    }
                }

                console.error("[Merchant User Create Error]", err)
                set.status = 500

                return { message: "Internal server error" }
            }
        },
        {
            body: CreateMerchantUserBodySchema,
            response: {
                201: MerchantUserResponseSchema,
                409: ErrorSchema,
                500: ErrorSchema,
            },
            detail: { tags: ['Merchant'], summary: 'Create User Merchant' },
        }
    )
    .post(
        "/setup",
        async ({ body, set }) => {
            try {
                const ownerUserId = body.ownerUserId

                if (!ownerUserId) {
                    set.status = 400

                    return { message: "ownerUserId is required" }
                }

                const displayName = body.displayName?.trim()
                const categoryId = body.categoryId

                if (!displayName) {
                    set.status = 400

                    return { message: "displayName is required" }
                }

                if (!categoryId) {
                    set.status = 400

                    return { message: "categoryId is required" }
                }

                const addressInput = body.address

                if (!addressInput || !addressInput.line1) {
                    set.status = 400

                    return { message: "address.line1 is required" }
                }

                const user = await prisma.user.findUnique({
                    where: { id: ownerUserId }
                })

                if (!user) {
                    set.status = 404

                    return { message: "user not found" }
                }

                if (user.role !== Role.MERCHANT) {
                    set.status = 400

                    return { message: "user is not a MERCHANT" }
                }

                const exists = await prisma.merchant.findFirst({
                    where: { ownerUserId }
                })

                if (exists) {
                    set.status = 409

                    return { message: "merchant already exists for this user" }
                }

                const files = Array.isArray(body.files) ? body.files : []
                const counts = files.reduce((m: Record<string, number>, f) => {
                    m[f.kind] = (m[f.kind] || 0) + 1

                    return m
                }, {})

                if ((counts.COMMERCIAL_REG ?? 0) !== 1) {
                    set.status = 400

                    return { message: "exactly one COMMERCIAL_REG required" }
                }

                if ((counts.STORE_IMAGE ?? 0) > 5) {
                    set.status = 400

                    return { message: "up to 5 STORE_IMAGE allowed" }
                }

                const result = await prisma.$transaction(async (tx) => {
                    const address = await tx.address.create({
                        data: {
                            label: addressInput.label ?? null,
                            line1: addressInput.line1,
                            line2: addressInput.line2 ?? null,
                            city: addressInput.city ?? null,
                            province: addressInput.province ?? null,
                            postalCode: addressInput.postalCode ?? null,
                            lat: addressInput.lat ?? undefined,
                            lng: addressInput.lng ?? undefined
                        },
                        select: { id: true }
                    })
                    const merchant = await tx.merchant.create({
                        data: {
                            ownerUserId,
                            displayName,
                            branchName: body.branchName ?? null,
                            description: body.description ?? null,
                            categoryId,
                            addressId: address.id,
                            openHours: body.openHours ?? undefined,
                            listImageUrl: body.listImageUrl ?? null,
                            StoreImageUrl: body.storeImageUrl ?? null,
                            status: MerchantStatus.PENDING
                        },
                        select: {
                            id: true,
                            ownerUserId: true,
                            displayName: true,
                            branchName: true,
                            description: true,
                            categoryId: true,
                            addressId: true,
                            createdAt: true,
                            status: true,
                            listImageUrl: true,
                            StoreImageUrl: true
                        }
                    })

                    if (files.length > 0) {
                        await tx.merchantFile.createMany({
                            data: files.map((f) => ({
                                merchantId: merchant.id,
                                kind: f.kind,
                                url: f.url,
                                label: f.label ?? null
                            }))
                        })
                    }

                    return { merchant }
                })
                set.status = 201

                return {
                    message: "Merchant store info completed",
                    merchant: {
                        ...result.merchant,
                        createdAt: result.merchant.createdAt.toISOString()
                    }
                }
            } catch (err: any) {
                console.error("[Merchant Setup Error]", err)

                if (
                    err instanceof Prisma.PrismaClientKnownRequestError &&
                    err.code === "P2003"
                ) {
                    set.status = 400

                    return { message: "invalid foreign key or related resource missing" }
                }

                set.status = 500

                return { message: "Internal server error" }
            }
        },
        {
            body: t.Object({
                ownerUserId: t.String(),
                displayName: t.String(),
                branchName: t.Optional(t.String()),
                description: t.Optional(t.String()),
                categoryId: t.String(),
                openHours: t.Nullable(t.Any()),
                listImageUrl: t.Optional(t.String()),
                storeImageUrl: t.Optional(t.String()),
                address: t.Object({
                    label: t.Optional(t.String()),
                    line1: t.String(),
                    line2: t.Optional(t.String()),
                    city: t.Optional(t.String()),
                    province: t.Optional(t.String()),
                    postalCode: t.Optional(t.String()),
                    lat: t.Optional(t.Number()),
                    lng: t.Optional(t.Number())
                }),
                files: t.Optional(
                    t.Array(
                        t.Object({
                            kind: t.Union([
                                t.Literal("COMMERCIAL_REG"),
                                t.Literal("OWNER_ID"),
                                t.Literal("STORE_IMAGE"),
                                t.Literal("OTHER")
                            ]),
                            url: t.String(),
                            label: t.Optional(t.String())
                        })
                    )
                )
            })
        }
    )
    .get('/merchants', async ({ params, set }) => {
        const merchants = await prisma.merchant.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                address: true
            }
        })

        if (!merchants.length) {
            set.status = 404

            return { message: 'No menu found' }
        }

        return merchants
    }, { tags: ['Merchant'] })
    .get('/categories', async ({ params, set }) => {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'desc' }
        })

        if (!categories.length) {
            set.status = 404

            return { message: 'No menu found' }
        }

        return categories
    }, { tags: ['Merchant'] })
    .get('/:merchantId', async ({ params, set }) => {
        const item = await prisma.merchant.findFirst({
            where: { id: params.merchantId },
            include: {
                owner: true,
                orders: {
                    include: {
                        items: {
                            include: { menu: true }
                        },
                        review: true
                    }
                }

            }
        })

        if (!item) {
            set.status = 404

            return { message: 'Merchant not found' }
        }

        return item
    }, { tags: ['Merchant'] })
    .get('/merchant/:ownerUserId/LandingDashboard', async ({ params, set }) => {
        const { ownerUserId } = params
        const item = await prisma.merchant.findFirst({
            where: { ownerUserId: ownerUserId },
            include: {
                owner: true,
                orders: {
                    include: {
                        items: {
                            include: { menu: true }
                        },
                        review: true
                    }
                }

            }
        })

        if (!item) {
            set.status = 404

            return { message: 'Merchant not found' }
        }

        return item
    },
        {
            detail: { tags: ['Merchant'], summary: 'Get Merchant Info by owner user id' }
        }
    )