import { Elysia, t } from 'elysia'
import { Client } from 'minio'
import { randomUUID } from 'crypto'

const minioClient = new Client({
  endPoint: "e69f37b2067c.ngrok-free.app",
  port: 443,
  useSSL: true,
  pathStyle: true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});
const BUCKET = 'objects'

await (async () => {
    const exists = await minioClient.bucketExists(BUCKET).catch(() => false)

    if (!exists) {
        await minioClient.makeBucket(BUCKET, 'us-east-1')
        console.log('Bucket created.')
    }
})()

export const uploadRoutes = new Elysia({ prefix: '/minio' })
    .post('/upload', async ({ body, query, set }) => {
        const file = body.file

        if (!file) {
            set.status = 400

            return { error: 'No file uploaded.' }
        }

        const folder = query.folder || 'misc'
        const fileName = `${folder}/${randomUUID()}-${file.name}`
        const buffer = Buffer.from(await file.arrayBuffer())

        await minioClient.putObject(BUCKET, fileName, buffer, file.size, {
            'Content-Type': file.type
        })

        const fileURL = `https://e69f37b2067c.ngrok-free.app/${BUCKET}/${fileName}`

        return { url: fileURL }
    },
        {
            type: 'multipart/form-data',
            body: t.Object({
                file: t.File({
                    description: 'File to upload to MinIO',
                }),
            }),
        }
    )