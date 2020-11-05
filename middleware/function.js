const jwt = require('jsonwebtoken'),
    enc     =   require('decode-encode-binary'),
    fs      =   require('fs'),
    hash2   =   require('cryptr'),            
    hash4_  =   new hash2('cryptr'),  
    eqq     =   fs.readFileSync('./security/index.s',{encoding:'utf8'}),
    aKunKu  =   (hash4_.decrypt(enc.decode(eqq))),
    EmailKu =   aKunKu.split(",")[0].split("=")[1],PasswordKu = aKunKu.split(",")[1].split("=")[1]
var fnct = function kirimEmail(penerima , datane , subject ) {                                                
    let transporter = mail.createTransport({
        service: "gmail",
        auth: { user: EmailKu, pass: PasswordKu }
    });
    let mailOptions = {
        from: EmailKu,
        to: penerima,
        subject: subject,
        text: "verifi email",
        html: datane                
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        else { 
            return true
        }
    })                        
 } 
var jwts = function jwt_token(req, res, next) {
    const tokens = req.cookies.session;  
    if (!tokens) return res.status(401).redirect("/");
      jwt.verify(tokens, "PT-GSI", (err, decoded) => {
        if(err){res.redirect('/')}
        else{            
          req.decoded = decoded
          req.tokenku = tokens
          next()
        }
    });
  }
 exports.fnct = fnct 
 exports.jwts = jwts