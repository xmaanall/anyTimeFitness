/*
*****************************************SERVICES*****************************************
functions that deal with retrieving data from backend wethear is database or an external api.
It returns a promise since it is a promise when calling it you must make it as await, async.

services are useful and more efficient approach for testing, code organization, and code re-use.
*/
const Member = require("../../models/member.model");
const nodemailer = require('nodemailer');

module.exports = {
    sendEmail: (email, token, id) => {
        return new Promise((resolve, reject) => {
            /* sending email with the help of mailtrap a fake smtp service, the same approach can be used with 
            gmail serivce by replacing host and auth values. */
            var transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD
                }
            });
            const message = {
                from: "noreplay@anytimefitness.com",
                to: email,
                subject: "Password Reset Link",
                html: `<!doctype html>
                <html lang="en-US">
                
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Reset Password Email Template</title>
                    <meta name="description" content="Reset Password Email Template.">
                    <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                    </style>
                </head>
                
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <!--100% body table-->
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Montserrat:400,800);
                ">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                          
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1 style="color:#233D4D; font-weight:500; margin:0;font-size:32px;font-family:'Montserrat', sans-serif;">You have
                                                            requested to reset your password</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#233D4D; font-size:16px;line-height:24px; margin:0;">
                                                            We cannot simply send you your old password. A unique link to reset your
                                                            password has been generated for you. To reset your password, click the
                                                            following link and follow the instructions.
                                                        </p>
                                                        <a href="${process.env.CLIENT_URL}/member/reset-password/${id}/${token}"
                                                            style="background:#FE7F2D;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;font-weight:500; font-size:16px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                            Password</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                          <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.anytimefitness.com</strong></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!--/100% body table-->
                </body>
                
                </html>
                `


            };
            transport.sendMail(message, function (error, info) {

                if (error) {
                    reject(error);
                }
                return resolve("success");
            })
        })

    },
    // create a new member
    create: (data) => {
        return new Promise((resolve, reject) => {
            let member = new Member(data);
            member.save(
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }

            )
        })
    },
    // get member info by email
    getByMemberEmail: (email) => {
        return new Promise((resolve, reject) => {
            Member.find({ email },
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    // update member by adding a class
    registerClass: (member, classFit) => {
        return new Promise((resolve, reject) => {
            Member.findByIdAndUpdate(member, { $addToSet: { classes: classFit } }, { useFindAndModify: false }).then(results => {
                return resolve(results)
            })
                .catch(e => {
                    return reject(e)
                })
        })
    },
    // update a member by adding a membership
    registerMembership: (member, MemberShip) => {
        return new Promise((resolve, reject) => {
            Member.findByIdAndUpdate(member, { $addToSet: { membership: MemberShip } }, { useFindAndModify: false }).then(results => {
                return resolve(results)
            })
                .catch(e => {
                    return reject(e)
                })
        })
    },
    // delete a class from a member TODO not implemented in the frontend yet!
    removeClass: (member, classId) => {
        return new Promise((resolve, reject) => {
            Member.findByIdAndUpdate(member, { $pull: { classes: classId } }, { useFindAndModify: false }).then(results => {
                return resolve(results)
            })
                .catch(e => {
                    return reject(e)
                })
        })
    },
    // delete a membership from a member TODO not implemented in the frontend yet!
    removeMembership: (member, membershipId) => {
        return new Promise((resolve, reject) => {
            Member.findByIdAndUpdate(member, { $pull: { membership: membershipId } }, { useFindAndModify: false }).then(results => {
                return resolve(results)
            })
                .catch(e => {
                    return reject(e)
                })
        })
    },
    // get all classes related to a specific member
    getRegistedClasses: (id) => {
        return new Promise((resolve, reject) => {
            Member.findById(id).populate("classes")
                .then(results => {
                    return resolve(results)
                })
                .catch(e => {
                    return reject(e)
                })

        })
    },
    // get the membership related to a specific member
    getRegistedMembership: (id) => {
        return new Promise((resolve, reject) => {
            Member.findById(id).populate("membership")
                .then(results => {
                    return resolve(results)
                })
                .catch(e => {
                    return reject(e)
                })

        })
    },
    // update a member password, as it shown we specify the password only to be updated
    updateByMemberIdPass: (id, pass) => {
        return new Promise((resolve, reject) => {
            Member.findByIdAndUpdate({ _id: id },
                { password: pass },
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    // update a member info, depends on the data sent from the controller
    updateByMemberId: (id, data) => {
        return new Promise((resolve, reject) => {
            Member.findOneAndUpdate({ _id: id },
                { $set: data }, { useFindAndModify: false },
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    // get a member info by id
    getByMemberId: (id) => {
        return new Promise((resolve, reject) => {
            Member.findById(id,
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    // get all members info
    getAllMembers: (id) => {
        return new Promise((resolve, reject) => {
            Member.find({},
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    // delete a member by id
    deleteByMemberId: (id) => {
        return new Promise((resolve, reject) => {
            Member.findByIdAndDelete(id,
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    }
};