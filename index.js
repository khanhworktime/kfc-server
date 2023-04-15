(require("dotenv")).config()
const express = require("express")
const cors = require("cors")

const userRouter = require("./routes/user")
const supplierRouter = require("./routes/supplier")
const ingredientRouter = require("./routes/ingredient")
const foodRouter = require("./routes/food")
const authRouter = require("./routes/auth")
const facilityRouter = require("./routes/facility")
const uploadImgRouter = require("./routes/uploadImg")
const warehouseRouter = require("./routes/warehouse")

const bodyParser = require("body-parser")

const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/api/', (req, res) => {
    return res.json({success: true, message: "Connected"})
})

app.use(express.static(__dirname))
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/suppliers', supplierRouter)
app.use('/api/ingredients', ingredientRouter)
app.use('/api/foods', foodRouter)
app.use('/api/facilities', facilityRouter)
app.use('/api/uploadImg', uploadImgRouter)
app.use('/api/warehouse', warehouseRouter)

app.listen(3000, () =>
    console.log('REST API server ready at: http://localhost:3000'),
)