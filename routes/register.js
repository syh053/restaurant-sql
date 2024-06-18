const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('register')
})

router.post('/', (req, res) => {
    const { Name, Email, Password, ConfirmPassword } = req.body
    console.log(req.body)

    console.log('Name :', Name)
    console.log('Email :', Email)
    console.log('Password :', Password)
    console.log('ConfirmPassword :', ConfirmPassword)

    if (!Email) {
        req.flash('error', '未輸入 email !!')
        res.redirect('back')
    } else if (!Password) {
        req.flash('error', '未輸入 password !!')
        res.redirect('back')
    } else if (Password !== ConfirmPassword) {
        req.flash('error', '密碼輸入不一致!!')
        res.redirect('back')
    }
    res.send('建立使用者')
})

module.exports = router