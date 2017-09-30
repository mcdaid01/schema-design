const [mongoose, faker, _] = [require('mongoose'), require('faker'), require('lodash')]

const [School, Teacher, Student] = [require('../models/school'), require('../models/teacher'), require('../models/student')]



const getPassword = ()=> faker.address.state().toLowerCase().split(' ').pop()

const dropCollections = async () => {

	try{
		await Promise.all([School.collection.drop(),Teacher.collection.drop(),Student.collection.drop()])
	}
	catch(e){
		console.log('caught') // first time databases may not exist, I think the course did something else
	}
}

const addSchools = (total) => Promise.all(_.times(total, () => createSchool()))

const addTeachers = (schoolIds,total)=> Promise.all(_.times(total, ()=> createTeacher(schoolIds)))

const addStudents = async (schoolIds,total)=> Promise.all( _.times(total, ()=> createStudent(schoolIds)))


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

		// alternative would be a lookup table, once looked up could be stored on the local machine
		// then would allow another indexed field, not sure, means an extra query but only would 
		// happen at login, try this way first as may not need to index another field?
		// if do keep the id then see upserts aggregate count, in the little mongodbo book
		id: faker.address.countryCode()+Math.floor(Math.random()*10000), // faked for now see json/countries.json
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
		password : getPassword()
	}

	const teacher = await Teacher.create(teacherProps)
	const details = { _id: teacher._id, password: getPassword() }

	await School.findOneAndUpdate({
		_id:schoolId
	}, {
		$push: { teachers: details }
	})
}

const createStudent= async(schoolIds)=>{
	const [first,last]=[faker.name.firstName(),faker.name.lastName()]
	const schoolId =  _.sample(schoolIds)
	const id =  first.charAt(0)+last
	
	const studentProps = {
		name : `${first} ${last}`
		//id : first.charAt(0)+last
	}

	const student = await Student.create(studentProps)
	const details = { _id: student._id, password: getPassword(),id }

	await School.findOneAndUpdate({
		_id:schoolId
	}, {
		$push: { students: details}
	})
}

const seedData = async (schools=3, teachers=15, students=30)=>{
	await dropCollections()
	await addSchools(schools)
	const schoolIds = await getSchoolIds()
	await addTeachers(schoolIds,teachers)
	console.log('teachers added')
	await addStudents(schoolIds,students)
	console.log('students added')
	return 'done'
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

//seedData().then((res)=>console.log('seeded',res))


//seedData().then(()=>console.log('done'))

//seedData().then(()=>listStudents()).then( students=> console.log(students) )

//seedData().then(()=>listTeachers()).then( teachers=> console.log(teachers) )

module.exports = seedData

// may as well build the queries onto here, can then separate them out when done 
