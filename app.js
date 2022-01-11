// Importaciones
const express = require('express')
const ProductController = require('./controllers/ProductController')
const Product = require('./models/Product.js')
const { Router } = express;
const handlebars = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { options } = require('./options/MariaDB.js');
const knex = require('knex')(options)
const knexProducts = new ProductController(knex, 'products')

// Inicializaciones
const app = express();
const router = Router();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// Arrancamos el servidor con http.listen() en lugar de app.listen()
httpServer.listen(3000, () => console.log('SERVER ON'))
// no olvidarse de esto si vamos a responder con json. Sino lo muestra vacío
app.use(express.json()) 
 // Reconoce lo que le pasemos en el request como objeto
app.use(express.urlencoded({extended: true}))

// para que todas las rutas de abajo empiecen con /api/productos
app.use("/api/products", router)
// configura nuestro directorio estático
app.use(express.static(__dirname + '/public'));
// escuchamos el puerto

// defino el motor de plantillas (habdlebars)
app.engine('handlebars',handlebars.engine())

// especifica la carpeta de plantillas (handlebars)
app.set('views', './public')
app.set('view engine', 'handlebars')
        

/////////////// RUTAS API ///////////////////////

// trae toda la lista
router.get("/", (req, res) => {
    knexProducts.getAll()
    .then(products => {
        res.json(products)
    })
})

// trae un objeto de la lista
router.get("/:id", (req, res) => {
    const id = req.params.id
    knexProducts.find(id)
    .then(product => {
        res.json(product)
    })
})

// inserta un objeto en la lista
router.post("/", (req, res) => {
    knexProducts.insert(new Product(null, req.body.title, +req.body.price, req.body.thumbnail))
    .then(response => {
        res.json(response)
    })
})

// actualiza un objeto de la lista
router.put("/:id", (req, res) => {
    knexProducts.update(new Product(req.body.id, req.body.title, req.body.price, req.body.thumbnail))
    .then((response) => {
        res.json(response)
    })
})

// elimina un objeto de la lista
router.delete("/:id", (req, res) => {
    knexProducts.delete(req.params.id)
    .then((response) => {
        res.json(response)
    })
})

/////////////// RUTAS WEB ///////////////////////

app.get("/", async (req, res) => {
    const products = await knexProducts.getAll()
    res.render('index', {products})
})


io.on('connection', (socket) => {

    // products

    socket.on('newProduct', async data => {
       id = await knexProducts.insert(data)
       data.id = id
       io.sockets.emit('newProduct', data);
    })

});