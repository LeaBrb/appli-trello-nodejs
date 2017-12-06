let config = {

    // setup email data with unicode symbols
      mailOptions: {
            host: '', 
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: '', // generated ethereal user
                pass: ''  // generated ethereal password
            },
            tls:{
                rejectUnauthorized:false
            },
            from: '', // sender address
            to: '',
            subject: 'Carte envoyée par mail', // Subject line
      },   

      recaptcha: {
          secretKey: '6LcqNDoUAAAAAB3EfIJnmeGoh74GJP2GyaohUJ03'
      }     
};

module.exports = config;
