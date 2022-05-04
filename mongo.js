const mongoose = require('mongoose')

if (process.argv.length === 3 || process.argv.length === 5){

    const password = process.argv[2]
    const url = `mongodb+srv://fsopart3:${password}@cluster0.uobj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })
  
    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length === 3) {

        console.log('Phonebook:')

        Person.find({}).then(result => {
            result.forEach(person => {
              console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
          })
          
    }

    else if (process.argv.length === 5){

        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
          })
          
        person.save().then(returnedPerson => {
            console.log(`Added ${returnedPerson.name} number ${returnedPerson.number} to phonebook`)
            mongoose.connection.close()
        })

    }
}

else {
    console.log('Please provide the password as an argument: "node mongo.js <password>" and/or the user and number as arguments "node mongo.js <password> <user> <number>"')
    process.exit(1)
}