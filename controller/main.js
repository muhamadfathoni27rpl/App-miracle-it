const   jwt     =   require('jsonwebtoken'),        
        fs      =   require('fs'),
        hash2   =   require('cryptr'),              //Crypt                   
        hash2_  =   new hash2('cryptr'),  
        enc     =   require('decode-encode-binary'),         
        mail    =   require('nodemailer'),             
        // users   =   require('../models/ac_user'),                        
        dbSQL   =   require('../models/sc_database'),                
        barang  =   require('../models/barang'),
        keranjang = require('../models/keranjang'),
        katalog =   require('../models/katalog'),
        pesanan = require('../models/pesanan'),
        eqq     =   fs.readFileSync('./security/index.s',{encoding:'utf8'}),
        aKunKu  =   (hash2_.decrypt(enc.decode(eqq))),EmailKu =   aKunKu.split(",")[0].split("=")[1],PasswordKu = aKunKu.split(",")[1].split("=")[1]                                         
        function acak(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }    
        function kirimEmail(penerima , datane , subject ) {                                    
            // Kirim Link Konfirmasi                           
               let transporter = mail.createTransport({
                   service: "gmail",
                   
                   auth: { user: EmailKu, pass: PasswordKu }
               });
               let mailOptions = {
                   from: EmailKu,
                   to: penerima,
                   subject: subject,
                   text: "verifi email",
                   html: '<img src="https://i.ibb.co/gWkzBQf/PESANAN.png" style="text-align : center; width: 70%;">'
                   +'<div style="text-align:center;">'+datane+'</div>'
               };
               transporter.sendMail(mailOptions, (err, info) => {
                   if (err) throw err;
                   else {                     
                    res.json({info:{status : 1 , pesan : "Silahkan Cek Email "+penerima , type : "success" , intro : "BERHASIL !"}})
                   }
               })             
           //Tutup Pesan         
      }

//###########################################GET
exports.start=(req,res)=>{          // End Point /start digunakan agar setiap user yang akses halaman dapat "TOKEN"
    const tokens = req.cookies.session;          
    if(tokens){             //Jika Terdapat token session
        jwt.verify(tokens, "PT-GSI", (err, decoded) => {
            if(err){                //Jika Token tersebut error
                var token = jwt.sign({ guest : acak(30) }, "PT-GSI", {expiresIn: "1d"});  
                res.cookie('session',token)                                                           
            }
            else if(decoded.login == 'admin'){  //Jika Terdapat Session admin
                res.clearCookie('session')
            }
            return res.redirect('/index')
        });  
    }else{
        var token = jwt.sign({ guest : acak(30) }, "PT-GSI", {expiresIn: "1d"});                                                             
        res.cookie('session',token)                                                           
        return res.redirect('/index')
    }            
}
exports.index=(req,res)=>{            
    console.log(PasswordKu)
    barang.findAll().then(dataBarang=>{         //Query Barang        
        res.render('user_index',{dataBarang : dataBarang})
    })
}
exports.project=(req,res)=>{        
    barang.findAll().then(dataBarang=>{         //Query Barang
        res.render('user_project',{dataBarang : dataBarang})
    })
}
exports.about=(req,res)=>{        
    barang.findAll().then(dataBarang=>{         //Query Barang
        res.render('user_about',{dataBarang : dataBarang})
    })
}
exports.catalog=(req,res)=>{        
    barang.findAll().then(dataBarang=>{         //Query Barang
        res.render('catalog',{dataBarang : dataBarang})
    })
}
exports.user=(req,res)=>{        
    barang.findAll().then(dataBarang=>{         //Query Barang
        res.render('user_index',{dataBarang : dataBarang})
    })
}
exports.hubungi=(req,res)=>{        
    barang.findAll().then(dataBarang=>{         //Query Barang
        res.render('user_hubungi',{dataBarang : dataBarang})
    })
}




