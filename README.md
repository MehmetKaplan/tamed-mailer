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
25. In an other session, again go to the https://portal.azure.com login as Office 365 admin user for YOURDOMAIN (like admin@YOURDOMAIN.com)
26. Follow the same path as above to reach "App registrations"
27. Check all applications tab page
28. Click on "YOURDOMAIN Automail"
39. Click on "API permissions"
30. Click on "Grant admin consent for YOURDOMAIN"
31. Click on "Overview"	

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
const { tamedMailer } = require('tamed-mailer');

const gmailFrom = "tamed-mailer@gmail.com"; // gmail is to automatically convert this to the configured gmail account
const mailTo = "tamed-mailer@yopmail.com";
const mailSubject = "Test Mail Subject";
const textMailContent = "This is a text based test mail.\nLine2\nLine3";
const htmlMailContent = `<span style="color: blue"><h1>This is an HTML based test mail</h1><br>Line2<br>Line3</b></span>`;

let credentials = {
	client_secret: 'OFFICE_CLIENT_SECRET',
	client_id: 'OFFICE_CLIENT_ID',
	tenant_id: 'OFFICE_TENANT_ID',
	from_mail: 'OFFICE_FROM_MAIL',
};
let response = await tamedMailer('office', credentials, mailTo, mailSubject, textMailContent, 'text');

// set scheduledTime to 2 minutes later
let currentTime = new Date();
let scheduledTime = new Date(currentTime.getTime() + 2 * 60000); // Add 2 minutes (2 * 60,000 milliseconds) to the current time
let responseScheduled1 = await tamedMailer('office', credentials, mailTo, mailSubject, htmlMailContent, 'text', scheduledTime);

let credentials2 = {
	user: 'TAMED_MAILER_GMAIL_USER',
	app_password: 'TAMED_MAILER_GMAIL_APP_PASSWORD',
}
let response2 = await tamedMailer('gmail', credentials2, mailTo, mailSubject, textMailContent, 'text');



```

### API

### tamedMailer
| Name  | Description |
|-------|-------------|
| p_gmail_or_office | Should be either `gmail` or `office`. No other values are allowed. Case sensitive. |
| p_credentials | Depends on the value of `p_gmail_or_office`.<br>If it was `'gmail'` then following keys must exist: `user`, `app_password`.<br>If it was `'office'`, then following keys must exist: `client_secret`, `client_id`, `tenant_id`, `from_mail`. |
| p_to | Single reciever of the email. In order to send for multiple reciepents, function must be called multiple times. |
| p_subject | Subject line. |
| p_body | Body of the mail, depending on `p_html_or_text`, should be either plain text or an html text. |
| p_html_or_text | Should be either `html` or `text`. Case sensitive. Dictates how to treat the `p_body` parameter. |
| p_scheduled_time | Optional, only for Office Mails. If provided, the office mail will be sent at the given time. If not provided, the mail will be sent immediately. |
| p_save_to_sent_items | Optional, only for Office Mails. If provided, the mail will be saved to the sent items. If not provided, the mail will not be saved to the sent items. |

### License

The license is MIT and full text [here](LICENSE).

#### Used Modules

* tick-log license [here](./OtherLicenses/tick-log.txt)
* fetch-lean license [here](./OtherLicenses/fetch-lean.txt)
* nodemailer [here](./OtherLicenses/nodemailer.txt)
* @azure/msal-node license [here](./OtherLicenses/msal-node.txt)
