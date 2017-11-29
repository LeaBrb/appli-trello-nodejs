let config = {

    // setup email data with unicode symbols
      mailOptions: {
            host: 'smtp.office365.com', 
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'send.mail@nouvellemarque.com', // generated ethereal user
                pass: 'nmarque-2016'  // generated ethereal password
            },
            tls:{
                rejectUnauthorized:false
            },
            from: 'send.mail@nouvellemarque.com', // sender address
            to: 'lea06485695+6ndaf8cebk2wyyx7kdji@boards.trello.com',
            subject: 'Carte envoyée par mail', // Subject line
      },   

      recaptcha: {
          secretKey: '6LcqNDoUAAAAAB3EfIJnmeGoh74GJP2GyaohUJ03'
      }     
};

module.exports = config;
