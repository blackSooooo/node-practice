const express = require('express');

const app = express();

const p1 = require('./routes/p1')(app)
app.use('/p1', p1)
const p2 = require('./routes/p2')
app.use('/p2', p2)

app.listen(3000, () => {
    console.log('3000 port is connected !!')
})