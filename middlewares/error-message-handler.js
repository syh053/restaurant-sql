module.exports = (err, req, res, next) => {
    req.flash("error", err.errMessage || "處理失敗")
    console.log(`ID for this request is: ${req.correlationId()}, message: ${err.errMessage}`)
    res.status(err.statuscode || 500).redirect("back")
}

