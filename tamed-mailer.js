
const tickLog = require('tick-log');

const sendMailviaGmail = (p_from, p_to, p_subject, p_text, p_html) => new Promise(async (resolve, reject) => {
	tickLog.start(`Sending mail via Gmail. From: ${p_from}. To: ${p_to}. Subject: ${p_subject}.`, true);
	const nodemailer = require('nodemailer');
	try {
		const nodemailerTransporterParameters = {
			service: process.env.TAMED_MAILER_GMAIL_SERVICE,
			auth: {
				user: process.env.TAMED_MAILER_GMAIL_USER,
				pass: process.env.TAMED_MAILER_GMAIL_APP_PASSWORD,
			}
		};
		let l_params = {
			from: p_from,
			to: p_to,
			subject: p_subject,
			text: p_text,
			html: p_html
		};

		if (p_html) delete l_params['text'];
		else delete l_params['html'];
		const transporter = nodemailer.createTransport(nodemailerTransporterParameters);
		transporter.sendMail(l_params, (error, info) => {
			transporter.close();
			/* istanbul ignore if */
			if (error) {
				tickLog.error(`Function sendMailviaGmail failed. Error: ${JSON.stringify(error)}`, true);
				return (reject(error));
			};
			tickLog.success(`Email sent.`, true);
			return (resolve(info));
		});
	} catch (error) /* istanbul ignore next */ {
		tickLog.error(`Function sendMailviaGmail failed. Error: ${JSON.stringify(error)}`, true);
		return reject(error);
	}
});

const sendMailviaOffice = (mailToAsArray, mailSubject, mailBody, mailType) => new Promise(async (resolve, reject) => {

	tickLog.start(`Sending mail via Office 365. mailToAsArray: ${JSON.stringify(mailToAsArray)}. Subject: ${mailSubject}.`, true);

	try {
		let toRecipients = mailToAsArray.map(curMail => { return { emailAddress: { address: curMail, } } });

		const msal = require('@azure/msal-node');
		const fetchLean = require('fetch-lean');

		const clientSecret = process.env.TAMED_MAILER_OFFICE_CLIENT_SECRET;
		const clientId = process.env.TAMED_MAILER_OFFICE_CLIENT_ID;
		const tenantId = process.env.TAMED_MAILER_OFFICE_TENANT_ID;

		const aadEndpoint = 'https://login.microsoftonline.com';
		const graphEndpoint = 'https://graph.microsoft.com';

		const msalConfig = {
			auth: {
				clientId,
				clientSecret,
				authority: aadEndpoint + '/' + tenantId,
			},
		};

		const tokenRequest = {
			scopes: [graphEndpoint + '/.default'],
		};

		const cca = new msal.ConfidentialClientApplication(msalConfig);
		const tokenInfo = await cca.acquireTokenByClientCredential(tokenRequest);


		const headers = {
			"Authorization": `Bearer ${tokenInfo.accessToken}`,
			"Content-Type": 'application/json',
		};

		const combinedMailBody =
		{
			content: mailBody,
			contentType: mailType, // html, text
		};
		const mail = {
			from: { emailAddress: { address: process.env.TAMED_MAILER_OFFICE_FROM_MAIL, }, },
			toRecipients: toRecipients,
			subject: mailSubject,
			body: combinedMailBody,
		};
		let body = { message: mail, saveToSentItems: false }
		let uri = graphEndpoint + `/v1.0/users/${process.env.TAMED_MAILER_OFFICE_FROM_MAIL}/sendMail`;
		let response = await fetchLean("POST", uri, headers, body)
		tickLog.success(`Email sent. Response: ${JSON.stringify(response)}`, true);
		return resolve(response);
	} catch (error) /* istanbul ignore next */ {
		tickLog.error(`Function sendMailviaOffice failed. Error: ${JSON.stringify(error)}`, true);
		return reject(error);
	}
});

