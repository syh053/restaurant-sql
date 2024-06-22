const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')
const register = require('./register')
const login = require('./login')
const authHandler = require('../middlewares/auth-handler')

router.use('/restaurants', authHandler, restaurants)
router.use('/registers', register)
router.use('/login', login)

// 建立路由路徑
router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      next(err)
    }

    res.redirect('login')
  })
})

module.exports = router
