const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000
const helmet = require("helmet");
const http = require('http')
const {globalErrorHandler} = require("./utils/globalErrorHandler.cjs");
const ErrorHandler = require("./utils/ErrorHandler.cjs");
const server = http.createServer(app);
const path = require('path')
const categoryRouter = require("./Routers/CategoryRouters.cjs");
const imageRouter = require("./Routers/Images.cjs");
const reviewRouter = require("./Routers/ReviewRouters.cjs");
const authRouter = require("./Routers/AuthorizationRouters.cjs");
const newsRouter = require("./Routers/NewsRouters.cjs");
const ordersRouter = require('./Routers/OrderRouters.cjs')
const wishRouter = require('./Routers/WishListRouters.cjs')
const orderProcessingRouter = require('./Routers/OrderProcessingRoutes.cjs')
const subscribeRouter = require('./Routers/SubscribeRouters.cjs')
const mongoose = require("mongoose");

app.use(cors())
app.options(["*"], cors({allowedHeaders:"*"}));

require('dotenv').config()
 mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => console.log('DB connection successful')).catch(err => {
  console.log(`DB connection has some problem`, err)
});
app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
app.use(helmet());
app.use(express.json());
app.use(express.static(__dirname + '/public'))



app.use('/api',categoryRouter)
app.use('/uploads',imageRouter)
app.use('/review',reviewRouter)
app.use('/auth',authRouter)
app.use('/news',newsRouter)
app.use('/orders',ordersRouter)
app.use('/wishList',wishRouter)
app.use('/processOrder',orderProcessingRouter)
app.use('/subscribe',subscribeRouter)

app.use('/',(req,res) => {
  res.status(200).sendFile(path.join(__dirname,'./public/documentation.html'))
})
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  next(new ErrorHandler(`Url with this path ${req.originalUrl} doesnt exist`), 404);
})

app.use(globalErrorHandler)



server.listen(PORT,() => {
  console.log(`App running on ${PORT}`)
})

