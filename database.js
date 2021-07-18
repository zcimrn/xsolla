import pg from 'pg'

export default class Database {
    constructor({host='0.0.0.0', port=5432, name, user, password}) {
        if (!name) {
            throw new Error('db name not specified')
        }
        if (!user) {
            throw new Error('db user not specified')
        }
        if (!password) {
            throw new Error('db password not specified')
        }
        this.db = new pg.Client({
            host: host,
            port: port,
            database: name,
            user: user,
            password: password
        })
    }

    async init() {
        await this.db.connect()
        await this.db.query(`
            create table if not exists products(
                id bigserial primary key,
                sku text not null,
                name text not null default '',
                type text not null default '',
                price bigint not null default 1000000000
            )
        `)
    }

    async addProduct({sku=null, name='', type='', price=1e9}) {
        if (!sku) {
            throw new Error('sku not specified')
        }
        return (await this.db.query(`
            insert into products(sku, name, type, price)
            values($1::text, $2::text, $3::text, $4::bigint)
            returning id`, [sku, name, type, price]
        )).rows[0].id
    }

    async getProducts({type=null, offset=null, limit=null}) {
        const values = []
        let query = 'select * from products'
        if (type !== null) {
            values.push(type)
            query += ` where type = $${values.length}::text`
        }
        if (offset !== null) {
            values.push(offset)
            query += ` offset $${values.length}::bigint`
        }
        if (limit !== null) {
            values.push(limit)
            query += ` limit $${values.length}::bigint`
        }
        return (await this.db.query(query, values)).rows
    }

    async getProduct({id=null}) {
        if (id === null) {
            throw new Error('id not specified')
        }
        const result = await this.db.query('select * from products where id = $1::bigint', [id])
        if (result.rowCount) {
            return result.rows[0]
        }
        throw new Error('product not found')
    }

    async editProduct({id=null, sku=null, name=null, type=null, price=null}) {
        console.log({id: id, sku: sku, name: name, type: type, price: price})
        if (id === null) {
            throw new Error('id not specified')
        }
        const values = []
        let query = 'update products set id = id'
        if (sku !== null) {
            values.push(sku)
            query += `, sku = $${values.length}::text`
        }
        if (name !== null) {
            values.push(name)
            query += `, name = $${values.length}::text`
        }
        if (type !== null) {
            values.push(type)
            query += `, type = $${values.length}::text`
        }
        if (price !== null) {
            values.push(price)
            query += `, price = $${values.length}::bigint`
        }
        values.push(id)
        query += ` where id = $${values.length}`
        const result = await this.db.query(query, values)
        if (!result.rowCount) {
            throw new Error('product not found')
        }
    }
    
    async deleteProduct({id=null}) {
        if (id === null) {
            throw new Error('product not found')
        }
        const result = await this.db.query('delete from products where id = $1::bigint', [id])
        if (!result.rowCount) {
            throw new Error('product not found')
        }
    }
}
