const express = require('express')
const routes =require('./routes/routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const publicPath = path.join(__dirname, './public')
console.log(publicPath)


mongoose.Promise = global.Promise
// todo add error handling stuff


if (process.env.NODE_ENV !=='test'){ // connects in test_helper. Not else because want to use done callback
	mongoose.connect('mongodb://localhost/school',{useMongoClient: true})
	require('./seed/seed_school')
}

const app = express()
app.use(bodyParser.json()) // important called before routes
app.use(express.static(publicPath))

routes(app)

// middleware to deal with errors
// app.use((err,req,res,next)=>{
// 	//console.log('error =',err.message)
// 	res.status(422).send(err.message)
// 	next()
//})


module.exports = app
