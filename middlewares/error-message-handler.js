module.exports = (err, req, res, next) => {
  if (err.errMessage || err.message) {
    req.flash('error', err.errMessage || '處理失敗')
    console.log(`ID for this request is: ${req.correlationId()}, message: ${err.errMessage || err.message}`)
    res.status(err.statuscode || 500).send(`${err.errMessage || err.message}`)
  } else {
    req.flash('error', err.errMessage || '處理失敗')
    console.log(`ID for this request is: ${req.correlationId()}, message: ${err.errMessage}`)
    res.status(err.statuscode || 500).redirect('back')
  }
}
