const express = require("express")
const errorHandler = require("../mycontacts-backend/middleware/errorHandler")
const { connect } = require("mongoose")
const connectDb = require("./config/dbConnection")
const dotenv = require("dotenv").config()

connectDb()
const app =express()

const port = process.env.PORT

app.use(express.json())
app.use("/api/contacts",require('./routes/contactsRoutes'))
app.use("/api/users",require('./routes/userRoutes'))
app.use(errorHandler)

app.listen(port,()=>{
    console.log(`Server running on port ${port}` )
}) 