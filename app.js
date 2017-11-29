const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const request = require('request');

const app = express();

let config = require('./config.js');

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.get('/', (req, res) => {
    res.render('contact');
    
});

app.get('/send', function(req, res){
    res.sendFile(__dirname + "./views/contact.handlebars");
})

app.post('/send', (req, res) => {
    var captcha = req.body['g-recaptcha-response'];

    if(
       captcha === undefined || 
       captcha === '' || 
       captcha === null 
    ){
        //return res.json({"success": false, "msg":"Please select captcha"});
        return res.render('contact', {msg:'Merci de remplir le captcha'});
    }

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${config.recaptcha.secretKey}&response=${captcha}&remoteip=${req.connection.remoteAdress}`;

    // Make Request to VerifyURL
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        // If not successful
        if(body.success !== undefined && !body.success){
            return res.json({"success": false, "msg":"La vérification du captcha a échouée"});
        }

        // If successful
        // return res.json({"success": true, "msg":"Captcha correct, carte envoyée !"});        
        
    });

    const output = `
      <h3>${req.body.name}</h3>
      <h3>Message</h3>
      <p>${req.body.message}</p>
      <h3>Pièces jointes</h3>
      ${req.body.file}
    `;

     var mailAttachments = [];
       if(!req.files){
            console.log("Aucun fichier téléchargé");
        }else{
            console.log("Fichier téléchargé");
            var file = req.files.file;
            var extension = path.extname(file.name);
            console.log(file.name, file.mimetype)
            mailAttachments.push({
                filename: file.name,
                content: file.data,
                contentType: file.mimetype
            });
        
        }

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: config.mailOptions.host, 
            port: config.mailOptions.port,
            secure: config.mailOptions.secure, 
            auth: {
                user: config.mailOptions.auth.user, 
                pass: config.mailOptions.auth.pass  
            },
            tls:{
                rejectUnauthorized: config.mailOptions.tls.rejectUnauthorized
            }
        });
         
        // setup email data with unicode symbols
        let mailOptions = {
            from: config.mailOptions.from,
            to: config.mailOptions.to,
            subject: config.mailOptions.subject, 
            html: output,
            attachments:mailAttachments
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
                return res.render('contact', {msg:"L'envoi de votre Email a échoué"});
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.render('contact', {msg:'Votre Email a bien été envoyé'});
        });
    });

app.listen(3000, () => console.log('Server started...'));