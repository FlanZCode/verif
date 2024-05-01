const nodemailer = require('nodemailer');
const twilio = require('twilio')
const fs = require('fs');
const { Vonage } = require('@vonage/server-sdk');

class CodeStore {
    storeCode(id, code) {
        throw new Error('Not implemented');
    }

    verifyCode(id, code) {
        throw new Error('Not implemented');
    }
}

class JsonFileCodeStore extends CodeStore {
    storeCode(id, code) {
        let codes = JSON.parse(fs.readFileSync('codes.json', 'utf8'));
        codes[id] = code;
        fs.writeFileSync('codes.json', JSON.stringify(codes));
    }

    verifyCode(id, code) {
        let codes = JSON.parse(fs.readFileSync('codes.json', 'utf8'));
        let isVerified = false;
        if (codes[id] === code) {
            isVerified = true;
            delete codes[id];
            fs.writeFileSync('codes.json', JSON.stringify(codes));
        }
        return isVerified;
    }
}

function createTransporter(host, port, secure, user, password, codeStore = new JsonFileCodeStore()) {
    return nodemailer.createTransport({
        host: host,
        port: port,
        secure: secure,
        auth: {
            user: user,
            pass: password
        }
    });
}

function sendMail(transporter, from, to, title, message, endmessage, codeStore) {
    let code = Math.floor(Math.random() * 1000000);
    transporter.sendMail({
        from: from,
        to: to,
        html: '<html><head><title>' + title + '</title><style>body {font-family: Arial, sans-serif; text-align: center;}.container {width: 80%; margin: auto; background-color: #f2f2f2; padding: 20px; border-radius: 5px; text-align: center;}.code {font-size: 20px; color: #333; font-weight: bold; border: 2px solid blue; padding: 10px;}.footer {background-color: blue; color:white; padding :20px;width :80%;margin:auto;border-radius :5px;text-align:center;}</style></head><body><div class="container"><h2>' + title + '</h2><p>' + message + '</p><p class="code">' + code + '</p><p>' + endmessage + '</p></div><div class="footer"><a href="https://github.com/FlanZCode" style="color:white;">Made by FlanZ❤️</a></div></body></html>'
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            codeStore.storeCode(to, code);
        }
    });
}

function sendTwilioMessage(SID, token, from, to, codeStore) {
    let code = Math.floor(Math.random() * 1000000);
    const client = new twilio(SID, token)
    client.messages.create({
        body:"Here is your code: " + code, from: from, to: to
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            codeStore.storeCode(to, code);
        }
    });
}

function sendVonageMessage(applicationId, privateKey, from, to, codeStore) {
    let code = Math.floor(Math.random() * 1000000);
    const vonage = new Vonage({
        applicationId: applicationId,
        privateKey: privateKey
    })
    vonage.sms.send({
        from: from,
        to: to,
        text: "Here is your code: " + code
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            codeStore.storeCode(to, code);
        }
    });
}
function verifyCode(id, code, codeStore) {
    return codeStore.verifyCode(id, code);
}
module.exports = { createTransporter, sendMail, sendTwilioMessage, sendVonageMessage, verifyCode, CodeStore, JsonFileCodeStore };