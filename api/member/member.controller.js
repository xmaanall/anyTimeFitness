/*
***********************************CONTROLLER**********************************
functions that deal with calling the service do some logic, checking or validation
 of the returned results. And pass the data from the HTTP requests off to the service
*/

const {
    create, getByMemberEmail, sendEmail, updateByMemberId,
    removeClass, updateByMemberIdPass, getRegistedClasses,
    registerClass, getByMemberId, registerMembership, getRegistedMembership,
    removeMembership,
} = require("./member.service");

const { getByClassIdMember, registerMember } = require("../class/class.service")
const { getByMembershipIdMember } = require("../membership/membership.service")
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
var ValidatePassword = require('validate-password');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const moment = require("moment");
const salt = genSaltSync(10);
const Member = require("../../models/member.model")
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
module.exports = {

    // validate user inputs then call create service
    /* we will use createMember in ajax becuase we need to refresh the dom but
     without reloading the whole page, the code for that can be found in js/main.js */
    createMember: async (req, res) => {
        try {
            var validator = new ValidatePassword();
            const body = req.body;
            var passwordData = validator.checkPassword(body.password);
            const member = await getByMemberEmail(body.email)
            //check if member already exists 
            if (member) {
                return res.json({ type: 'email', error: 'duplicate email' })
            }
            //password validation
            if (body.password.length < 8) {
                return res.json({ type: 'password', error: "password 8 length" })
            }
            /* isValid function will check password againest several conditions
             by defulat such as : lowercase, uppercase, special char and number
             */
            else if (!passwordData.isValid) {
                return res.json({ type: 'password', error: passwordData.validationMessage })
            }
            //checking the confirmed pass is done through javascript dom manipulation 
            body.password = hashSync(body.password, salt);
            //service call
            await create(body);

            // return status without rendering
            res.json({ status: 'ok' })
        } catch (e) {
            return res.render("member/login2", { msg: e.message, layout: "layout" });
        }
    },
    // calling getByMemberEmail service, compare passwords, sign jwt token, store token in a cookie
    login: async (req, res) => {
        try {
            const body = req.body;
            const member = await getByMemberEmail(body.email)
            //check if member already exists 
            if (!member) {
                req.flash("error", "Invalid Credential! Please try again.");
                return res.redirect("/member/login")
            }
            const result = compareSync(body.password, member.password);
            // if the compareSync returns true
            if (result) {
                // make pass as undefiend so it cannot be attached in the token
                member.password = undefined;
                // sign jwt token for auth attach result json of member info as a payload
                const jsontoken = sign({ result: member }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: "24h"
                });
                // store token in cookie to be accessible by client
                res.cookie('token', jsontoken, {
                    expires: new Date(Date.now() + 86400000), //access 24hours
                    secure: false, // set to true if your using https
                    httpOnly: true,
                })
                req.flash("success", `Welcome Back! ${member.name}`);
                return res.redirect("/member/index")
            }
            else {
                req.flash("error", "Invalid Credential! Please try again.");
                return res.redirect("/member/login")
            }

        } catch (e) {
            return res.render("member/login2", { msg: e.message, layout: "layout" });
        }

    },
    /* forogt pass mechanism as follows:
    1. we need to check if email exists in db by calling getByMemberEmail service.
    2. sign a jwt with the following
        1. payload: member id and member email.
        2. append a secret key with the member password that comes from db withgetByMemberEmail service as hash.
        3. expirIn 20 mins
    3. calling sendEmail service with member email, the signed token and member id arguments.
     that will generate one time reset link 
    4. rendering the page with flash msg.
*/
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const member = await getByMemberEmail(email)
            //check if member already exists 
            if (!member) {
                req.flash("error", "Invalid Email! Please try again.");
                return res.redirect("/member/forgot-password")
            }
            //sign jwt token for reseting pass
            const token = jwt.sign({ id: member._id, email: member.email },
                process.env.RESET_PASSWORD_KEY + member.password, { expiresIn: "20m" });
            //call send email service
            const result = await sendEmail(email, token, member._id);
            if (result) {
                req.flash("success", "An email has been sent to your inbox, please follow the instructions");
                return res.redirect("/member/forgot-password")
            } else {
                req.flash("error", "Try again later");
                return res.redirect("/member/forgot-password")
            }
        } catch (e) {
            return res.render("member/forgotPassword", { msg: e.message, layout: "layout" });
        }
    },
    /* reset pass mechanism as follows:
      1. get member info before making the update by calling getByMemberId service.
      2. validate the password that comes from request body.
      3. verify the jwt token that comes from the request params which has been signed in the forgotPassword controller,
       with the secret key attached to the member password that comes as result from the service.
        it will return true in all cases since the password has not been updated yet.
      3. calling updateByMemberIdPass service that takes member id from jwt and hash pass as arguments. 
      4. rendering the page with flash msg.
  */
    resetPassword: async (req, res) => {
        const { token, id } = req.params;
        const { password } = req.body;
        const member = await getByMemberId(id)
        var passwordData = validator.checkPassword(password);
        // verfiy
        const payload = jwt.verify(token, process.env.RESET_PASSWORD_KEY + member.password)

        try {
            if (!passwordData.isValid) {
                req.flash("error", passwordData.validationMessage);
                return res.render("member/resetPassword", { token, email: payload.email, id: payload.id, layout: "layout" })
            }
            let hash = bcrypt.hashSync(password, salt);
            req.body.password = hash;
            const result = await updateByMemberIdPass(payload.id, hash)

            if (result) {
                jwt.verify(token, process.env.RESET_PASSWORD_KEY + member.password)
                req.flash("success", "Your password has been reseted successfully, Please sign in! ");
                return res.redirect("/member");

            } else {
                req.flash("error", "error in updating");
                return res.render("member/resetPassword", { token, email: payload.email, id: payload.id, layout: "layout" })

            }
        } catch (e) {
            return res.render("member/resetPassword", { msg: e.message, token, email: payload.email, id: payload.id, layout: "layout" })

        }
    },
    // rendering resetPassword page from generated link in the email, 
    resetPasswordGet: async (req, res) => {
        try {
            const { token, id } = req.params;
            const member = await getByMemberId(id)
            /* if the decoded token is valid thats mean the secret key has noot been tampred with it will rendering the reset page to allow the member 
            to change the password. if the decoded token not valid it will throw an error and render 404 page, in this case means that secret key has been changed with member password and cannot decreypt it.
             and that makes it only one time use link */
            const payload = jwt.verify(token, process.env.RESET_PASSWORD_KEY + member.password)
            return res.render("member/resetPassword", { email: payload.email, msg: "", token: token, id: id, layout: "layout" })

        } catch (error) {
            return res.render("404page", { layout: "layout" })
        }


    },
    // calling getByMemberId service for rendering member profile
    getByMemberId: async (req, res) => {
        try {
            //get the current user who sign in decoded came from toke_validation
            const memberId = req.decoded.result._id;
            const result = await getByMemberId(memberId);
            return res.render("member/profile", { result, layout: "layout" })
        } catch (error) {

        }
    },
    // clear the token cookie
    logout: (req, res) => {
        res.cookie('token', {}, { maxAge: -1 });
        return res.redirect("/member/index")

    },
    //calling getRegistedClasses service to render member schedule 
    getRegistedClasses: async (req, res) => {
        try {
            //get the current user who sign in decoded came from toke_validation
            const memberId = req.decoded.result._id;
            const results = await getRegistedClasses(memberId)
            if (results) {
                return res.render("member/schedule", { results, moment, layout: "layout" })
            } else
                return res.send("error")
        } catch (e) {
            return res.send(e.message)
        }

    },
    //calling getRegistedMembership service TODO Not implemented in forntend yet!
    getRegistedMembership: async (req, res) => {
        try {
            //get the current user who sign in decoded came from toke_validation
            const memberId = req.decoded.result._id;
            const results = await getRegistedMembership(memberId)
            if (results) {
                //TODO return res.render(ClassView,{results})
                return res.send(results)
            } else
                return res.send("error")
        } catch (e) {
            return res.send(e.message)
        }


    },
    // logic behind member and class registration  
    registerClass: async (req, res) => {
        try {
            //get the current user who sign in
            const memberId = req.decoded.result._id;
            // get member info by memberId
            const memberInfo = await getByMemberId(memberId);
            //get the class id in the url param
            const classId = req.params.classId;
            // get class info by classId
            const classFit = await getByClassIdMember(classId);
            await registerClass(memberInfo, classFit);
            // calling registerMember service that takes member and class info to add a member to the current class
            await registerMember(memberInfo, classFit);

            req.flash("success", `Registered the ${classFit.type} Class`);
            return res.redirect("/class/classes");
        } catch (e) {
            req.flash("error", e.message);
            return res.redirect("/class/classes");
        }
    },
    // calling registerMembership for a member to purchase it
    registerMembership: async (req, res) => {
        try {
            const memberId = req.decoded.result._id;
            const memberInfo = await getByMemberId(memberId);
            const membershipId = req.params.membershipId;
            const MemberShip = await getByMembershipIdMember(membershipId);

            //TODO check if exist
            await registerMembership(memberInfo, MemberShip)


            //TODO check if success
            req.flash("success", `Registered the ${MemberShip.name} Plan`);
            return res.redirect("/member/index");
        } catch (e) {
            return res.send(e.message)
        }

    },

    // unregister a class for a member TODO Not implemented in the frontend yet!
    removeClass: async (req, res) => {
        try {
            const memberId = req.decoded.result._id;
            const memberInfo = await getByMemberId(memberId);
            const classId = req.params.classId;

            //TODO check if true
            await removeClass(memberInfo, classId)

            req.flash("success", `Class Removed!`);
            return res.redirect("/class/classes");
            //TODO check if success
            // return res.send(memberInfo);
        } catch (e) {
            req.flash("error", e.message);
            return res.redirect("/class/classes");
            // return res.send(e.message)
        }

    },
    // unregister a membership for a member TODO Not implemented in the frontend yet!
    removeMembership: async (req, res) => {
        try {
            const memberId = req.decoded.result._id;
            const memberInfo = await getByMemberId(memberId);
            const membershipId = req.params.membershipId;

            //TODO check if true
            await removeMembership(memberInfo, membershipId)


            //TODO check if success
            return res.send(memberInfo);
        } catch (e) {
            return res.send(e.message)
        }

    },

    // update member info for profile page
    updateByMemberId: async (req, res) => {
        try {

            const memberId = req.decoded.result._id;
            const member = new Member({
                _id: memberId,
                name: req.body.name,
                email: req.body.email,
                height: req.body.height,
                weight: req.body.weight,
                address: req.body.address,
                mobile: req.body.mobile,
            })
            saveCover(member, req.body.cover)
            const result = await updateByMemberId(memberId, member);
            if (result) {
                req.flash("success", "updated successfully")
                return res.redirect("/member/index")

            } else {
                req.flash("error", "failed")
                return res.render("member/profile")
            }
        } catch (error) {
            return res.send(error.message)
        }

    }

}
function saveCover(result, coverEncoded) {

    if (coverEncoded == null || coverEncoded == "")
        return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        // The Buffer class in Node.js is designed to handle raw binary data. 
        // SETTING IMAGE AS BINARY DATA
        result.profileImg = new Buffer.from(cover.data, 'base64')
        result.profileImgType = cover.type

    }
}

