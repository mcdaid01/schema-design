const [mongoose, faker, _] = [require('mongoose'), require('faker'), require('lodash')]

const [School, Teacher, Student] = [require('../models/school'), require('../models/teacher'), require('../models/student')]

const [schoolMin, teacherMin, studentMin] = [2, 5, 20]

const dropCollections = () => Promise.all([School.collection.drop(),Teacher.collection.drop(),Student.collection.drop()])

const addSchools = () => { // note alwats adds one so resolves promise
	return School.count().then(count => Promise.all(_.times(schoolMin - count, () => createSchool())))
}

const addTeachers = async (schoolIds)=>{ // same as above just working out which is easier to read
	const count = await Teacher.count()
	await Promise.all(_.times(teacherMin-count, ()=> createTeacher(schoolIds)))
}

const addStudents = async (schoolIds)=>{
	const count = await Student.count()
	await Promise.all( _.times(studentMin-count, ()=> createStudent(schoolIds)))

	//return 'anything' // seems the return was not important but have to await the creation process
	// in someways the addSchools is cleaner and should remember if used babel on front end the generated
	// code for the async can be horrendous
}

// want to be able to use the ids in assigning newly created teachers 
const getSchoolIds = async ()=>{
	// have to query the database if want to use all the schools, otherwise would only get those added
	const schools = await School.find({},{_id:1})
	
	return schools.map(school => school._id )
}

const createSchool = ()=>{

	const lastWord = () => _.sample(['Secondary School','High School','Academy','Middle School'])

	const schoolProps = {
		name: `St ${faker.name.firstName()} ${lastWord()}`,
		address:[faker.address.streetAddress(),faker.address.county(),faker.address.state()], // state easier to query 
		zipcode:faker.address.zipCode(),
		active:Math.random()>0.2
	}
	
	return School.create(schoolProps)
}
 
const createTeacher= async (schoolIds)=>{
	const schoolId =  _.sample(schoolIds)

	const teacherProps = {
		//schoolId : mongoose.mongo.ObjectId( _.sample(schoolIds)),
		name : faker.name.findName(),
		email : faker.internet.email(), // could use this as login rather username
		password : faker.address.state().toLowerCase()
	}

	const teacher = await Teacher.create(teacherProps)
	const details = { _id: teacher._id, password: faker.address.state().toLowerCase() }

	await School.findOneAndUpdate({
		_id:schoolId
	}, {
		$push: { teachers: details }
	})
}

const createStudent= async(schoolIds)=>{
	const [first,last]=[faker.name.firstName(),faker.name.lastName()]
	const schoolId =  _.sample(schoolIds)
	
	const studentProps = {
		name : `${first} ${last}`,
		user : first.charAt(0)+last
	}

	const student = await Student.create(studentProps)
	const details = { _id: student._id, password: faker.address.state().toLowerCase() }

	await School.findOneAndUpdate({
		_id:schoolId
	}, {
		$push: { students: details}
	})
}

const seed = async ()=>{
	await dropCollections()
	await addSchools()
	const schoolIds = await getSchoolIds()
	await addTeachers(schoolIds)
	await addStudents(schoolIds)
}

const getOneSchool = ()=> School.findOne({})

// queries will be separated out eventually

// gets one school and then finds the students in it
const listStudents = async ()=>{
	const school = await getOneSchool() // note would not want to fetch the whole school 
	const ids = school.students.map( ob => ob._id )
	const students = await Student.find({ _id: { $in: ids } })
	
	return students
}

const listTeachers = async ()=>{
	const school = await getOneSchool() // note would not want to fetch the whole school 
	const ids = school.teachers.map( ob => ob._id )
	const teachers = await Teacher.find({ _id: { $in: ids } })
	
	return teachers
}

//seed().then(()=>console.log('done'))

seed().then(()=>listStudents()).then( students=> console.log(students) )

//seed().then(()=>listTeachers()).then( teachers=> console.log(teachers) )


// may as well build the queries onto here, can then separate them out when done 
