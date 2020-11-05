const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "barang",
  {
    id_barang:{
      defaultValue: Sequelize.UUID,
      type: Sequelize.UUID,
      primaryKey: true
    },
    url : {type:Sequelize.STRING},
    nama: {type:Sequelize.STRING},             
    harga :{type:Sequelize.TEXT},   
    stok : {type : Sequelize.INTEGER},
    foto : {type:Sequelize.STRING},
    deskripsi : {type:Sequelize.TEXT},
    kelebihan : {type:Sequelize.STRING},
    kekurangan : {type:Sequelize.STRING},
    fitur : {type:Sequelize.STRING},
    katalog : {type:Sequelize.INTEGER}
  },
  { timestamps: false }
);
