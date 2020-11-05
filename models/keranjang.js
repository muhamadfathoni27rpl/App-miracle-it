const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "keranjang",
  {
    id_keranjang:{
      defaultValue: Sequelize.UUID,
      type: Sequelize.UUID,
      primaryKey: true
    },    
    akses     : {type:Sequelize.STRING},             
    id_barang : {type:Sequelize.INTEGER},   
    stok_keranjang      : {type : Sequelize.INTEGER},
    harga_keranjang     : {type : Sequelize.TEXT}
  },
  { timestamps: false }
);
