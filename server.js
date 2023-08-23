// .env require
require('dotenv').config()

// Express Requires
const express = require('express')
const app = express()
const PORT = 3000

// Requires for Seed data
const armies = require('./models/armySchemas') // Army Rules Schema

// Mongoose Requires
const mongoose = require('mongoose')

// .env imports
const mongoURI = process.env.mongobd_URI

// Connect to mongo DB
mongoose.connect(mongoURI)

// mongo connection messages
const db = mongoose.connection 
db.on('error', (err)=>console.log(err + 'error with mongo connection'))
db.on('connected', ()=>console.log('mongo is connected'))
db.on('disconnected', ()=>console.log('mongo is disconnected'))

// Middleware
app.use(express.urlencoded({extended: true}))

// Server Listen
app.listen(PORT, () =>{
    console.log(`App is listening on ${PORT}`)
})

app.get('/', async (req, res)=>{
    const listOfArmies = await armies.armyInfo.find({})
    res.render('index.ejs', {
        armiesList: listOfArmies
    })
})

// Route that shows the create page for the choosen faction
app.get('/createlist/:id', (req, res) =>{
    res.render('listCreate.ejs', {
        currentArmy: [req.params.id]
    })
})


// Route that posts to the database
app.post('/createlist/:id', async (req,res) => {
    let armyName = [req.params.id]
    armyRulset = await armies.armyInfo.find({name: armyName})
    res.send(armyRulset)

})


// Route that deletes the created list when the user hits back button







// Seed Route
app.get('/seedArmy', async (req, res) => {
    const newArmy = await armies.armyInfo.create ([
        {
            name: 'Tyranids',
            armyRule: 'https://i.imgur.com/7wMBDCM.png',
            armyLogo:'https://i.imgur.com/NLa6RQp.png',
            armyRuleText: "[Will Insert in the future]"
        }
    ])
    res.redirect('/')
    console.log('Army Info Seeded')
})
app.get('/seedUnit', async (req,res)=>{
    const army = await armies.armyInfo.findById('64e19a2cf40180c5b787ccac')
    console.log(army.name)
    army.avalibleUnits.push({
        unitName: 'warrior'
    })
    await army.save()
})