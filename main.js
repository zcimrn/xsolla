import fastify from 'fastify'
import fs from 'fs'
import Database from './database.js'
import * as schemas from './schemas.js'

const apiPrefix = process.env.API_PREFIX || '/api/v1'

const db = new Database({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

const server = fastify()

server.post(`${apiPrefix}/products`, {
    schema: schemas.addProduct
}, async (request, reply) => {
    return {statusCode: 200, id: await db.addProduct(request.body)}
})

server.get(`${apiPrefix}/products`, {
    schema: schemas.getProducts
}, async (request, reply) => {
    return {statusCode: 200, products: await db.getProducts(request.query)}
})

server.get(`${apiPrefix}/products/:id`, {
    schema: schemas.getProduct
}, async (request, reply) => {
    try {
        return {statusCode: 200, product: await db.getProduct(request.params)}
    }
    catch (error) {
        reply.code(404)
        return {statusCode: 404, message: error.message}
    }
})

server.put(`${apiPrefix}/products/:id`, {
    schema: schemas.editProduct
}, async (request, reply) => {
    try {
        await db.editProduct({...request.params, ...request.body})
        return {statusCode: 200}   
    }
    catch (error) {
        reply.code(404)
        return {statusCode: 404, message: error.message}
    }
})

server.delete(`${apiPrefix}/products/:id`, {
    schema: schemas.deleteProduct
}, async (request, reply) => {
    try {
        await db.deleteProduct(request.params)
        return {statusCode: 200}
    }
    catch (error) {
        reply.code(404)
        return {statusCode: 404, message: error.message}
    }
})

const main = async () => {
    await db.init()
    await server.listen(process.env.PORT || 3000, '0.0.0.0')
}

main()
