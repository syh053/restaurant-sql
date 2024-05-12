// 建立 server
const express = require('express')
const app = express()
const port = 3000


const db = require("./models")
const restaurant = require('./models/restaurant')
const { where } = require('sequelize')
const { Op } = require('sequelize')
const Restaurant = db.Restaurant


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


app.get('/restaurants', (req, res) => {
    const keyword = req.query.keyword?.trim()
    // 搜尋 name, name_en, category, phone, description 是否符合關鍵字
    if ( keyword ) {
        Restaurant.findAll({
            where: { name: { [Op.like]: `%${keyword}%` }},
            raw: true
        })
            .then( restaurants => res.render("restaurants", { restaurants, keyword }))
            .catch( err => res.status(422).json(err))

    } else {
        Restaurant.findAll({
            raw: true
        })
            .then( restaurants => res.render("restaurants", { restaurants }))
            .catch( err => res.status(422).json(err))
    }   
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