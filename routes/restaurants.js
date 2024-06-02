const express = require('express')
const router = express.Router()

const db = require('../db/models')
const { Op } = require('sequelize')
const Restaurant = db.Restaurant

// 建立路由路徑
router.get('/', (req, res, next) => {
  // 分類處理
  const sortValue = req.query.sortArrangement || 'ASC'
  let sortOption = []

  switch (sortValue) {
    case 'ASC':
      sortOption = [['name', 'ASC']]
      break

    case 'DESC':
      sortOption = [['name', 'DESC']]
      break

    case 'category':
      sortOption = [['category', 'DESC']]
      break

    case 'location':
      sortOption = [['location', 'DESC']]
      break

    default:
      sortOption = [['name', 'ASC']]
      break
  }

  // 搜尋關鍵字、分頁器處理
  const keyword = req.query.keyword?.trim()
  const page = parseInt(req.query.page) || 1
  const limit = 9

  const option = keyword
    ? {
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { name_en: { [Op.like]: `%${keyword}%` } },
            { category: { [Op.like]: `%${keyword}%` } },
            { phone: { [Op.like]: `%${keyword}%` } },
            { description: { [Op.like]: `%${keyword}%` } }
          ]
        },
        order: sortOption,
        offset: (page - 1) * limit,
        limit,
        raw: true
      }
    : {
        order: sortOption,
        offset: (page - 1) * limit,
        limit,
        raw: true
      }

  Restaurant.findAndCountAll(option)
    .then(({ count, rows }) => {
      const totalPage = Math.ceil(count / 9)

      res.render('restaurants', {
        restaurants: rows,
        keyword,
        currentPage: page,
        totalPage,
        previous: page - 1 >= 1 ? page - 1 : 1,
        previousStep: page - 5 >= 1 ? page - 5 : 1,
        next: page + 1 <= totalPage ? page + 1 : totalPage,
        nextStep: page + 5 <= totalPage ? page + 5 : totalPage,
        sortValue,
        error: req.flash('error')
      })
    })
    .catch(err => {
      err.statuscode = 500
      err.errMessage = '無法取得 restaurants 清單'
      next(err)
    })
})

router.get('/new', (req, res) => {
  res.render('new', { error: req.flash('error') })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  Restaurant.findOne({
    where: { id },
    raw: true
  })
    .then(restaurant => {
      if (!restaurant) {
        req.flash('error', '超出 ID 範圍!!!')
        const err = new Error('找不到這個 id !!!')
        err.statuscode = 404
        next(err)
      } else {
        res.render('detail', { restaurant })
      }
    })
    .catch(err => {
      err.statuscode = 404
      err.errMessage = '無法取得餐廳內容'
      next(err)
    })
})

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  Restaurant.findOne({
    where: { id },
    raw: true
  })
    .then(restaurant => {
      if (!restaurant) {
        req.flash('error', '超出編輯 ID 範圍!!!')
        const err = new Error('找不到這個 id 進行編輯!!!')
        err.statuscode = 404
        next(err)
      } else {
        res.render('edit', { restaurant, error: req.flash('error') })
      }
    })
    .catch(err => {
      err.statuscode = 404
      err.errMessage = '無法取得編輯資料!!'
      next(err)
    })
})

router.post('/', (req, res, next) => {
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
      req.flash('success', '建立成功!!!')
      res.redirect('/restaurants')
    })
    .catch(err => {
      err.statuscode = 404
      err.errMessage = '建立失敗'
      next(err)
    })
})

router.put('/:id', (req, res, next) => {
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

  { where: { id } }
  )
    .then(() => {
      req.flash('success', '資料修改成功!!')
      res.redirect(`/restaurants/${id}`)
    })
    .catch(err => {
      err.statuscode = 404
      err.errMessage = '編輯失敗!!'
      next(err)
    })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Restaurant.destroy({
    where: { id }
  })
    .then(() => {
      req.flash('success', '資料刪除成功!!')
      res.redirect('/restaurants')
    })
    .catch(err => {
      err.statuscode = 404
      err.errMessage = '刪除失敗!!'
      next(err)
    })
})

module.exports = router
