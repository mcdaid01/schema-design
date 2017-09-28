const mongoose = require('mongoose')
const Schema = mongoose.Schema


// const PointSchema = new Schema({
// 	coordinates: { type: [Number], index: '2dsphere' },
// 	type: { type: String, default: 'Point' }
// })

const accessSchema = new Schema({ // _id is used with the correct one for student
	password:{
		type:String,
		required:true
	}	
})

const SchoolSchema = new Schema({
	name:{
		type: String,
		required:true
	},
	address: {
		type: [String], // so would an item in the array for each line of the address, probably put a limit on it
		required: true
	},
	zipcode: {
		type:String,
		required: true
	},
	active: { // school signs up, when paid they become active
		type: Boolean,
		default: false
	},
	students:{ // embedded document, so to login would get the students _id from this collection, then fetch student
		type:[accessSchema]
	},
	teachers:{
		type:[accessSchema]
	}

})

const School = mongoose.model('school', SchoolSchema)

module.exports = School
