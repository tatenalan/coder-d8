const ServiceException = require("../exceptions/ServiceException")
const {options} = require("../options/MariaDB")
const knex = require("knex")(options)

class ProductController {
    constructor(knex, table) {
        this.knex = knex;
        this.table = table;
    }

    getAll() {
        return this.knex.from('products').select("*")
        .then((products) => {return products})
        .catch((error) => {console.log(error); throw new ServiceException(500, "Error")})
        .finally(() => {knex.destroy();});
    }

    find(id) {
        return this.knex('products').where({id:id})
    }

    insert(product) {
        return this.knex('products').insert(product, "id")
        .then((product) => {console.log("product inserted", product[0]); return product[0].toString();})
        .catch((err) => { console.log(err); throw new ServiceException(500, "Error") })
        .finally(() => {knex.destroy();});
    }

    update(product) {
        return this.knex('products').where({id:product.id}).update(product)
        .then(() => console.log("product updated"))
        .catch((err) => { console.log(err); throw new ServiceException(500, "Error") })
        .finally(() => {
            knex.destroy();
        });
    }

    delete(id) {
        return this.knex('products').where({id:id}).del()
        .then(() => console.log("product deleted"))
        .catch((err) => { console.log(err); throw new ServiceException(500, "Error") })
        .finally(() => {
            knex.destroy();
        });
    }
}
module.exports = ProductController
