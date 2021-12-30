// Datos de conexión a la db

const options = {
    client: 'sqlite3',
    connection: {
        filename: './../DB/ecommerce.sqlite'
    },
    useNullAsDefault: true
}

module.exports = { options }
