const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "katalog",
  {
    id_katalog:{
      defaultValue: Sequelize.UUID,
      type: Sequelize.UUID,
      primaryKey: true
    },    
    nama_katalog: {type:Sequelize.STRING}    
  },
  { timestamps: false }
);
