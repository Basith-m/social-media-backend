import exppress from 'express'
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'
import authRoute from './Routes/authRoute.js'
import userRoute from './Routes/userRoute.js'
import postRoute from './Routes/postRoute.js'
import uploadRoute from './Routes/uploadRoute.js'

const app = exppress();

// To serve images for public
app.use(exppress.static('public'))
app.use('/images', exppress.static("images"))

// middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
dotenv.config()

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(process.env.PORT, () => console.log(`social media server started at ${process.env.PORT} and waiting for request..`)))
.catch((err) => console.log(err))

// usage of routes
app.use('/auth',authRoute)
app.use('/user',userRoute)
app.use('/post',postRoute)
app.use('/upload', uploadRoute)