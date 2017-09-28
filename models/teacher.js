const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

// starting point, do student next to figure out links
const TeacherSchema = new Schema({
	name:{
		type: String,
		required:true
	},
	email: {
		type: String, // so would an item in the array for each line of the address, probably put a limit on it
		required: true
	},
	password:{
		type: String,
		required:true
	}//,
	//schoolId:{
	//	type:ObjectId // add required
	//}
})

const Teacher = mongoose.model('teacher', TeacherSchema)

module.exports = Teacher
