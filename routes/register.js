const express = require('express')
const router = express.Router()

const db = require('../db/models')
const User = db.User

// 載入雜湊套件
const bcrypt = require('bcryptjs')

router.get('/', (req, res) => {
  res.render('register')
})

router.post('/', (req, res) => {
  const { Name, Email, Password, ConfirmPassword } = req.body

  if (!Email) {
    req.flash('error', '未輸入 email !!')
    return res.redirect('back')
  } else if (!Password) {
    req.flash('error', '未輸入密碼!!')
    return res.redirect('back')
  } else if (Password !== ConfirmPassword) {
    req.flash('error', '密碼輸入不一致!!')
    return res.redirect('back')
  }

  User.findOne({
    where: { email: Email }
  })
    .then(user => {
      if (user) {
        req.flash('error', '此 email 已註冊!!')
        return res.redirect('back')
      }

      return bcrypt.hash(Password, 10)
        .then(hash => {
          return User.create({
            name: Name,
            email: Email,
            password: hash
          })
        })

        .then(user => {
          req.flash('success', '註冊成功!!')
          return res.redirect('login')
        })
    })
})

module.exports = router
