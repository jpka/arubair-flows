import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as nodemailer from 'nodemailer';
// import * as cors from 'cors';
import * as smtpTransport from 'nodemailer-smtp-transport';
firebase.initializeApp();

// const corsFn = cors({ origin: true });
const ordersColl = firebase.firestore().collection('orders');
const firestore = firebase.firestore;

const account = "mails@arubair.com";

export interface TaskEmail {
	body: string,
	subject?: string,
	recipients: {
		address: string,
		[key: string]: any
	}[], 
	status: 'pending' | 'sending' | 'sent' | 'failed',
	error?: string
};
export interface Task {
	id?: string,
	orderId?: string,
	name: 'importCotizationConfirmation' | 'exportCotizationConfirmation' | 'exportPricesRequest' | 'cotizationFollowup',
	label: string,
	type: 'alarm' | 'email',
	status: 'pending' | 'in progress' | 'completed',
	due: firebase.firestore.Timestamp,
	dueDate?: number,
	data?: any,
	emails?: {
		status?: 'pending' | 'sending' | 'sent' | 'failed',
		list?: TaskEmail[],
		sentTimes?: number
	}
}

const tasksMeta = {
	// exportPricesRequest: {
	// 	getEmails: ({data, ...task}: Task) => {
	// 		let emails: TaskEmail[] = [{
	// 			body: data.emailBody,
	// 			subject: data.emailSubject,
	// 			status: 'sending',
	// 			recipients: []
	// 		}];
	// 		let { priceRequests } = data;
	// 		Object.keys(priceRequests).forEach(type => {
	// 			priceRequests[type].forEach(item => {
	// 				// item.body = data.emailBody;
	// 				// item.subject = data.emailSubject;
	// 				emails[0].recipients.push(item);
	// 			});
	// 		});
	// 		return emails;
	// 	}
	// }
};

var transporter = nodemailer.createTransport(smtpTransport({
	host: 'smtp.arubair.com',
	//host: 'smtp.networksolutions.com',
	//host: 'email-out-priv.myregisteredsite.com',
	port: 587,
	//port: 465,
	//port: 25,
	secure: false,
	tls: {
		//rejectUnauthorized: false
		servername: "smtp.hostingplatform.com"
	},
	auth: {
		user: account,
		pass: 'cartas12345678*'
	},
	debug: false,
	logger: true
}));

const sendEmail = (email: TaskEmail) => {
	const mailOptions = {
		// from: 'Your Account Name <yourgmailaccount@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
		from: account,
		replyTo: account,
		to: email.recipients.map(recipient => recipient.address),
		// bcc: account,
		subject: email.subject, // email subject
		html: email.body // email content in HTML
	};

	// return transporter.sendMail(mailOptions, (error, info) => {
	// 	if (error) {
	// 		return res.status(500).send(error.toString());
	// 	}
	// 	return res.send('Sended');
	// });

	email.status = "sending";
	return transporter.sendMail(mailOptions).then(() => {
		email.status = "sent";
	}).catch(error => {
		email.status = "failed";
		email.error = error.toString();
	});
};

const sendEmailMock = () => new Promise(resolve => setTimeout(resolve, 2000));

const sendTaskEmails = async (orderId, id, task: Task, mock = false) => {
	const taskMeta = tasksMeta[task.name];
	let emails;
	if (taskMeta && taskMeta.getEmails) {
		emails = taskMeta.getEmails(task);
	} else {
		emails = (task.emails && task.emails.list) || [];
	}
	const taskRef = ordersColl.doc(orderId).collection('tasks').doc(id);
	// const updateTask = () => taskRef.update(task);
	let done: Promise<any>[] = [];
	if (!task.emails) task.emails = {};
	if (task.emails && !task.emails.sentTimes) task.emails.sentTimes = 0;
	task.emails.status = "sending";
	// updateTask();
	await taskRef.update({emails: task.emails});
	emails && emails.forEach(email => {
		// email.status = "sending";
		// updateTask();
		// done.push(sendEmail(email).then(updateTask));
		done.push(mock ? sendEmailMock() : sendEmail(email));
	});
	return Promise.all(done)
		.then(() => taskRef.update({"emails.status": "sent", "emails.sentTimes": firestore.FieldValue.increment(1)}))
		.catch(error => taskRef.update({"emails.status": "failed", "emails.error": error.toString()}));
}

const getTask = async (orderId, id) => (await ordersColl.doc(orderId).collection('tasks').doc(id).get()).data();

export const sendTaskEmailsNow = functions.https.onCall(async ({orderId, taskId, mock}, context) => {
	// corsFn(req, res, async () => {
		const task: any = await getTask(orderId, taskId);
		if (task) {
			await sendTaskEmails(orderId, taskId, task, mock || false);
			return true;
		} else {
			throw new functions.https.HttpsError("failed-precondition", "The task does not exist");
		}
		// return transporter.sendMail(mailOptions, (error, info) => {
		// 	if (error) {
		// 		return res.status(500).send(error.toString());
		// 	}
		// 	return res.send('Sended');
		// });
	// });
});

