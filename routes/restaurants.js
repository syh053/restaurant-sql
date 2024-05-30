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
        .then(restaurants => {
            res.render("restaurants", {
            restaurants,
            keyword,
            error: req.flash("error")
            })
        })
        .catch( err => {
            err.statuscode = 500
            err.errMessage = "無法取得 restaurants 清單"
            next(err)
        })

})


router.get('/new', (req, res) => {
   
    res.render('new', {  error: req.flash('error') })
    
})


router.get('/:id', (req, res) => {
    const id = req.params.id
    Restaurant.findOne({
        where: { id: id },
        raw: true
    })
        .then( restaurant => {

            if ( !restaurant ) {
                req.flash("error", "超出 ID 範圍!!!")
                const error = new Error("找不到這個 id !!!")
                res.status(500).redirect("/restaurants")
            } else {
                res.render("detail", { restaurant })
            }
            
        } )
        .catch( err => {
            err.statuscode = 404
            err.errMessage = "無法取得餐廳內容"
            next(err)
        })
})


router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    Restaurant.findOne({
        where: { id: id },
        raw: true
    })
        .then(restaurant => {

            if (!restaurant) {
                req.flash("error", "超出編輯 ID 範圍!!!")
                const error = new Error("找不到這個編輯 id !!!")
                res.status(500).redirect("/restaurants")
            } else {
                res.render("edit", { restaurant, error: req.flash("error") })
            }
               
        } )
        .catch( err => {
            err.statuscode = 404
            err.errMessage = "無法取得編輯資料!!"
            next(err)
        })
})


router.post("/", (req, res, next) => {
    const body = req.body

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
        .then(() => {
            req.flash("success", "建立成功!!!")
            res.redirect("/restaurants")
        } )
        .catch( err => {
            err.statuscode = 404
            err.errMessage = "建立失敗"
            next(err)
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
        .then(() => {
            req.flash("success", "資料修改成功!!")
            res.redirect(`/restaurants/${id}`)
        } )
        .catch( err => {
            err.statuscode = 404
            err.errMessage = "編輯失敗!!"
            next(err)
        })
})


router.delete("/:id", (req, res) => {
    const id = req.params.id
    Restaurant.destroy({
        where: { id: id }
    })
        .then(() => {
            req.flash("success", "資料刪除成功!!")
            res.redirect("/restaurants")
        } )
        .catch( err => {
            err.statuscode = 404
            err.errMessage = "刪除失敗!!"
            next(err)
        })
})

module.exports = router