//CATALOG LINK
exports.catalog=(req,res)=>{        
    var id = req.params.key
    katalog.findOne({where:{id_katalog : id}}).then(dataKatalog=>{
        if(dataKatalog){
            barang.findAll({where:{katalog : dataKatalog.id_katalog}}).then(dataBarang=>{         //Query Barang
                res.render('user_catalog',{dataBarang : dataBarang, dataKatalog :dataKatalog})
            })
        }else{
            res.send('tidak ada')
        }
    })    
}


exports.barang=(req,res)=>{ 
    var key = req.params.key       // req.params berarti mengambil data dari url , "contoh user.php?id=1"  1 itu adalah params / parameter
    barang.findOne({where:{url : key}}).then(dataBarang=>{
        if(dataBarang){ //Jika URL sesuai dengan database            
            res.render('user_detail',{dataBarang : dataBarang})
        }else{
            res.redirect('/')
        }
    })
}
exports.checkoutGet=(req,res)=>{
    keranjang.findAll({where:{akses : req.decoded.guest}}).then(dataKeranjang=>{                
        var totalHarga = 0        
        for (let i = 0; i < dataKeranjang.length; i++) {            
            let x = parseInt(dataKeranjang[i].harga_keranjang)                        
            totalHarga += x
        }  
        console.log(totalHarga);
        res.render('user_checkout',{total : totalHarga})
    })    
}

exports.pembayaranGet=(req,res)=>{
    res.render('user_pembayaran')
}

exports.hapusKeranjang=(req,res)=>{
    var id = req.params.id
    keranjang.findOne({where:{id_keranjang : id}}).then(dataKeranjang=>{
        if(dataKeranjang){
            if(dataKeranjang.akses == req.decoded.guest){
                keranjang.destroy({where:{id_keranjang : id}})
                res.redirect('/keranjang')
            }else{
                res.redirect('/index')
            }
        }else{
            res.redirect('/index')
        }
    })
}









//###########################################POST
exports.orderBarang=(req,res)=>{    
    var key = req.params.key    
    barang.findOne({where:{url : key}}).then(dataBarang=>{      //Query Barang
        if(dataBarang){
            keranjang.findAll({where:{akses : req.decoded.guest , id_barang : dataBarang.id_barang}}).then(dataKeranjang=>{            //Query keranjang                
                if(dataKeranjang.length > 0){           // Jika Barang tersebut sudah ada di database                                        
                    var data = {
                        stok_keranjang : parseInt(dataKeranjang[0].stok_keranjang) + parseInt(req.body.jumlah),
                        harga_keranjang : parseInt(dataBarang.harga) * (dataKeranjang[0].stok_keranjang + parseInt(req.body.jumlah))
                    }                                        
                    console.log("stok keranjang = " +data.stok_keranjang + "      < =       stok.barang = "+dataBarang.stok);
                    console.log("stok keranjang = " +data.stok_keranjang + " > 0");
                    if(data.stok_keranjang <= dataBarang.stok && data.stok_keranjang > 0 ){     //Jika Jumlah Barang pesanan <= Stok Barang yang tersedia dan lebi dari 0                        
                        keranjang.update(data,{where:{akses : req.decoded.guest , id_barang : dataBarang.id_barang}})
                        req.session.message = {
                            type: 'success',
                            intro: 'SUKSES ',
                            message: 'Produk Telah Masuk Keranjang'
                        }                         
                    }else{
                        req.session.message = {
                            type: 'error',
                            intro: 'ERROR !',
                            message: 'Jumlah Barang yang Anda masukan Tidak valid'
                        }                        
                    }                 
                    res.redirect('/index')    
                }else{                    
                    var data = {
                        akses : req.decoded.guest,
                        id_barang : dataBarang.id_barang,
                        stok_keranjang : req.body.jumlah,
                        harga_keranjang : dataBarang.harga * parseInt(req.body.jumlah)
                    }
                    if(data.stok_keranjang <= dataBarang.stok && data.stok_keranjang > 0 ){                    
                        keranjang.create(data)                    
                        req.session.message = {
                            type: 'success',
                            intro: 'SUKSES ',
                            message: 'Produk Telah Masuk Keranjang'
                        }                                          
                    }else{
                        req.session.message = {
                            type: 'error',
                            intro: 'ERROR !',
                            message: 'Jumlah Barang yang Anda masukan Tidak valid'
                        }
                    }
                    res.redirect('/index') 
                }            
            })            
        }else{
            res.redirect('/')
        }
    })
}
exports.keranjang=(req,res)=>{
    var guest = req.decoded.guest           //Menggunakan Manual QUERY untuk JOIN tabel
    var sql = "SELECT * FROM keranjangs INNER JOIN barangs ON keranjangs.id_barang = barangs.id_barang WHERE akses = '"+guest+"'"
    dbSQL.db.query(sql,(err,dataKeranjang)=>{                    
        var totalHarga = 0
        for (let i = 0; i < dataKeranjang.length; i++) {            
            let x = parseInt(dataKeranjang[i].harga_keranjang * dataKeranjang[i].stok_keranjang)            
            console.log(x);
            totalHarga += x
        }                
        // console.log(totalHarga);
        var	number_string = totalHarga.toString(),                  // Konvert Format Rupiah 3 digit
            sisa 	= number_string.length % 3,
            rupiah 	= number_string.substr(0, sisa),
            ribuan 	= number_string.substr(sisa).match(/\d{3}/g);		
        if (ribuan){separator = sisa ? '.' : '';rupiah += separator + ribuan.join('.');}        
        if(dataKeranjang.length > 0){            //Jika Terdapat keranjang            
            res.render('user_keranjang',{       //akan tampil datanya "dataKeranjang"
                dataKeranjang : dataKeranjang,
                harga : rupiah
            })        
        }else{
            res.render('user_keranjang',{dataKeranjang : 0})                    // dataKeranjang akan bernilai 0
        }    
    })
}

