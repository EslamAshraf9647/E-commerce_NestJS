import * as nodemailer from 'nodemailer';
import { EventEmitter } from 'node:events';

export const Events = new EventEmitter();

export const sendEmail = async (mailOptions: nodemailer.SendMailOptions) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +(process.env.EMAIL_PORT as string),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transport.sendMail(mailOptions);
    // console.log('Email sent successfully');

    return true;
  } catch (error) {
    console.log('Failed to send Mail', error);
    throw new Error('Failed to send Mail');
  }
};

Events.on('sendEmail', (data) => {
  sendEmail(data).catch((error) =>
    console.error('Error in sendEmail event handler:', error),
  );
});
