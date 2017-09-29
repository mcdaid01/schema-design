const mongoose = require('mongoose')

before(done =>{
	
	mongoose.connect('mongodb://localhost/school_test',{useMongoClient: true})
	mongoose.connection
		.once('open',()=>{
			console.log('database ready')
			done()
		})
		.on('error', err => {
			console.warn('warning',err)
		})
})

// beforeEach(done => {
// 	const { schools } = mongoose.connection.collections
// 	schools.drop()
// 		//.then(() => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))
// 		.then(() => done())
// 		.catch(() => done())
// })
