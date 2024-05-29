const express = require('express')
const router = express.Router()


const restaurants = require("./restaurants")


router.use("/restaurants", restaurants )


//建立路由路徑
router.get('/', (req, res) => {
    res.send('Hello World!')
})

module.exports = router