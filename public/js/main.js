'use strict'

class App {
	constructor(url) {
		this.url = url

		$.getJSON( url+'/api/data', data => this.buildList(data) )
	}

	post(url,data){
		return new Promise( (resolve,reject)=>{
			
			$.ajax({
				type: 'POST',
				url,
				data:JSON.stringify(data),
				success: (data)=> resolve(data),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				error:(xhr, ajaxOptions, thrownError)=>reject(xhr, ajaxOptions, thrownError)
			  })
		})
	}

	buildLink(desc,path,title,data){
		console.log(path)
		const $li = $('<li>').appendTo($('#actions'))
		const $a= $('<a>')
			.attr({
				href:this.url+'/api/'+path,
				title 
			}).html(desc).appendTo($li)

		const overide = ()=>{
			$a.data(data).on('click',(evt)=>{
				const $this = $(evt.target)
				evt.preventDefault()
				this.post($this.attr('href'),$this.data())
					.then(data=> console.log(data))
					.catch((e)=>console.log(e))
			})
		}

		data ? overide(data) : ''
	}

	buildList(data){
		window.data=data
		const school = data[0]

		const student1 = data[1].students[0]
		const {password,id} = student1
		
		this.buildLink('GET /data','data','view the sample data')
		this.buildLink('GET /datalists','datalists','view lists of schools teachers and students')
		this.buildLink('GET /school/:id',`school/${school._id}`,'get school based on its objectId')
		this.buildLink('GET /students/:id',`students/${school._id}`,'list students from a school based on school objectId')
		this.buildLink('GET /schoolId/:id',`schoolid/${school.id}`,'get school from it schoolId ')

		// get working without password first, need user
		this.buildLink('POST /student','student','get a user back based on schoolId studentId. fake login!',
			{'schoolId':data[1].id,id,password})

		this.buildLink('POST /students','students','simulate adding student',{
			_id:school._id, students : this.seedStudents()
		})


		// realise this one not making a lot of sense, would be better to do username,schoolId,password
		// would be sent as json anyway, so just concentrate on routes that make sense
		// this.buildLink('GET /api/student/:schoolId/:studentId',`student/${data[1]._id}/${data[1].students[0]._id}`)
		 
	}

	seedStudents(total = 3){
		
		const createStudent= ()=>{
			const [first,last]=[faker.name.firstName(),faker.name.lastName()]
			// const schoolId =  _.sample(schoolIds)
			// const id =  first.charAt(0)+last // might be done on the server
			
			return {
				name : `${first} ${last}`
			}
		}
		
		return _.times(total,()=>createStudent()) 
	}
}

console.log($)

const app = new App('http://localhost:3050')
//app.addListeners()
