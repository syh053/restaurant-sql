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
    res.render('new')
})


app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id
    Restaurant.findOne({ 
        where: { id: id },
        raw: true
     })
        .then( restaurant => res.render("detail", { restaurant }) )
        .catch(err => res.status(422).json(err))
})


app.get('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id
    Restaurant.findOne({
        where: { id: id },
        raw: true
    })
        .then(restaurant => res.render("edit", { restaurant }))
        .catch(err => res.status(422).json(err))
})


app.post("/restaurants", (req, res) => {
    const body = req.body
    console.log( body.name )
    console.log( body.category )
    Restaurant.create( {
        name: body.name,
        name_en: body.en_name,
        category: body.category,
        image: body.photo_source,
        location: body.address,
        phone: body.phone,
        google_map: body.google_address,
        rating: body.rating,
        description: body.description
    } )
        .then( () => res.redirect("/restaurants") )
        .catch( err => res.status(422).json(err))

} )


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
        .then( () => res.redirect(`/restaurants/${id}`) )
        .catch(err => res.status(422).json(err))
})


app.delete("/restaurants/:id", (req, res) => {
    const id = req.params.id
    Restaurant.destroy({
        where: { id : id }
    })
        .then( () => res.redirect("/restaurants") )
        .catch(err => res.status(422).json(err))
})


//express.listening
app.listen(port, () => {
    console.log(`express server running on http://localhost:${port}`)
})