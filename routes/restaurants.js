const express = require('express')
const router = express.Router()

const db = require("../db/models")
const { Op } = require('sequelize')
const Restaurant = db.Restaurant


//建立路由路徑
router.get('/', (req, res) => {
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
        .catch(err => {
            console.log(`ID for this request is: ${req.correlationId()}, message: ${err.message}`)
            res.status(500).json({ message: 'Unhandled error', requestId: 'randomId_1xxxxx' })
        })

})


router.get('/new', (req, res) => {
    res.render('new')
})


router.get('/:id', (req, res) => {
    const id = req.params.id
    Restaurant.findOne({
        where: { id: id },
        raw: true
    })
        .then(restaurant => res.render("detail", { restaurant }))
        .catch(err => {
            console.log(`ID for this request is: ${req.correlationId()}, message: ${err.message}`)
            res.status(500).json({ message: 'Unhandled error', requestId: 'randomId_1xxxxx' })
        })
})


router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    Restaurant.findOne({
        where: { id: id },
        raw: true
    })
        .then(restaurant => res.render("edit", { restaurant }))
        .catch(err => {
            console.log(`ID for this request is: ${req.correlationId()}, message: ${err.message}`)
            res.status(500).json({ message: 'Unhandled error', requestId: 'randomId_1xxxxx' })
        })
})


router.post("/", (req, res) => {
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
        .catch(err => {
            console.log(`ID for this request is: ${req.correlationId()}, message: ${err.message}`)
            res.status(500).json({ message: 'Unhandled error', requestId: 'randomId_1xxxxx' })
        })

})


router.put("/:id", (req, res) => {
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
        .catch(err => {
            console.log(`ID for this request is: ${req.correlationId()}, message: ${err.message}`)
            res.status(500).json({ message: 'Unhandled error', requestId: 'randomId_1xxxxx' })
        })
})


router.delete("/:id", (req, res) => {
    const id = req.params.id
    Restaurant.destroy({
        where: { id: id }
    })
        .then(() => res.redirect("/restaurants"))
        .catch(err => {
            console.log(`ID for this request is: ${req.correlationId()}, message: ${err.message}`)
            res.status(500).json({ message: 'Unhandled error', requestId: 'randomId_1xxxxx' })
        })
})

module.exports = router