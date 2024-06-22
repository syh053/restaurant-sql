const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../db/models')
const User = db.User

// 載入雜湊套件
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: { email: username }
    })
        .then( user => {
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
        
        .then( user => {
            bcrypt.compare(password, user.password)
                .then(res => {
                    if (!res) { return done(null, false, { type: 'error', message: 'email 或 密碼輸入錯誤!!' }) }
                    return done(null, user)
                })
        })
            
        .catch(err => { done(err) })
}))

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

module.exports = router