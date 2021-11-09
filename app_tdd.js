const express = require('express')
const mongoose = require('mongoose');
const app = express()

const PORT = 3000

mongoose.connect(
    "mongodb+srv://The1975:Sincerity_is_scary@cluster0.mhxps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () =>{
    console.log('Connected to mongo instance');
});
db.on('error', (err) => {
    console.log('Error connecting to mongo', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const product = require('./routes/products')
app.use('/products', product)

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message })
})

app.listen(PORT, () => {
    console.log(`${PORT} port is connected !!`)
})

module.exports = app