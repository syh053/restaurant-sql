// 建立 server
const express = require('express')
const app = express()
const port = 3000

// 環境變數 NODE_ENV 為 "development" 時，設定 SESSION_SECRET
if (process.env.NODE_ENV === 'development') {
  // 套用 dotenv 套件
  require('dotenv').config()
}

// 載入 express-session
const session = require('express-session')

// 載入 connect-flash
const flash = require('connect-flash')

// 載入訊息處理 middleware
const message = require('./middlewares/message-handler')
const errMessage = require('./middlewares/error-message-handler')

// 載入 routes
const router = require('./routes/index')

// 載入 method-override 套件
const methodOverride = require('method-override')

// 載入 express-correlation-id 套件
const correlator = require('express-correlation-id')

// 載入 passport
const passport = require('passport')

// 設定樣板引擎
const engine = require('express-handlebars').engine
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

// 載入 handlebars 並設定自定義判斷條件
const handlebars = require('handlebars')

handlebars.registerHelper('sort', (arg1, arg2) => {
  return arg1 === arg2
})

// 對所有的 request 進行前置處理
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(correlator())

// session 設定
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(message)

app.use(router)

app.use(errMessage)

// express.listening
app.listen(port, () => {
  console.log(`express server running on http://localhost:${port}/login`)
})
