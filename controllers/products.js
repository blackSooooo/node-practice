const hello = (req, res) => {
    res.send('Hello world!!!!!!!')
}

const bye = (req, res) => {
    res.send('Bye World!!!!')
}

module.exports = {
    hello,
    bye
}