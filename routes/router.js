const   multipart = require('connect-multiparty'),
        filePart = multipart(),
        main    = require('../controller/main'),     
        admin   = require('../controller/admin'),
        session = require('../middleware/function')                     
module.exports = app => {
        //###################################################################GET
        //#######################################################################
        // ~admin~
        app.get('/admin/',                          admin.admin_router)
        app.get('/admin/login',                     admin.admin_login)
        app.get('/admin/index',                     session.jwts,admin.admin_index)
        app.get('/admin/hapus_barang/:id',          session.jwts,admin.hapusBarang)
        // ~user~
        app.get('/',                                main.start)                                        
        app.get('/index',                           session.jwts,main.index)
        app.get('/user',                            session.jwts,main.user)
        app.get('/about',                           session.jwts,main.about)
        app.get('/catalog',                         session.jwts,main.catalog)
        app.get('/hubungi',                         session.jwts,main.hubungi)
        app.get('/project',                         session.jwts,main.project)
        app.get('/b/:key',                          session.jwts,main.barang)
        app.get('/keranjang',                       session.jwts,main.keranjang)
        app.get('/checkout',                        session.jwts,main.checkoutGet)
        app.get('/pembayaran',                      session.jwts,main.pembayaranGet)
        app.get('/hapus/:id',                       session.jwts,main.hapusKeranjang)

        //LINK CATALOG [mulai]
        app.get('/catalog/:key',                    main.catalog)
        
        //##################################################################POST
        //######################################################################                
        // ~admin~
        app.post('/admin/login',                    admin.adminLogin)
        app.post('/admin/tambah_barang',            session.jwts,admin.tambahBarang)
        app.post('/admin/update_barang',            session.jwts,admin.updateBarang)
        //~user~
        app.post('/o/:key',                         session.jwts,main.orderBarang)        
        app.post('/checkout',                       session.jwts,main.checkoutPost)
        app.post('/pembayaran',                     session.jwts,main.pembayaranPost)
        app.post('/hubungi',                        session.jwts,main.hubungiPost)
}//TUTUP