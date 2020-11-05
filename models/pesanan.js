const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "pesanan",
  {
    id_pesan:{
      defaultValue: Sequelize.UUID,
      type: Sequelize.UUID,
      primaryKey: true
    },
    akses : {type:Sequelize.STRING},
    nama_penerima : {type:Sequelize.STRING},
    telepon_penerima : {type:Sequelize.TEXT},
    provinsi : {type:Sequelize.STRING},
    kk : {type:Sequelize.STRING},
    kecamatan : {type:Sequelize.STRING},
    kodepos : {type:Sequelize.INTEGER},
    detail : {type:Sequelize.TEXT},
    status :{type : Sequelize.INTEGER},
    barang : {type : Sequelize.JSON},
    validasi : {type:Sequelize.STRING}
  },
  { timestamps: false }
);
