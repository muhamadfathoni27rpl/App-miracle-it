const Sequelize = require('sequelize')
const sequelize = new Sequelize("psg_1","root","",{
    host:'localhost',
    dialect:'mysql',    
    operatorAliases: false,
    pool:{
        max:5,
        min:0,
        aquire:30000,
        idle:10000,
    }
})
const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
