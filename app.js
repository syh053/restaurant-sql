// 建立 server
const express = require('express')
const app = express()
const port = 3000

//載入 routes
const router = require("./routes/index") 


//載入 method-override 套件
const methodOverride = require('method-override')


//載入 express-correlation-id 套件
const correlator = require('express-correlation-id')


//設定樣板引擎
const engine = require("express-handlebars").engine
app.engine(".hbs", engine({ extname: '.hbs' }))
app.set("view engine", ".hbs")
app.set("views", "./views")



//對所有的 request 進行前置處理
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(correlator())
app.use(router)



//express.listening
app.listen(port, () => {
    console.log(`express server running on http://localhost:${port}`)
})