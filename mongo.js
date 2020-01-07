const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-pnpl7.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name: name,
  number: number
})

if(process.argv.length < 4) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(p => {
      console.log(p)

    })
    mongoose.connection.close()
  })
}else{
  person.save().then(response => {
    console.log(`added ${person.name} ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}