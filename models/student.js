const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

// lets not complicate it yet by leaving off the dataSchema

// no idea what this should look like, maybe would be further embedded schemas for each type of test
// const DataSchema = new Schema({
// 	 	multiplication: { 
// 			 type: [Number] 
// 	},
// 	division:{
// 		type: [Number]
// 	}
// })

// also maybe usernames and passwords better stored on the school
// with a key to access the actual student from its collection

// starting point, do student next to figure out links

// question also is what is the second thing to index, having a schoolId would make it quick to get, but would probably
// always have the school object anyway	
const StudentSchema = new Schema({
	name:{
		type: String,
		required:true
	 },
	 user:{
		type: String,
		required:true
		// unique:true -- would need to be unique to a school only
	 },
	 groups:[] // so this would mean a teacher could get students in a particular class
	 //,
	// data:{
	// 	type:DataSchema
	// }
})

const Student = mongoose.model('student', StudentSchema)

module.exports = Student 
