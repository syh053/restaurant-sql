// 建立 server
const express = require('express')
const app = express()
const port = 3000


const db = require("./db/models")
// const restaurant = require('./models/restaurant')
// const { where } = require('sequelize')
const { Op } = require('sequelize')
const Restaurant = db.Restaurant


//載入 method-override 套件
const methodOverride = require('method-override')


//設定樣板引擎
const engine = require("express-handlebars").engine
app.engine(".hbs", engine({ extname: '.hbs' }))
app.set("view engine", ".hbs")
app.set("views", "./views")



//對所有的 request 進行前置處理
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


//建立路由路徑
app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/restaurants', (req, res) => {
    const keyword = req.query.keyword?.trim()

    /* 搜尋 name, name_en, category, phone, description 是否符合關鍵字
    下面透過三元運算子定義 option 的值 */

    const option = keyword ? {
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${keyword}%` } },
                { name_en: { [Op.like]: `%${keyword}%` } },
                { category: { [Op.like]: `%${keyword}%` } },
                { phone: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } }
            ]
        }, raw: true
    } : { raw: true }
    Restaurant.findAll(option)
        .then(restaurants => res.render("restaurants", { restaurants, keyword }))
        .catch(err => console.log(err))
        
})


app.get('/restaurants/new', (req, res) => {
    res.render('new')
})


app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id
    Restaurant.findOne({
        where: { id: id },
        raw: true
    })
        .then(restaurant => res.render("detail", { restaurant }))
        .catch(err => console.log(err))
})


app.get('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id
    Restaurant.findOne({
        where: { id: id },
        raw: true
    })
        .then(restaurant => res.render("edit", { restaurant }))
        .catch(err => console.log(err))
})


app.post("/restaurants", (req, res) => {
    const body = req.body
    console.log(body.name)
    console.log(body.category)
    Restaurant.create({
        name: body.name,
        name_en: body.en_name,
        category: body.category,
        image: body.photo_source,
        location: body.address,
        phone: body.phone,
        google_map: body.google_address,
        rating: body.rating,
        description: body.description
    })
        .then(() => res.redirect("/restaurants"))
        .catch(err => console.log(err))

})


app.put("/restaurants/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    Restaurant.update({

        name: body.name,
        name_en: body.en_name,
        category: body.category,
        image: body.photo_source,
        location: body.address,
        phone: body.phone,
        google_map: body.google_address,
        rating: body.rating,
        description: body.description
    },

        { where: { id: id } },
    )
        .then(() => res.redirect(`/restaurants/${id}`))
        .catch(err => console.log(err))
})


app.delete("/restaurants/:id", (req, res) => {
    const id = req.params.id
    Restaurant.destroy({
        where: { id: id }
    })
        .then(() => res.redirect("/restaurants"))
        .catch(err => console.log(err))
})


//express.listening
app.listen(port, () => {
    console.log(`express server running on http://localhost:${port}`)
})