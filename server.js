// .env require
require('dotenv').config()

// Express Requires
const express = require('express')
const app = express()
const PORT = process.env.PORT

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
const methodOverride = require('method-override')
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// Server Listen
app.listen(PORT, () =>{
    console.log(`App is listening on ${PORT}`)
})

// Home Route
app.get('/', async (req, res)=>{
    const listOfArmies = await armies.armyInfo.find({})
    const playerLists = await armies.playerArmyList.find({})
    res.render('index.ejs', {
        armiesList: listOfArmies,
        playerList: playerLists
    })
})

// Route that shows the create page for the choosen faction
app.get('/createlist/:id', (req, res) =>{
    res.render('listCreate.ejs', {
        currentArmy: [req.params.id]
    })
})

// route that displays a selected list
app.get('/list/:listId', async (req, res) => {
    const listToDisplay = await armies.playerArmyList.findById(req.params.listId)
    res.render('showlist.ejs', {
        currentList: listToDisplay 
    } )
    
})


// Route that posts to the database
app.post('/createlist/:id', async (req,res) => {
    let armyName = [req.params.id]
    armyRulset = await armies.armyInfo.find({name: armyName})
    const newList = await armies.playerArmyList.create({
        ArmyInfo: armyRulset,
        listName: req.body.listName,
        author: req.body.author,
        unitsInList: []
    })
    //console.log(newList) // DEBUG to make sure the app is pulling the correct army ruleset
    res.redirect(`/editlist/${newList._id}`)

})

// Get page for the Edit army 
app.get('/editlist/:listId', async (req,res) => {
    const displayedArmy = await armies.playerArmyList.findById(req.params.listId)
    //console.log(displayedArmy.listName)// Debug to make sure the correcct army is being grabbed 
    res.render('listEdit.ejs', {
        armyToEdit: displayedArmy
    })

})




// Update Route
app.put ('/editlist/:listId', async (req, res) => {
    //console.log(req.params.listId)
    //const unitToFind = await armies.armyInfo.find({unitName: req.body.thisUnitName})
    const unitToLookFor = req.body.thisUnitName
    const listToLookIn = await armies.playerArmyList.findById(req.params.listId)
    const unitArray = listToLookIn.ArmyInfo[0].avalibleUnits
    const unitObjectLocation = unitArray.findIndex(x => x.unitName === unitToLookFor)
    const arrayToPush = listToLookIn.unitsInList
    arrayToPush.push(listToLookIn.ArmyInfo[0].avalibleUnits[unitObjectLocation])
    //console.log(unitArray)
    //console.log(unitToLookFor)
    //console.log(unitObjectLocation)
    //console.log(listToLookIn.unitsInList.length)
    //console.log(arrayToPush)
    const updatedList = await armies.playerArmyList.findByIdAndUpdate(req.params.listId, {unitsInList: arrayToPush})
    console.log(updatedList)
    res.redirect(`/editlist/${req.params.listId}`)
    
    //console.log(listToLookIn)
    //console.log(unitToAdd)
})

// Route that deletes the created list when the user hits back button
app.delete('/editlist/:listId', async (req, res) => {
    const army = await armies.playerArmyList.findByIdAndDelete(req.params.listId)
    res.redirect('/')

})





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
    const army = await armies.armyInfo.findById('64e19f9466f23ccac9ba8362')
    console.log(army.name)
    army.avalibleUnits.push({
        unitName: 'Tyrannofex'
    })
    await army.save()
})