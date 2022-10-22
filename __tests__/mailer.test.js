const tickLog = require('tick-log');
tickLog.forceColor(true);
const { sendMailviaGmail, sendMailviaOffice } = require('../tamed-mailer');

const gmailFrom = "tamed-mailer@gmail.com"; // gmail is to automatically convert this to the configured gmail account
const mailTo = "tamed-mailer@yopmail.com";
const mailSubject = "Test Mail Subject";
const textMailContent = "This is a text based test mail.\nLine2\nLine3";
const htmlMailContent = `<span style="color: blue"><h1>This is an HTML based test mail</h1><br>Line2<br>Line3</b></span>`;

jest.setTimeout(10000);

test('GMAIL, Text based mail', async () => {
	let response = await sendMailviaGmail(gmailFrom, mailTo, mailSubject, textMailContent, undefined);
	expect(response).not.toBeNull();
});

test('GMAIL, HTML based mail', async () => {
	let response = await sendMailviaGmail(gmailFrom, mailTo, mailSubject, undefined, htmlMailContent);
	expect(response).not.toBeNull();
});

test('Office, Text based mail', async () => {
	let response = await sendMailviaOffice([mailTo], mailSubject, textMailContent, 'text');
	expect(response).not.toBeNull();
});

test('Office, Text based mail', async () => {
	let response = await sendMailviaOffice([mailTo], mailSubject, htmlMailContent, 'html');
	expect(response).not.toBeNull();
});
