const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

const db = require('../db/models')
const User = db.User

// 載入雜湊套件
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username }
  })
    .then(user => {
      if (!user) { return done(null, false, { type: 'error', message: 'email 或 密碼輸入錯誤!!' }) }

      // 建立正規表達式
      const regex1 = /^\$2a/
      if (!regex1.test(user.password)) {
        return bcrypt.hash(user.password, 10)
          .then(hash => {
            return user.update({ password: hash })
          })
      }

      // 如果密碼已經被雜湊過，直接返回 user
      return user
    })

    .then(user => {
      bcrypt.compare(password, user.password)
        .then(res => {
          if (!res) { return done(null, false, { type: 'error', message: 'email 或 密碼輸入錯誤!!' }) }
          return done(null, user)
        })
    })

    .catch(err => {
      err.errorMessage = '登入失敗'
      done(err)
    })
}))

passport.use(new FacebookStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.callbackURL,
  profileFields: ['displayName', 'email']
}, (accessToken, refreshToken, profile, done) => {
  console.log('accessToken :', accessToken)

  const name = profile.displayName
  const email = profile.emails[0].value

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        const password = Math.random().toString(36).slice(-8)
        const hash = bcrypt.hashSync(password, 10)
        return User.create({
          name,
          email,
          password: hash
        })
          .then(user => done(null, user))
      }
      done(null, user)
    })

    .catch(err => {
      err.errorMessage = '登入失敗'
      done(err)
    })
}
))

passport.serializeUser((user, done) => {
  console.log('serializeUser :', user)
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  console.log('deserializeUser :', user)
  return done(null, { id: user.id })
})

router.get('/', (req, res) => {
  res.render('login')
})

router.post('/', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

module.exports = router
