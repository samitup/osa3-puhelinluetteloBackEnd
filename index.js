
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))
app.use(bodyParser.json())

app.use(cors())

app.use(morgan('tiny'))



let api = [

  persons = [
    {
      name: "Erkki Esimerkki",
      number: "040-123456",
      id: 1
    },
    {
      name: "Pentti Desimaalimerkki",
      number: "040-765433",
      id: 2
    },
    {
      name: "Jorma Uotila",
      number: "040-456789",
      id: 3
    },
    {
      name: "Sirpa-Leena Unelma",
      number: "040-76543",
      id: 4
    }
  ]

]

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/api/info', (req, res, next) => {
  Person.countDocuments({}).then(peopleCount => {
    res.send(`Phonebook has info for ${peopleCount} people` +
      `<p>${new Date().toISOString()} <p>`

    )
  })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(p => {
    res.json(p.map(prson => prson.toJSON()))
  })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))

})


const generateId = () => {
  const generatedId = Math.floor(Math.random() * 1000)
  console.log(`generoitu id ${generatedId}`)
  return (
    generatedId
  )
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  if (persons.some(p => p.name === body.name)) {
    return res.status(400).json({
      error: `Name '${body.name}' is already in the phonebook`
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      res.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedNote => {
      console.log(updatedNote)
      res.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})





const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})