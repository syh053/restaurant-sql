// 建立 server
const express = require('express')
const app = express()
const port = 3000


//設定樣板引擎
const engine = require("express-handlebars").engine
app.engine(".hbs", engine({ extname: '.hbs' }))
app.set("view engine", ".hbs")
app.set("views", "./views")



//對所有的 request 進行前置處理
app.use(express.static("public"))


//建立路由路徑
app.get('/', (req, res) => {
    res.send('Hello World!')
})

const datas = require("./public/json/restaurant.json").results
app.get('/restaurants', (req, res) => {
    res.render("index", { datas })
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