const tamedMailer = (p_gmail_or_office, p_credentials, p_to, p_subject, p_body, p_html_or_text) => new Promise (async (resolve, reject) => {
	try {
		let l_retval;
		/* istanbul ignore if */
		if (['gmail', 'office'].indexOf(p_gmail_or_office) === -1) throw new Error(`Invalid p_gmail_or_office: ${p_gmail_or_office}.`);
		/* istanbul ignore if */
		if (['html', 'text'].indexOf(p_html_or_text) === -1) throw new Error(`Invalid p_html_or_text: ${p_html_or_text}.`);
		/* istanbul ignore if */
		if (!p_credentials) throw new Error(`Invalid p_credentials: ${p_credentials}.`);
		if (p_gmail_or_office === 'gmail') {
			let l_old_TAMED_MAILER_GMAIL_SERVICE = process.env.TAMED_MAILER_GMAIL_SERVICE;
			let l_old_TAMED_MAILER_GMAIL_USER = process.env.TAMED_MAILER_GMAIL_USER;
			let l_old_TAMED_MAILER_GMAIL_APP_PASSWORD = process.env.TAMED_MAILER_GMAIL_APP_PASSWORD;
			process.env.TAMED_MAILER_GMAIL_SERVICE = 'Gmail';
			process.env.TAMED_MAILER_GMAIL_USER = p_credentials.user;
			process.env.TAMED_MAILER_GMAIL_APP_PASSWORD = p_credentials.app_password;
			let l_text = (p_html_or_text === 'text') ? p_body : undefined;
			let l_html = (p_html_or_text === 'html') ? p_body : undefined;
			l_retval = await sendMailviaGmail(p_credentials.user, p_to, p_subject, l_text, l_html) ;
			process.env.TAMED_MAILER_GMAIL_SERVICE = l_old_TAMED_MAILER_GMAIL_SERVICE;
			process.env.TAMED_MAILER_GMAIL_USER = l_old_TAMED_MAILER_GMAIL_USER;
			process.env.TAMED_MAILER_GMAIL_APP_PASSWORD = l_old_TAMED_MAILER_GMAIL_APP_PASSWORD;
		};
		if (p_gmail_or_office === 'office') {
			let l_old_TAMED_MAILER_OFFICE_CLIENT_SECRET = process.env.TAMED_MAILER_OFFICE_CLIENT_SECRET;
			let l_old_TAMED_MAILER_OFFICE_CLIENT_ID = process.env.TAMED_MAILER_OFFICE_CLIENT_ID;
			let l_old_TAMED_MAILER_OFFICE_TENANT_ID = process.env.TAMED_MAILER_OFFICE_TENANT_ID;
			let l_old_TAMED_MAILER_OFFICE_FROM_MAIL = process.env.TAMED_MAILER_OFFICE_FROM_MAIL;
			process.env.TAMED_MAILER_OFFICE_CLIENT_SECRET = p_credentials.client_secret;
			process.env.TAMED_MAILER_OFFICE_CLIENT_ID = p_credentials.client_id;
			process.env.TAMED_MAILER_OFFICE_TENANT_ID = p_credentials.tenant_id;
			process.env.TAMED_MAILER_OFFICE_FROM_MAIL = p_credentials.from_mail;
			l_retval = await sendMailviaOffice([p_to], p_subject, p_body, p_html_or_text);
			process.env.TAMED_MAILER_OFFICE_CLIENT_SECRET = l_old_TAMED_MAILER_OFFICE_CLIENT_SECRET;
			process.env.TAMED_MAILER_OFFICE_CLIENT_ID = l_old_TAMED_MAILER_OFFICE_CLIENT_ID;
			process.env.TAMED_MAILER_OFFICE_TENANT_ID = l_old_TAMED_MAILER_OFFICE_TENANT_ID;
			process.env.TAMED_MAILER_OFFICE_FROM_MAIL = l_old_TAMED_MAILER_OFFICE_FROM_MAIL;
		};
		return resolve(l_retval);
	} catch (error) {
		tickLog.error(`Function tamedMailer failed. Error: ${JSON.stringify(error)}`, true);
		return reject(error);
	}
});

module.exports = {
	sendMailviaGmail: sendMailviaGmail,
	sendMailviaOffice: sendMailviaOffice,
	tamedMailer: tamedMailer,
	exportedForTesting: {
	},
}