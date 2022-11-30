var aws = require('aws-sdk');
aws.config.update({region:'us-east-1'})
var ses = new aws.SES({ region: "us-east-1" });
var docClient = new aws.DynamoDB.DocumentClient();

exports.handler = async function (event) {
    let message = event.Records[0].Sns.Message
    let json = JSON.parse(message);
    let email = json.username;
    let token = json.token;
    const seconds = 5 * 60;
    const secondsInEpoch = Math.round(Date.now() / 1000);
    const expirationTime = secondsInEpoch + seconds;
    const currentTime = Math.round(Date.now() / 1000);

const mailbody = `
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
      <p>Hi, ${email}</p>
      <p>Please verify your email</br>
      <b>Link will be valid only for 5 minutes!!</b></br>
      Find your link below:</p>
      <p><a href=https://demo.rajatrao.me/v1/verify?token=${token}&email=${email} >
        https://demo.rajatrao.me/v1/verify?token=${token}&email=${email} </a> </p>
        </body></html>
    </body>
</html>`;

var params = {
  
  Destination: {
    ToAddresses: [email],
  },
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: mailbody,
      },
    }, 
    Subject: {
        Charset: "UTF-8",
        Data: "email Verification",
      },
    },
    Source: "sender@demo.rajatrao.me",
  };
  console.log("email sent");
  return ses.sendEmail(params).promise()
  
};
