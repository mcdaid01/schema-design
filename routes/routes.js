const StudentsController =  require('../controllers/students_controller')

// maybe should be in separate files, I don't think will need that many?

module.exports = (app) => {
	// NOTE making most of these get fro easy access from browser, will change later

	
	// watch for incoming requests of method GET
	// to the route http://localhost:3050/api
	app.get('/api',StudentsController.greeting)

	// get a school based on its id
	app.get('/api/school/:id',StudentsController.school)
	
	// get all the students from a school based on its id
	app.get('/api/students/:id',StudentsController.students)

	// get a student based on school id and student id
	app.get('/api/student/:schoolid/:id',StudentsController.student)

	// get some useful data which I might use in testing or to set enviroment variables in postman
	app.get('/api/seed',StudentsController.seed)

	
	app.post('/api/students',StudentsController.create)
	//app.put('/api/drivers/:id',DriversController.edit)
	//app.delete('/api/drivers/:id',DriversController.delete)
	//app.get('/api/drivers',DriversController.index)
	
}
