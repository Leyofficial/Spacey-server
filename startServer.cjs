const mongoose = require('mongoose')

exports.startServer = async (server,PORT) => {

  require('dotenv').config()
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => console.log('DB connection successful')).catch(err => {
    console.log(`DB connection has some problem`, err)
  });

  server.listen(PORT,() => {
    console.log(`App running on ${PORT}`)
  })
}