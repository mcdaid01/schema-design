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

		if (data)
			$a.data(data).on('click',(evt)=>{
				const $this = $(evt.target)
				evt.preventDefault()
				this.post($this.attr('href'),$this.data())
					.then(data=> console.log(data))
					.catch((e)=>console.log(e))
			})
		
	}

	buildList(data){
		window.data=data
		const student1 = data[1].students[0]
		const {password,id} = student1
		
		this.buildLink('GET /data','data','view the sample data')
		this.buildLink('GET /datalists','datalists','view lists of schools teachers and students')
		this.buildLink('GET /school/:id',`school/${data[0]._id}`,'get school based on its objectId')
		this.buildLink('GET /students/:id',`students/${data[0]._id}`,'list students from a school based on school objectId')
		this.buildLink('GET /schoolId/:id',`schoolid/${data[0].id}`,'get school from it schoolId ')

		// get working without password first, need user
		this.buildLink('POST /student','student','get a user back based on schoolId studentId',
			{'schoolId':data[1].id,id,password})

		// realise this one not making a lot of sense, would be better to do username,schoolId,password
		// would be sent as json anyway, so just concentrate on routes that make sense
		// this.buildLink('GET /api/student/:schoolId/:studentId',`student/${data[1]._id}/${data[1].students[0]._id}`)
		 
	}

	updateSchools(schools){
		console.log(JSON.stringify(schools,null,2))
		const $select=$('#schools').empty()

		schools.forEach(school=>{
			console.log(school)
			$('<option>').val(school._id).html(school.name).appendTo($select)

		})
	}

	seedDatabase() {
		$.post(this.url + '/seed_database', data => this.updateSchools(data))
	}

	postSchools() {
		$.post(this.url + '/schools', data => this.updateSchools(data) )
	}

	postSchoolsId(){
		const id = $('#schools').val()
		console.log(id)
		$.post(`${this.url}/schools/${id}`, data => console.log(JSON.stringify(data,null,2)))
	}

	addListeners() {

		console.log('addListeners', $)
		$('li').on('click', 'a', (evt) => {

			console.log('did it',this===app)
		
			const id = evt.target.id

			const overide = id => {
				evt.preventDefault()
				
				console.log('overide', id)

				this[id]()
			}

			id ? overide(id) : ''

		})
	}
}

console.log($)

const app = new App('http://localhost:3050')
app.addListeners()
