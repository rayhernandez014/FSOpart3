const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let entries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(cors())
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
    response.json(entries)
})

app.get('/info', (request, response) => {
    const date = new Date()
    const entriesTotal = entries.length
    response.send(`Phonebook has info for ${entriesTotal} people <br /> ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)  
    const entry = entries.find(entry => entry.id === id)
    if (entry) {    
        response.json(entry)  
    } else {    
        response.status(404).end()  
    }
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

    else if(entries.filter((entry) => entry.name.toLowerCase() === body.name.toLowerCase()).length > 0){
        return response.status(400).json({
            error: 'Name must be unique' 
          })
    }
  
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
  
    entries = entries.concat(person)
  
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })