
const nodemailer = require('nodemailer');
let transport = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    //port:25,
    //port:465,
    port:587,
    //port: 25,
    secure: false,  
    //service:'gmail',
    auth: {
        user: 'support@fotio.ca', 
        pass: 'a5516coca33'
        //pass: 'hususeyrzagvizjr' 
    }
});
module.exports = function sendEmail(to,subject,newUser) {
    const output = `<p>A new photographer subscribed</p>
                    <h3>Contact Details</h3>
                    <ul>
                      <li>Email: ${newUser}</li>
                    </ul>`;
    let mailOptions = {
        from: '"Fotio" <support@fotio.ca>', 
        to: to, 
        subject: subject,  
        html: output // inserts the contact info and message into the email
    };
    transport.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
};