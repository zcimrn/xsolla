const body = {
    type: 'object',
    properties: {
        sku: {type: 'string'},
        name: {type: 'string'},
        type: {type: 'string'},
        price: {type: 'integer'}
    }
}

const query = {
    type: 'object',
    properties: {
        type: {type: 'string'},
        offset: {type: 'integer'},
        limit: {type: 'integer'}
    }    
}

const params = {
    type: 'object',
    properties: {
        id: {type: 'integer'}
    },
    required: ['id']
}

export const addProduct = {body: {...body, required: ['sku']}}
export const getProducts = {query: query}
export const getProduct = {params: params}
export const editProduct = {params: params, body: body}
export const deleteProduct = {params: params}