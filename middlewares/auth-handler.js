const auth_handler = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    req.flash('error', '尚未登入!!')
    return res.redirect('/login')
}

module.exports = auth_handler