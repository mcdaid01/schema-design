// typical to have a file for each typr of of controller, so if had todos would have todo_controller and so on
const Student = require('../models/student')
const School = require('../models/school')

// possibly would separate to a module
const getSchool = async (ObjId,fields)=>{
	const school = await School.findById(ObjId,fields)

	if (school===null)
		throw (`${schoolId} not found!`)
	
	return school
}

const getSchoolById = async (id,fields)=>{
	const school = await School.findOne({id:id},fields)

	if (school===null)
		throw (`${schoolId} not found!`)
	
	return school
}



module.exports = {
	
	school(req,res,next){
		const schoolId= req.params.id
		
		getSchool(schoolId)
			.then( school=> res.send(school) )
			.catch(next)
	},

	async students(req,res,next){
		
		const schoolId= req.params.id
		try{
			const school = await getSchool(schoolId)
			const students = await Student.find({ _id: { $in: school.students.map( ob => ob._id ) } })
			res.send(students)
		}
		catch(e){
			next(e)
		}
	},

	async schoolId(req,res,next){
		const {id} = req.params
		

		//console.log(schoolId,studentId)
		const school = await getSchoolById(id) 

		res.send(school)

		//res.send({schoolId,studentId})
	},

	async student(req,res,next){
		//console.log(req.body)
		const {schoolId, id,password} = req.body
		//	const driverProps= req.body
		try{
			// note not perfect, but it works. Possibly aggregat might be better way
			
			// can have more than one match, so could check password too
			const student = await School.find({id:schoolId},
				{_id:0, teachers:0, active:0, address:0, students:{$elemMatch:{id:id}  } })
			
			//const student = await School.find({id:schoolId},{'students.id':id}) // this doesn't work
			
			//console.log(JSON.stringify(student,null,2)) 
			
			res.send(student.pop().students.pop())
		}
		catch (e) {
			console.log(e)
			res.status(404).send(e)
		}
	},

	async data(req,res,next){ 
		const schools = await School.find({},{_id:1,id:1,teachers:1,students:1}).limit(2)

		// this will probably do as can just pick off whats needed 
		// also have info on how many are in the school completely
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
