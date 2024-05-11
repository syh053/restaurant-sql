// 建立 server
const express = require('express')
const app = express()
const port = 3000


//建立路由路徑
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/restaurants', (req, res) => {
    res.send('Here is restaurants list')
})


app.get('/restaurants/new', (req, res) => {
    res.send('creat new restaurant')
})


app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id
    res.send(`Here is restaurant page : ${ id }`)
})


app.get('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id
    res.send(`edit restaurant page : ${id}`)
})


app.post("/restaurants", (req, res) => {
    res.send("add restaurants")
} )


app.put("/restaurants/:id", (req, res) => {
    res.send('modify restaurants')
})


app.delete("/restaurants/:id", (req, res) => {
    res.send('delete restaurants')
})


//express.listening
app.listen(port, () => {
    console.log(`express server running on http://localhost:${port}`)
})