const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')
const register = require('./register')
const login = require('./login')

router.use('/restaurants', restaurants)
router.use('/registers', register)
router.use('/login', login)


// 建立路由路徑
router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.post('/logout', (req, res) => {
  res.send('登出')
})

module.exports = router
