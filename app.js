const   express    = require('express'),
bodyparser = require('body-parser'),
cuki       = require('cookie-parser'),
sesion     = require('express-session'),
fileApld   = require('express-fileupload'),
router     = require('./routes/router'),
http       = require('http'),
app        = express(),
port       = 3000;

//Setup
app.set('view engine','ejs') 
app.use(fileApld())
app.use(cuki())
app.use(express.static('public'))
app.use(sesion({ name: 'notif',secret : 'pesan',resave:false,saveUninitialized:true,cookie:{maxAge:null}}))
app.use((req, res, next)=>{ 
res.locals.message = req.session.message
delete req.session.message
next()
})
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
router(app)

//Menghubungkan Server Nodejs
var server = http.createServer(app).listen(port, function(){
    console.log("Server mlaku , http://localhost:" + port);
});  