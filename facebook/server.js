const express = require('express')
const morgan = require('morgan')
const {connectMongoDb} = require('./Db Connection/connection')
const {logReqRes} = require('./Middlewares/user')
const adminRouter = require('./Routes/admin')
const userRouter = require('./Routes/user')
const userPost = require('./Routes/post')
const userRequest = require('./Routes/friendRequest')
const userLike = require('./Routes/like')
const postComment = require('./Routes/comment')
const notification = require('./Routes/notification')

require('dotenv').config()//env file
const app = express()
const port = process.env.PORT
app.use(morgan('tiny'))
app.use(express.json())

//Middleware
app.use(express.raw({extended:false}))
app.use(logReqRes('log.txt'))///create log.txt


app.use('/images', express.static(__dirname + '/upload'))
console.log("dirname",__dirname)

//Connect Data Base
connectMongoDb("mongodb://localhost:27017/todo").then(()=>console.log('✅ MongoDb connected')).catch((error)=>console.log("Error",error))

app.use('/api/admin',adminRouter)//admin router
app.use('/api/user',userRouter)//user router
app.use('/api/user',userPost)//user post router
app.use('/api/user/request',userRequest)//user friend request router
app.use('/api/user/like',userLike)//user like router
app.use('/api/user/comment',postComment)//user comment router
app.use('/api/user/notification',notification)//user notification router




app.use((req,res,next)=>{
    res.status(404).json({status:"bad request"})
})

app.listen(port,(req,res)=>{
    console.log("Server is running on ",port)
})
