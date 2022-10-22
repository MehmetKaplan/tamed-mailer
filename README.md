In order to send automatic mails via Gmail and Microsoft's Office, the complex steps are made procedural with this library.
**NOTE:** Reqiuires `node -v` >= 18. Or can be used with `--experimental-fetch` flag for  `node -v` = 16.

### Grant Mails to Send Mail Automatically from Microsoft Office 365 and Gmail

#### Microsoft Office 365

1. Go to https://portal.azure.com
2. Login as the mail address you will send the mails from (like automail@YOURDOMAIN.com)
3. Click on "Manage Azure Active Directory"
4. Click on "App registrations"
5. Click on "New registration"
6. Enter "YOURDOMAIN Automail" as "Name"
7. Select "Accounts in this organizational directory only (YOURDOMAIN only - Single tenant)"
8. Click on "Register"
9. Click on "Certificates & secrets"
10. Click on "New client secret"
11. Enter "YOURDOMAIN Automail" as "Description"
12. Choose maximum expiry date
13. Click on "Add"
14. Copy the value of "Value" and save it in an environment variable (check next block)
15. Click on "Overview"
16. Copy the value of "Application (client) ID" and save it in an environment variable (check next block)
17. Copy the value of "Tenent ID" and save it in an environment variable (check next block)
18. Click on "API permissions"
19. Click on "Add a permission"
20. Click on "Microsoft APIs"
21. Click on "Microsoft Graph"
22. Click on "Application permissions"
23. Click on "Mail.Send"
24. Click on "Add permissions"
26. In an other session, again go to the https://portal.azure.com login as Office 365 admin user for 25URDOMAIN (like admin@YOURDOMAIN.com)
27. Follow the same path as above to reach "App registrations"
28. Check all applications tab page
29. Click on "YOURDOMAIN Automail"
30. Click on "API permissions"
31. Click on "Grant admin consent for YOURDOMAIN"
32. Click on "Overview"	

Set the variables coming from steps 14, 16, 17
```bash
export TAMED_MAILER_OFFICE_FROM_MAIL="automail@YOURDOMAIN.com"
export TAMED_MAILER_OFFICE_CLIENT_SECRET="Coming-From-Step-14-Should-Be-40-Chars--"
export TAMED_MAILER_OFFICE_CLIENT_ID="Comes-From-Step-16-Should-Be-36-Char"
export TAMED_MAILER_OFFICE_TENANT_ID="Comes-From-Step-17-Should-Be-36-Char"

```

#### Gmail

1. Go to https://myaccount.google.com/ and login with your user
2. Click the "Security" from left navigation menu
3. Click "2-Step Verification" from the "Signing in to Google" section
4. Follow the instructions to setup 2-Step Verification
5. Go back and click "App passwords" from the "Signing in to Google" section
6. Verify your identity by entering your password
7. Click "Select app" and choose "Mail"
8. Click "Select device" and choose "Other"
9. Enter a name (for example `tamed-mailer`) for the app password and click "Generate"
10. Copy the generated password and configure it as an environment variable as described in the next section

```bash
export TAMED_MAILER_GMAIL_USER="yourmail-account@YOURDOMAIN.com" # or "yourmail-account@gmail.com"
export TAMED_MAILER_GMAIL_APP_PASSWORD="ComesFromStep-10"
export TAMED_MAILER_GMAIL_SERVICE="Gmail"
```

### Installation

```
yarn add tamed-mailer
```

### Usage

```javascript
const { sendMailviaGmail, sendMailviaOffice } = require('../tamed-mailer');

const gmailFrom = "tamed-mailer@gmail.com"; // gmail is to automatically convert this to the configured gmail account
const mailTo = "tamed-mailer@yopmail.com";
const mailSubject = "Test Mail Subject";
const textMailContent = "This is a text based test mail.\nLine2\nLine3";
const htmlMailContent = `<span style="color: blue"><h1>This is an HTML based test mail</h1><br>Line2<br>Line3</b></span>`;

let response1 = await sendMailviaGmail(gmailFrom, mailTo, mailSubject, textMailContent, undefined);
let response2 = await sendMailviaGmail(gmailFrom, mailTo, mailSubject, undefined, htmlMailContent);
let response3 = await sendMailviaOffice([mailTo], mailSubject, textMailContent, 'text');
let response4 = await sendMailviaOffice([mailTo], mailSubject, htmlMailContent, 'html');

```


### API

#### sendMailviaGmail
| Name  | Description |
|-------|-------------|
| p_from | From mail address, Gmail automatically converts this value to the registered mail address, so practically useless but good for code readability |
| p_to | The reciepent addresss          |
| p_subject | The subject line          |
| p_text | If the message is a text only message, place it here and leave `p_html` as `undefined`          |
| p_html | If the message is a HTML message, place it here and leave `p_text` as `undefined`          |

#### sendMailviaOffice
| Name  | Description |
|-------|-------------|
| mailToAsArray | The reciepents. **Pass an array even if the reciepent is only a single mail. (You can check the example usage.)                     |
| mailSubject | The subject line                       |
| mailBody | The mail body                     |
| mailType | Acceptable values are `'text'`, `'html'` to indicate if the mail body is plain text or html respectively                    |

### License

The license is MIT and full text [here](LICENSE).

#### Used Modules

* tick-log license [here](./OtherLicenses/tick-log.txt)
* fetch-lean license [here](./OtherLicenses/fetch-lean.txt)
* nodemailer [here](./OtherLicenses/nodemailer.txt)
* @azure/msal-node license [here](./OtherLicenses/msal-node.txt)
