
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))


app.use(bodyParser.json())
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
const peopleCount = persons.length;
let info = [
    
    `Phonebook has info for ${peopleCount} people`,
     new Date().toLocaleString()

    ]

    app.get('/api/persons/:id', (req, res) => {
        const id = Number(req.params.id)
        const people = persons.find(people => people.id === id)
  
        if(people) {
            res.json(people)
        }else {
            res.status(404).end()
        }
        })

app.get('/info', (req, res) => {
    res.json(info)
})
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.delete('/api/persons/:id', (req, res) => {
      const id = req.params.id
      persons = persons.filter(p => p.id != id)
      res.status(204).end()

  })

 
      const generateId = () => {
        const generatedId = Math.floor(Math.random() * 1000)
        console.log(`generoitu id ${generatedId}`)
        return(
            generatedId
        )
      } 
  

  app.post('/api/persons', (req, res) => {
      const body = req.body
      if(!body.name || !body.number){
          return res.status(400).json({
              error: 'name or number missing'
          })
      }
      if(persons.some(p => p.name ===body.name)){
          return res.status(400).json({
              error: `Name '${body.name}' is already in the phonebook`
          })
      }
      const person = {
          name: body.name,
          number: body.number,
          id: generateId()
      }
      persons = persons.concat(person)
      res.json(person)

  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })