module.exports = (req, res, next) => {
    res.locals.message = req.flash("success")
    res.locals.errMessage = req.flash("error")
    next()
}