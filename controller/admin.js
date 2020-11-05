const jwt = require('jsonwebtoken'),   
    fs = require('fs'),
    barang = require('../models/barang'),
    pesanan = require('../models/pesanan'),
    dbManual = require('../models/sc_database')
    function acak(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }    

// GET main
exports.admin_router=(req,res)=>{    
    const tokens = req.cookies.session;  
    if (!tokens) return res.status(401).redirect("/admin/login"); //Jika Tidak ada session
      jwt.verify(tokens, "PT-GSI", (err, decoded) => {
        if(err){res.redirect('/admin/login')}   //Jika Session salah
        else{
          res.redirect('/admin/index')      //Jika Session benar , redirect index
        }
    });
}
exports.admin_login = (req,res)=>{                    
    res.render('admin_login')    
}
exports.admin_index=(req,res)=>{
    if(req.decoded.login == 'admin'){   //Jika Terdapat Session admin
        var sql = 'SELECT * FROM barangs INNER JOIN katalogs ON barangs.katalog = katalogs.id_katalog'
        dbManual.db.query(sql,(err,dataBarang)=>{
            pesanan.findAll({where:{status : 1}}).then(dataPesan=>{                 
                res.render('admin_index' , {dataBarang : dataBarang , dataPesan : dataPesan })
            })
        })                    
    }       
    else{
        res.redirect('/admin/login')
    }
}
exports.hapusBarang=(req,res)=>{
    if(req.decoded.login == 'admin'){ //Jika Terdapat Session Admin
        console.log('HAPOS')
        barang.destroy({where:{id_barang : req.params.id}})
        res.redirect('/admin/index')         
    }else{
        res.redirect('/')
    }
}

//POST main
exports.adminLogin=(req,res)=>{
    var username = req.body.username    
    if(username == 'YourPasswordIsMyPassword'){ //jika username == ahsiapbosque
        var token = jwt.sign({ login : 'admin' }, "PT-GSI", {expiresIn: "1d"});                                                             
        res.cookie('session',token)
        res.json({info:{status : 1 , pesan : "Anda Benar" , type : "success" , intro : "Berhasil"}})
    }    
    else{
        res.json({info:{status : 0 , pesan : "username salah" , type : "error" , intro : "ERROR !"}})
    }
}
exports.tambahBarang=(req,res)=>{
    if(req.decoded.login == 'admin'){ //Jika Terdapat Session Admin
        if(req.files){
            var akhire = (req.files.foto.mimetype);        
            var format = akhire.split('image/')[1]            
              if(format == 'jpeg' || format == 'jpg' || format == 'png' ){ //Format gambar
                let codeKonfirmasi = new Date().getTime() + Math.floor(Math.random() * Math.floor(999)) + '.'+format;          
                fs.writeFile('./public/images/barang/barang' + codeKonfirmasi, req.files.foto.data, (err) => {
                    if(err){console.log(err);}
                })  
                var data = {
                    url : acak(14),
                    nama : req.body.nama,
                    stok : req.body.stok,
                    harga : req.body.harga,
                    deskripsi : req.body.deskripsi,
                    kelebihan  : req.body.kelebihan,
                    kekurangan : req.body.kekurangan,
                    fitur   : req.body.fitur,
                    katalog : req.body.katalog,
                    foto : 'barang'+codeKonfirmasi
                }                                
                barang.findOne({where : {nama : data.nama}}).then(dataBarang=>{        
                    //validasi level dasar 
                    if(dataBarang){ //Jika Barang sudah ada
                        req.session.message = {
                            type: 'warning',
                            intro: 'Perhatian !',
                            message: 'Barang Sudah Tersedia'
                        }                                  
                    }else if(data.nama.length == 0 || data.nama == ' ' || data.nama == ''){
                        req.session.message = {
                            type: 'error',
                            intro: 'ERROR !',
                            message: 'Nama Barang Dibutuhkan'
                        }                                  
                    }else if(data.stok < 0){ //Jika stok bernilai 'negatif'
                        req.session.message = {
                            type: 'error',
                            intro: 'ERROR !',
                            message: 'Stok Barang tidak boleh kosong'
                        }                                      
                    }else{
                        barang.create(data)
                        // console.log(data)
                        req.session.message = {
                            type: 'success',
                            intro: 'Sukses',
                            message: 'Data Berhasil ditambahkan'
                        }                                         
                    }            
                    res.redirect('/admin/index')         
                })  
              }else{
                req.session.message = {
                    type: 'error',
                    intro: 'ERROR !',
                    message: 'Hanya Boleh .jpeg .jpg .png'
                }  
                res.redirect('/admin/index')
              }           
        }else{
            req.session.message = {
                type: 'error',
                intro: 'ERROR !',
                message: 'Foto barang dibutuhkan'
            }  
            res.redirect('/admin/index')
        }
    }else{
        res.redirect('/')
    }      
}
exports.updateBarang=(req,res)=>{
    if(req.decoded.login == 'admin'){ //Jika Terdapat Session Admin
        if(req.files){
            var akhire = (req.files.fotoBarang.mimetype);        
            var format = akhire.split('image/')[1]            
              if(format == 'jpeg' || format == 'jpg' || format == 'png' ){ //Format gambar
                let codeKonfirmasi = new Date().getTime() + Math.floor(Math.random() * Math.floor(9999)) + '.'+format;          
                fs.writeFile('./public/images/barang/barang' + codeKonfirmasi, req.files.fotoBarang.data, (err) => {
                    if(err){console.log(err);}
                })  
                var data = {
                    nama : req.body.namaBarang,
                    harga : req.body.hargaBarang,
                    stok : req.body.stokBarang,
                    foto : 'barang'+codeKonfirmasi
                }
                barang.update(data , {where :{id_barang : req.body.id}})
                req.session.message = {
                    type: 'success',
                    intro: 'Sukses',
                    message: 'Barang Berhasil di update'
                }  
                res.redirect('/admin/index')
              }else{
                req.session.message = {
                    type: 'error',
                    intro: 'ERROR !',
                    message: 'Hanya Boleh .jpeg .jpg .png'
                }  
                res.redirect('/admin/index')
              }           
        }else{
            var data = {
                nama : req.body.namaBarang,
                harga : req.body.hargaBarang,
                stok : req.body.stokBarang                
            }
            barang.update(data , {where :{id_barang : req.body.id}})
            req.session.message = {
                type: 'success',
                intro: 'Sukses',
                message: 'Barang Berhasil di update'
            }  
            res.redirect('/admin/index')
        }
    }else{
        res.redirect('/')
    }
}
