# Verif

Verif is a project that allows verification via SMS and email.

## Installation

To install the necessary dependencies, run the following command:

```bash
npm install nodemailer twilio fs @vonage/server-sdk
```

## Usage
The project contains several main functions to send verification codes by email and SMS, and to verify these codes.

### Send an email
To send an email, you can use the `sendMail` function. This function generates a random verification code, sends it by email to the user, and stores the code for later verification.

### Send an SMS
To send an SMS, you can use the `sendTwilioMessage` or `sendVonageMessage` functions. These functions generate a random verification code, send it by SMS to the user, and store the code for later verification. (Only works with Twilio and Vonage for the moment)

### Verify a code
To verify a code, you can use the `verifyCode` function. This function checks if the provided code matches the stored code for the user.

### Code storage
Codes are stored in a JSON file thanks to the `JsonFileCodeStore` class, which inherits from the `CodeStore` class. You can create your own storage class by inheriting from `CodeStore` and implementing the `storeCode` and `verifyCode` methods.

### Author
This project was created by FlanZ.