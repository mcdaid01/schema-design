const StudentsController =  require('../controllers/students_controller')

// maybe should be in separate files, I don't think will need that many?

module.exports = (app) => {
	// NOTE making most of these get fro easy access from browser, will change later

	
	
	// get a school based on its object id
	app.get('/api/school/:id',StudentsController.school)
	
	// get all the students from a school based on its id
	app.get('/api/students/:id',StudentsController.students)

	// get a student based on school id and student id
	app.get('/api/schoolid/:id',StudentsController.schoolId)

	// get some useful data which I might use in testing or to set enviroment variables in postman
	app.get('/api/data',StudentsController.data)

	// get list of every school, teacher and student
	app.get('/api/datalists',StudentsController.datalists)
	
	// sort of mock login system 
	app.post('/api/student',StudentsController.student)

	// sort of mock login system 
	app.post('/api/student',StudentsController.student)
	
	// add new students to a school
	app.post('/api/students',StudentsController.pushStudents)
	

	//app.put('/api/drivers/:id',DriversController.edit)
	//app.delete('/api/drivers/:id',DriversController.delete)
	//app.get('/api/drivers',DriversController.index) 
}
