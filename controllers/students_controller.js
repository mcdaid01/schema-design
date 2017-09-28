// typical to have a file for each typr of of controller, so if had todos would have todo_controller and so on
const Student = require('../models/student')
const School = require('../models/school')

// possibly would separate to a module
const getSchool = async (schoolId,fields)=>{
	const school = await School.findById(schoolId,fields)

	if (school===null)
		throw (`${schoolId} not found!`)
	
	return school
}

module.exports = {
	greeting(req,res){
		res.send({'hi':'there'})
	},

	school(req,res,next){
		const schoolId= req.params.id
		
		getSchool(schoolId)
			.then( school=> school === null ? res.status(404).send(`${schoolId} not found`) : res.send(school) )
			.catch(next)
	},

	async students(req,res,next){
		
		const schoolId= req.params.id
		try{
			const school = await School.findById(schoolId)

			if (school===null)
				throw (`${schoolId} not found`) // probably better to throw an error
			
			const students = await Student.find({ _id: { $in: school.students.map( ob => ob._id ) } })
			
			res.send(students)
		}
		catch(e){
			next(e)
		}
	},

	async student(req,res,next){
		const [schoolId,studentId] = [req.params.schoolid,req.params.id]

		console.log(schoolId,studentId)

		res.send(getSchool(schoolId),{students:1})

		//res.send({schoolId,studentId})
	},

	async seed(req,res,next){
		const schools = await School.find({}).limit(2)
		res.send(schools)
	},
	
	create(req,res,next){ // another convention is 'create' name
		
	//	const driverProps = req.body
		
	//	Driver.create(driverProps)
	//		.then(driver => res.send(driver))
	//		.catch(next) // super important as won't go to next middleware if error
	},

	edit(req,res,next){
	//	const driverId= req.params.id
	//	const driverProps= req.body

		// the driver returned does not contain the updates
		// so need to send again
	
	//	Driver.findByIdAndUpdate(driverId,driverProps)
	//		.then(()=> Driver.findById(driverId))
	//		.then(driver => res.send(driver))
	//		.catch(next)
	},

	//delete(req,res,next){
	//	const driverId= req.params.id
	//	Driver.findByIdAndRemove(driverId)
	//		.then(driver => res.status(204).send(driver))
	//		.catch(next)
	//}
}
