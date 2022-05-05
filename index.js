const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('reqBody', function (req, res) { return JSON.stringify(req.body)})

app.use(
    morgan(function (tokens, req, res) {
        return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.reqBody(req, res)
        ].join(' ')
    })
)

app.get('/api/persons', (request, response) => {
    Person.find({}).then( persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    const entriesTotal = entries.length
    response.send(`Phonebook has info for ${entriesTotal} people <br /> ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then( person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    entries = entries.filter(entry => entry.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*1000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Information is missing' 
      })
    }

    const person = new Person({
        name: body.name,
        number: body.number
      })
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })