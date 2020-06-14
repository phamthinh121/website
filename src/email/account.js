const sgMail = require('@sendgrid/mail')

sgMail.setApiKey('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')

const sendWelcomeEmail = (email,name)=>{
   sgMail.send({
        to: email,
        from: 'ganbaruppt@gmail.com',
        subject:'thank you for joining in!',
        text:`welcome , ${name} .to this app`
    })
}
const sendGoodbyeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'ganbaruppt@gmail.com',
        subject:"thank you and goodbye",
        text:`thanks you ${name}, see you again`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}