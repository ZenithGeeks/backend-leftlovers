import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(openapi())
    .get('/', () => 'hello')
    .post('/hello', () => 'OpenAPI')
    .listen(3000)