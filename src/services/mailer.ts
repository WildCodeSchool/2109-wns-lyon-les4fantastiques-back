import nodemailer from "nodemailer";

export async function createTestCreds(){
    const creds = await nodemailer.createTestAccount();
    console.log({ creds });


let user = {
    email : "",
    pseudo : "",

}

// Create a SMTP transporter object
const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 111,
    secure: false,
});

// Message object
const mailOptions = {
    from: 'Sender <sender@test.fr>',
    to: 'Destinataire <destinataire@test.fr>',
    subject: `Vérification de votre adresse électronique`,
    text: `Merci de cliquer sur le lien suivant pour vérifier votre adresse e_mail : "http://localhost:4200/:token}`
};



return await transporter.sendMail(mailOptions);
}