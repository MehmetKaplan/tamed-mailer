
const tickLog = require('tick-log');

const sendMailviaGmail = (p_from, p_to, p_subject, p_text, p_html) => new Promise(async (resolve, reject) => {
	tickLog.start(`Sending mail via Gmail. From: ${p_from}. To: ${p_to}. Subject: ${p_subject}.`);
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
				tickLog.error(`Function sendMailviaGmail failed. Error: ${JSON.stringify(error)}`);
				return (reject(error));
			};
			tickLog.success(`Email sent.`);
			return (resolve(info));
		});
	} catch (error) /* istanbul ignore next */ {
		tickLog.error(`Function sendMailviaGmail failed. Error: ${JSON.stringify(error)}`);
		return reject(error);
	}
});

const sendMailviaOffice = (mailToAsArray, mailSubject, mailBody, mailType) => new Promise(async (resolve, reject) => {

	tickLog.start(`Sending mail via Office 365. mailToAsArray: ${JSON.stringify(mailToAsArray)}. Subject: ${mailSubject}.`);

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
		tickLog.success(`Email sent. Response: ${JSON.stringify(response)}`);
		return resolve(response);
	} catch (error) /* istanbul ignore next */ {
		tickLog.error(`Function sendMailviaOffice failed. Error: ${JSON.stringify(error)}`);
		return reject(error);
	}
});


module.exports = {
	sendMailviaGmail: sendMailviaGmail,
	sendMailviaOffice: sendMailviaOffice,
	exportedForTesting: {
	},
}