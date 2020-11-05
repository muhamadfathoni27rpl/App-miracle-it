var mysql = require('mysql')
var koneksi = mysql.createConnection({    
    host:'localhost',
    user:'root',
    password:'',
    database:'psg_1',
    multipleStatements:true
})

module.exports.db = koneksi;
