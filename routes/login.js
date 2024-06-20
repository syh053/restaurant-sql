const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy =require('passport-local')

const db = require('../db/models')
const User = db.User

passport.use(new LocalStrategy({ usernameField : 'email'}, (username, password, done) => {
    User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: { email: username }
    })
    .then( user => {
        if (!user || user.password !== password) { done(null, false, { type: 'error', message: 'email 或 密碼輸入錯誤!!' }) } 
        return done(null, user)
    })
    .catch( err => { done(err) })
}))

passport.serializeUser( (user,done) => {
    console.log('serializeUser :', user)
    const { id, name, email } = user
    return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
    console.log('deserializeUser :', user)
    return done(null, {id: user.id})

})

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', passport.authenticate('local', {
    successRedirect: '/restaurants',
    failureRedirect: '/login',
    failureFlash:true
}))

module.exports = router