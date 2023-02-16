(require("dotenv")).config()
const express = require("express")
const cors = require("cors")

const userRouter = require("./routes/user")
const supplierRouter = require("./routes/supplier")
const ingredientRouter = require("./routes/ingredient")
const foodRouter = require("./routes/food")

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/suppliers', supplierRouter)
app.use('/api/ingredients', ingredientRouter)
app.use('/api/foods', foodRouter)

app.listen(3000, () =>
    console.log('REST API server ready at: http://localhost:3000'),
)