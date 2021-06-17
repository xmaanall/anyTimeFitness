# Project#2 Anytime Fitness.
This project is a web app submitted by callback team to fulfill the requirement for SEI course.
## Overview
A gym manamgent system implemented in NodeJS, Express and MongoDB that provides several services for members and admins. Deployed using Heroku:  [Anytime Fitness](https://h3rotest.herokuapp.com/member/index)
### Team Members
* [Haneen Alhonayan](https://git.generalassemb.ly/haneen97-h)
* [Manal Alotaibi](https://git.generalassemb.ly/xmaanall)
* [Mohammed Alattas](https://git.generalassemb.ly/mcapital)
## Features
* Admin
1. Sign In
2. Analytical Dashboard
3. Manage Classes
      * Add a new class.
      * Delete a class.
      * Update a class.
4. Manage Members
      * Add a new member.
      * Delete a member.
      * Update a member.
* Member
1. Sign Up.
2. Sign In.
3. View profile.
4. Update their info.
5. Purchase membership.
6. View classes
7. Register in classes based on the membership.
8. View registered classes in a calender.
9. Reset password
## Packages 
1. [JWT Auth0](https://jwt.io/)
2. [Typed.js](https://mattboldt.com/demos/typed-js/)
3. [Nodemailer](https://www.npmjs.com/package/nodemailer)
4. [Validate Password](https://www.npmjs.com/package/validate-password)
5. [Toaster](https://github.com/CodeSeven/toastr)
6. [Chart.js](https://www.chartjs.org/)
7. [Full Calender](https://fullcalendar.io/)
8. [File Pond](https://pqina.nl/filepond/)
9. [IonIcons](https://ionicons.com/)
## Getting Started
1. Clone the repo.
2. Make sure to install the dependencies by run `` npm install``
3. Touch a `.env` file in the root with the following vars
```sh
PORT=#port number
mongoDBURL=#your mongodb url
SECRET=#you can run this command in node terminal to generate a random string require("crypto").randomBytes(64).toString("hex")
ACCESS_TOKEN_SECRET=#you can run this command in node terminal to generate a random string require("crypto").randomBytes(64).toString("hex")
RESET_PASSWORD_KEY=#you can run this command in node terminal to generate a random string require("crypto").randomBytes(64).toString("hex")
ACCESS_TOKEN_ADMIN_SECRET=#you can run this command in terminal node to generate a random string require("crypto").randomBytes(64).toString("hex")
CLIENT_URL=#client url for reset link
SMTP_USERNAME=#username to authenticate sending email
SMTP_PASSWORD=#password to authenticate sending email
```
## Future Work
## Useful Resources
* [Usage of ionicons in your web app.](https://ionicons.com/usage)
* [JWT Introduction.](https://jwt.io/introduction)
* [The difference between Controllers and Services.](https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis)
* [Set custom/another layout.](https://github.com/soarez/express-ejs-layouts#set-custom-layout-for-single-render)
* [Fake smtp service for sending emails.](https://mailtrap.io/)