exports.checkoutPost=(req,res)=>{
    pesanan.findOne({where:{akses : req.decoded.guest}}).then(cekPesanan=>{
        if(cekPesanan){
            pesanan.destroy({where:{akses :req.decoded.guest}})
        }
        var sql = "SELECT * FROM keranjangs INNER JOIN barangs ON keranjangs.id_barang = barangs.id_barang WHERE akses = '"+req.decoded.guest+"'"
        dbSQL.db.query(sql,(err,dataKeranjang)=>{              
            if(dataKeranjang.length > 0){
                var x = [], total = 0            
                for (let i = 0; i < dataKeranjang.length; i++) {                
                    let y = dataKeranjang[i]
                    x.push({idBarang : y.id_barang , namaBarang : y.nama , jumlah : y.stok_keranjang})
                    total += parseInt(y.harga_keranjang)
                }
                var keranjangs = JSON.stringify(x)
                // console.log(JSON.parse(tes));
                var data = {
                    akses : req.decoded.guest,
                    nama_penerima : req.body.nama,
                    telepon_penerima : req.body.telepon,
                    provinsi : req.body.provinsi,
                    kk : req.body.kk,
                    kecamatan : req.body.kecamatan,
                    kodepos : req.body.kodepos,
                    detail : req.body.detail,
                    status : 0,
                    barang : keranjangs,
                    validasi : '$'
                }
                pesanan.create(data)                //Membuat Pesanan            
                res.redirect('/pembayaran')
            }else{
                res.redirect('/')
            }
        })    
    })    
}

