import * as nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'taxizilla.bg@gmail.com',
    pass: '?kU5?JPHJENEN6$ZG4H3NzZKEcDaaPTKYc2a6Kr9kpWcYK!2?VQS559+*v9+49gCyv9S?5#Mb-rBh+XnBWk5y^#&p8AtwFeYW@Fb',
  },
});