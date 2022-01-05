import { Client } from "https://deno.land/x/postgres/mod.ts"
import { dbCreds } from '../config.ts'

const client = new Client(dbCreds);

const addProduct = async ({ request, response }: {request: any, response: any }) => {
    const body = await request.body();
    const product = await body.value
    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            msg: 'No data'
        }
    } else {
        try {
        await client.connect()
         
        const result = await client.queryArray("INSERT INTO products(name, description, price, image) VALUES($1,$2,$3,$4)", 
        product.name, 
        product.description,
        product.price,
        product.image)

        response.status = 201
        response.body = {
            success: true,
            data: product
        }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString()
        }
    } finally {
        await client.end()
    }  
  }  
}

const getProducts = async ({ response }:{ response: any }) => {
    try {
        await client.connect()

        const result = await client.queryObject("SELECT * FROM products")
        let products;
        if (!result.rows.length){
            products = 'no products yet'
        }

        products = result.rows.map(el => {
            return el
        });
        response.status = 201
        response.body = {
            success: true,
            data: products
        }
    } catch (err) {
            response.status = 500
            response.body = {
                success: false,
                msg: err.toString()
            }
        } finally {
            await client.end()
    }  
}  
const getCartProducts = async ({ response }:{ response: any }) => {
    try {
        await client.connect()
        const result = await client.queryObject(`SELECT * FROM products WHERE incart = '${true}'`)
        let products;
        if (!result.rows.length){
            products = 'no products yet'
        }

        products = result.rows.map(el => {
            return el
        });
        response.status = 201
        response.body = {
            success: true,
            data: products
        }
    } catch (err) {
            response.status = 500
            response.body = {
                success: false,
                msg: err.toString()
            }
        } finally {
            await client.end()
    }  
}  
const getProduct = async ({ params, response }:{ params: {id: string}, response: any }) => {
    try {
        await client.connect()
        const result = await client.queryObject("SELECT * FROM products WHERE id = $1", params.id)
        
        let product;
        if (!result){
            product = 'no product with that id found'
        }

        product = result.rows[0];
        response.status = 201
        response.body = {
            success: true,
            data: product
        }
    } catch (err) {
            response.status = 500
            response.body = {
                success: false,
                msg: err.toString()
            }
        } finally {
            await client.end()
    }  
}  
const deleteProduct = async ({ params, response }:{ params: {id: string}, response: any }) => {
    try {
        await client.connect()
        const result = await client.queryObject("DELETE FROM products WHERE id = $1", params.id)
        
        let product;
        if (!result){
            product = 'no product with that id found'
        }

        product = result.rows[0];
        response.status = 201
        response.body = {
            success: true,
            data: product
        }
    } catch (err) {
            response.status = 500
            response.body = {
                success: false,
                msg: err.toString()
            }
        } finally {
            await client.end()
    }  
}  

// this method will update the product to be in cart
const addToCart = async ({ params, response }:{ params: {id: string}, request: any, response: any }) => {
    try {
      await client.connect()
      
      const text = await client.queryObject(`
      UPDATE products 
      SET incart = '${ true }'
      WHERE products.id = ${ params.id } 
      RETURNING *
      `);

      if (!text){
        response.body = {
            success: false
          }
      }

      response.body = {
        success: true
      }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString()
        }
    } finally {
        await client.end()
    }  
}
// this method will update the product to not in cart
const deleteFromtCart = async ({ params, response }:{ params: {id: string}, request: any, response: any }) => {
    try {
      await client.connect()
      
      const text = await client.queryObject(`
      UPDATE products 
      SET incart = '${ false }'
      WHERE products.id = ${ params.id } 
      RETURNING *
      `);

      if (!text){
        response.body = {
            success: false
          }
      }

      response.body = {
        success: true
      }
    } catch (err) {
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString()
        }
    } finally {
        await client.end()
    }  
}


export { addProduct, getProducts, getProduct, deleteProduct, addToCart, deleteFromtCart, getCartProducts }