exports.pembayaranPost=(req,res)=>{
    pesanan.findOne({where:{akses : req.decoded.guest}}).then(dataPesan=>{                        
        if(dataPesan != null ){
            var barange = JSON.parse(JSON.parse(dataPesan.barang))              
            console.log(barange);
            console.log(barange[0].jumlah);
            var x = ''                                                
            for(var oi  = 0 ; oi < barange.length ; oi++){                                
                let t =  oi
                var jumlah = barange[oi].jumlah                      
                barang.findOne( {where:{ id_barang : barange[t].idBarang }   }).then(dataBarang=>{                                                                                               
                    let stokBaru = (dataBarang.stok - parseInt(barange[t].jumlah));                                        
                    if(barange[t].jumlah <= dataBarang.stok){                                                                                                
                        if((t + 1) == barange.length){                                                        
                            // console.log(t);
                            barang.update({stok : stokBaru},{where:{id_barang : barange[t].idBarang}})      //Update Stok Barang Setelah membayar
                            kirimEmail('EMAIL_ADMIN@gmail.com',
                            '<h3>Informasi Penerima</h3>'
                            +'<table style="width:100%">'
                            +'<tr><td>Nama Penerima </td><td>'+dataPesan.nama_penerima +'</td></tr>'
                            +'<tr><td>Nomor Telepon </td><td>'+dataPesan.telepon_penerima +'</td></tr>'
                            +'<tr><td>Alamat </td><td>'+dataPesan.detail +'</td></tr>'
                            +'<tr><td>Kecamatan </td><td>'+dataPesan.kecamatan +'</td></tr>'
                            +'<tr><td>Kabupaten / Kota </td><td>'+dataPesan.kk +'</td></tr>'
                            +'<tr><td>Provinsi </td><td>'+dataPesan.provinsi +'</td></tr>'
                            +'<tr><td>Kode Pos </td><td>'+ dataPesan.kodepos+'</td></tr>'
                            +'</table>'
                            +'<br>'
                            +'<h5>Pesanan</h5>'
                            +'<table style="with : 100%">'        
                            +x
                            +'</table>',
                            'Pesanan Barang')                                                                              
                            pesanan.update({status : 1},{where:{akses : req.decoded.guest}})        
                            keranjang.destroy({where:{akses : req.decoded.guest}})      //Menghapus Keranjang
                            req.session.message = {
                                type: 'success',
                                intro: 'SUKSES',
                                message: 'Barang Pesananan Anda Sedang diproses , anda akan segera dihubungi'
                            }                          
                            return res.redirect('/index')
                        }else{
                            console.log("next");                            
                        }
                    }else{                                                                        
                        console.log("w");                        
                        req.session.message = {
                            type: 'warning',
                            intro: 'Perhatian !',
                            message: 'Terjadi Miss Data , Silahkan Cek Kembali di katalog kami'
                        }                                                
                        return res.redirect('/index')
                    }                                    
                })                                                    
                x+= '<tr><td>Nama Barang </td><td>'+barange[oi].namaBarang +'</td></tr><tr><td>Jumlah Barang </td><td>'+barange[oi].jumlah +'</td></tr>'
            }                                                                                                      
        }else{
            console.log("akses di blok");
            res.redirect('/')
        }
    })
}
exports.hubungiPost=(req,res)=>{
    let nama = req.body.name ,
        email = req.body.email,
        pesan = req.body.pesans;            
    if(email == '' || email == ' ' || email == NaN || email == null || email.length <= 6){
        req.session.message = {
            type: 'error',
            intro: 'ERROR !',
            message: 'Email Dibutuhkan'
        }
        res.redirect('/hubungi')
    }else{
        var ketEmail = email.split('@')[1].toLowerCase()
        if(ketEmail == 'gmail.com' || ketEmail == 'yahoo.com' || ketEmail == 'yahoo.co.id' || ketEmail == 'yandex.com' || ketEmail == 'sesuatu.com'){
            kirimEmail('EMAIL_ADMIN@gmail.com', //Email Admin / Email Penerima , bukan pengirim
            '<h3>Dari : '+email+' </h3>'
            +'<h5> Atas nama : '+nama+ ' </h5>'
            +'<p>'+pesan+'</p>',
            'Hubungi Kami')    
            req.session.message = {     //Pesan
                type: 'success',
                intro: 'Berhasil',
                message: 'Pesan anda telah terkirim ke admin kami'
            }
            res.redirect('/hubungi')
        }else{
            req.session.message = {
                type: 'error',
                intro: 'ERROR !',
                message: 'Email Tidak diperbolehkan'
            }
            res.redirect('/hubungi')
        }
    }    
}