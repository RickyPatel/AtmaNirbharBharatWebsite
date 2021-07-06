var nodemailer = require('nodemailer'); //mailgun and sg
const sgMail = require('@sendgrid/mail'); //sg
sgMail.setApiKey(process.env.SENDGRID_API_KEY); //sg
var sgTransport = require('nodemailer-sendgrid-transport'); //sg

//sg
var transport = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: '##',
    pass: '##'
  }
});
//sg

//mailgun
// MAILGUN_USER = '##';
// MAILGUN_PASSWORD = '##';

// var transport = nodemailer.createTransport({
// 	service: 'Mailgun',
// 	auth: {
// 		user: MAILGUN_USER,
// 		pass: MAILGUN_PASSWORD	
// 	},
// 	tls:{
// 		rejectUnauthorized: false
// 	}
// });
//mailgun

//same for both
module.exports = { 
	sendEmail(from, to, subject, html){
		return new Promise((resolve, reject) => {
			transport.sendMail({ from, subject, to, html},(err, info) => {
				if(err) reject(err);
				console.log("mail sent succesfully");
				resolve(info);
			});
		});
	}
}