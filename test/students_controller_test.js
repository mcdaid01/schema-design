require('./test_helper') // so connection happens first
const _ = require('lodash')
const request = require('supertest')
const mongoose = require('mongoose')
const assert = require('assert')
const app = require('../app')
const seedTestData = require('../seed/seed_school')
const Student = require('../models/student')
const School = require('../models/school') 

const [newSeed, schools, teachers, students] = [true, 1, 1, 1]

console.log('student_controller_test')

const seed=(done)=>{
	seedTestData(schools,teachers,students).then(()=>{
		console.log('seeding done')
		done()
	})
}

before(function(done){
	this.timeout(4000)
	console.log('newSeed',newSeed)
	newSeed ? seed(done) : done()
})

describe('Fetch datalists check counts', ()=>{
	it ('GET request to /api/datalists',done=>{
		request(app)
			.get('/api/datalists')
			.expect(200)
			.end((err,res)=>{
		
				const body = res.body
				console.log( body.schools.length,body.teachers.length,body.students.length )
				assert(body.schools.length === schools)
				assert(body.teachers.length === teachers)
				assert(body.students.length === students)
				
				done()
			})
	})
})

let school_id, schoolId, student

describe('Fetch data and use response to check further routes', ()=>{

	it ('GET request to /api/data',done=>{
		request(app)
			.get('/api/data')
			.expect(200)
			.end((err,res)=>{
				
				const body = res.body
				school_id = body[0]._id
				schoolId = body[0].id
				done()
			})
	})

	it ('GET request to /api/school/:id',done=>{
		request(app)
			.get(`/api/school/${school_id}`)
			.expect(200)
			.end((err,res)=>{

				assert(res.body._id ===  school_id)
				done()
			})
	})

	it ('GET request to /api/schoolid/:id',done=>{
		request(app)
			.get(`/api/schoolid/${schoolId}`)
			.expect(200)
			.end((err,res)=>{
				
				student = _.sample(res.body.students)
				
				console.log(student.id,student.password)
				
				done()
			})
	})

	it ('GET request to /api/students/:id',done=>{
		request(app)
			.get(`/api/students/${school_id}`)
			.expect(200)
			.end((err,res)=>done() )
	})

	/*
		this.buildLink('POST /student','student','get a user back based on schoolId studentId',
			{'schoolId':data[1].id,id,password})

	*/
	
	// eventually need a proper login route
	it ('POST request correct login details to /api/student',done=>{
		request(app)
			.post('/api/student')
			.send({id:student.id,password:student.password,schoolId})
			.expect(200)
			.end((err,res)=>{
				
				assert(res.body._id ===student._id)
				done()
			})
	})

	it ('POST request refuses with incorrect to /api/student',done=>{
		request(app)
			.post('/api/student')
			.send({id:student.id,password:'bollocks',schoolId})
			.expect(401)
			.end((err,res)=>{
				
				assert(_.isEmpty(res.body))
				done()
			})
	})
})

describe('Add a set of students to a school', ()=>{

	const students = [{name:'Mike Hunt'},{name:'Joe King'}]
	let origCount, subCount

	it ('checks students count before and after to see if students have been added',done=>{
		Student.count().then(count=>count)
			.then(count=> origCount=count)
			.then(()=> School.aggregate( {$group: {_id: school_id, count: {$sum: {$size: '$students'}}}}))
			.then(arr=> subCount=arr[0].count )
			.then(()=>{	
				
				return new Promise( (resolve,reject)=>{
					request(app)
						.post('/api/students')
						.send({_id:school_id,students})
						.expect(200)
						.end((err,res)=>resolve () )
				})
			})
			.then(()=>Student.count() )
			.then(count=> assert(origCount+students.length===count))
			.then(()=> School.aggregate( {$group: {_id: school_id, count: {$sum: {$size: '$students'}}}}))
			.then(arr=> {
				console.log(arr)
				assert(subCount+students.length === arr[0].count) 
				done()
			})
	})

	// add a test for adding students with invalid school_id

	it ('checks student is in the collection',done=>{
		const name = 'Al Coholic'
		request(app)
			.post('/api/students')
			.send({_id:school_id,students:[ {name }]})
			.expect(200)
			.end((err,res)=>{
				console.log(res.body)
				
				Student.find({name}).then(students=>{
					console.log(students)
					
					assert(students.length===1)
					return students[0]._id

					
				}).then(_id=>{
					// now try and find in the subdocument
					School.find({_id:school_id},
						{_id:0, teachers:0, active:0, address:0, students:{$elemMatch:{_id}  } }).then(arr=>{
						console.log('***********************')
						console.log(arr[0].students)
						done()
					})
				})
			})
	})

	//it ('check')

	// it ('GET request to /api/datalists',done=>{
	// 	request(app)
	// 		.get('/api/datalists')
	// 		.end((err,res)=>{
				
	// 			assert(res.statusCode === 200)
	// 			const body = res.body
	// 			console.log( body.schools.length,body.teachers.length,body.students.length )
	// 			assert(body.schools.length === schools)
	// 			assert(body.teachers.length === teachers)
	// 			assert(body.students.length === students)
				
	// 			done()
	// 		})
	// })
})


/*const assert = require('assert')

const Driver = mongoose.model('driver') // note not require, mocha may have required it and the file gets run twice

describe('Drivers Controller', () => {
	it('Post to /api/drivers creates a new driver', done => {
		// check the count before and after, note maybe not best test as doesn't check actual email is the same
		Driver.count().then(count => {
			request(app)
				.post('/api/drivers')
				.send({
					email: 'test@test.com'
				})
				.end((err, response) => {

					Driver.count().then(newCount =>{
						assert(count+1 === newCount)
						done()
					})	
				})
		})
	})

	it('PUT to /api/drivers/id edits an existing driver',done=>{
		const driver = Driver.create({email:'mike@example.com'})
			.then(result=> { 
				const id = result._id
				const newEmail = 'newmail@example.com'
				console.log('id=',id)

				request(app)
					.put(`/api/drivers/${id}`)
					.send({email:'newmail@example.com'})
					.end((err,response)=>{
						
						assert(response.body.email === 'newmail@example.com' ) // probably not enough

						Driver.findById(id).then(result=>{
							assert(result.email === newEmail)
							done()
						})
					})
			})
	})

	it('DELETE to /api/drivers/id can delete a driver',done=>{
		const driver = new Driver({email:'test@test.com'})

		driver.save().then(()=>{
			request(app)
				.delete(`/api/drivers/${driver._id}`)
				.end((err,response)=>{
					Driver.findOne({email:'test@test.com'})
						.then(driver=>{
							assert(driver===null)
							done()
						})
				})
		})
	})

	it('Get to /api/drivers finds drivers in a location', done => {
		const seattleDriver = new Driver({
		  email: 'seattle@test.com',
		  geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
		})
		const miamiDriver = new Driver({
		  email: 'miami@test.com',
		  geometry: { type: 'Point', coordinates: [-80.2534507, 25.791581] }
		})
	
		Promise.all([seattleDriver.save(), miamiDriver.save()])
		  .then(() => {
				request(app)
			  .get('/api/drivers?lng=-80&lat=25')
			  .end((err, response) => {
						//console.log(response.body)
						assert(response.body.length === 1)
						assert(response.body[0].obj.email === 'miami@test.com')
						done()
			  })
		  })
	  })
})
*/
