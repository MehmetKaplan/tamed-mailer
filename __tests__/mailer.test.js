const tickLog = require('tick-log');
tickLog.forceColor(true);
const { sendMailviaGmail, sendMailviaOffice, tamedMailer } = require('../tamed-mailer');

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

test('Tamed mailer for gmail, both text and html', async () => {
	let credentials = {
		user: process.env.TAMED_MAILER_GMAIL_USER,
		app_password: process.env.TAMED_MAILER_GMAIL_APP_PASSWORD,
	}
	let response = await tamedMailer('gmail', credentials, mailTo, mailSubject, textMailContent, 'text');
	expect(response).not.toBeNull();
	let response2 = await tamedMailer('gmail', credentials, mailTo, mailSubject, htmlMailContent, 'html');
	expect(response2).not.toBeNull();
});

test('Tamed mailer for gmail, both text and html, with wrong data ', async () => {
	let credentials = {
		user: 'wrong_user',
		app_password: 'wrong_app_password',
	}
	try {
		let response = await tamedMailer('gmail', credentials, mailTo, mailSubject, textMailContent, 'text');
		expect(response).toBe("Should not come here!!!!!"); // should not reach here
	} catch (error) {
		tickLog.success(`Error caught as expected. Error: ${error}`, true);
		expect(error).not.toBeNull();
	}
	try {
		let response = await tamedMailer('gmail', credentials, mailTo, mailSubject, textMailContent, 'html');
		expect(response).toBe("Should not come here!!!!!"); // should not reach here
	} catch (error) {
		tickLog.success(`Error caught as expected. Error: ${error}`, true);
		expect(error).not.toBeNull();
	}
});

test('Tamed mailer for office, both text and html', async () => {
	let credentials = {
		client_secret: process.env.TAMED_MAILER_OFFICE_CLIENT_SECRET,
		client_id: process.env.TAMED_MAILER_OFFICE_CLIENT_ID,
		tenant_id: process.env.TAMED_MAILER_OFFICE_TENANT_ID,
		from_mail: process.env.TAMED_MAILER_OFFICE_FROM_MAIL,
	};
	let response = await tamedMailer('office', credentials, mailTo, mailSubject, textMailContent, 'text');
	expect(response).not.toBeNull();
	let response2 = await tamedMailer('office', credentials, mailTo, mailSubject, htmlMailContent, 'html');
	expect(response2).not.toBeNull();
});

test('Tamed mailer for office, both text and html, with wrong data ', async () => {
	let credentials = {
		client_secret: 'wrong_client_secret',
		client_id: 'wrong_client_id',
		tenant_id: 'wrong_tenant_id',
		from_mail: 'wrong_from_mail',
	};
	try {
		let response = await tamedMailer('office', credentials, mailTo, mailSubject, textMailContent, 'text');
		expect(response).toBe("Should not come here!!!!!"); // should not reach here
	} catch (error) {
		tickLog.success(`Error caught as expected. Error: ${error}`, true);
		expect(error).not.toBeNull();
	}
	try {
		let response = await tamedMailer('office', credentials, mailTo, mailSubject, textMailContent, 'html');
		expect(response).toBe("Should not come here!!!!!"); // should not reach here
	} catch (error) {
		tickLog.success(`Error caught as expected. Error: ${error}`, true);
		expect(error).not.toBeNull();
	}
});
