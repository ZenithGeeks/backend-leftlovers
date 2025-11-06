import { Elysia, t } from 'elysia'
import { Client } from 'minio'
import { randomUUID } from 'crypto'

const minioClient = new Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
})
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

        const fileURL = `http://localhost:9000/${BUCKET}/${fileName}`

        return { url: fileURL }
    },
    {
        body: t.Object({
            file: t.File()
        })
    }
)