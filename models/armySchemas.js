const mongoose = require('mongoose')

// Tyranid UnitsSchema
const UnitsSchema = new mongoose.Schema({
    unitName:{type:String, required: true},
    //m:{type: Number},
    //t:{type: Number},
    //sv:{type: Number},
    //w:{type: Number},
    //ld: {type: String},
    //oc: {type:Number},
    //indexCard: {type: String},
})


// Army Info
const armyInfoSchema = new mongoose.Schema({
    name: { type: String, required: true},
    armyRule: { type: String, required: true},
    armyLogo: { type: String, required: true}, 
    armyRuleText: {type: String, required: true},
    avalibleUnits: [UnitsSchema]// each army info schema should have its own different untis that it can recruit
})

// Player List schema
const playerArmyListSchema = new mongoose.Schema({
    ArmyInfo: [armyInfoSchema],// should be passed into the list after clicking create
    listName: {type: String},
    author: {type: String},
    unitsInList:{type: Array}
}) 



const armyInfo = mongoose.model('armyInfo', armyInfoSchema)
const Units = mongoose.model('Units', UnitsSchema)
const playerArmyList = mongoose.model('playerArmyList', playerArmyListSchema)

module.exports = {
    armyInfo,
    playerArmyList
}
