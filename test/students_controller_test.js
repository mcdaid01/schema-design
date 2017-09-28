/*const assert = require('assert')
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

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
