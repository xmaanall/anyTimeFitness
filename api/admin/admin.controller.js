/*
***********************************CONTROLLER**********************************
functions that deal with calling the service do some logic, checking or validation
 of the returned results. And pass the data from the HTTP requests off to the service
*/

const {
    getByMemberEmail, updateByMemberId,
    create,
    deleteByMemberId, getByMemberId }
    = require("../member/member.service");

const { getByAdminEmail, createAdmin,
    getByAdminId }
    = require("../admin/admin.service")

const { createClass, getByClassType,
    deleteByClassId, updateByClassId,
    getByClassId }
    = require("../class/class.service")

const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const salt = genSaltSync(10);
const Member = require("../../models/member.model")
const moment = require("moment")
const ClassFit = require("../../models/class.model")
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

module.exports = {

    // create admin has nothing to do with the frontend so the result returned as json to be tested in the postman
    createAdmin: async (req, res) => {
        try {
            const body = req.body;
            const admin = await getByAdminEmail(body.email)
            //check if admin already exists 
            if (admin) {
                return res.json({ type: 'email', error: 'duplicate email' })
            }

            body.password = hashSync(body.password, salt);
            //service call
            await createAdmin(body);
            res.json({ status: 'ok' })
        } catch (e) {
            res.send(e.message)
        }

    },
    // add a member, this function is calling getByMemberEmail function from member.service
    addMemberAdmin: async (req, res) => {
        try {
            const body = req.body;
            const member = await getByMemberEmail(body.email)
            //check if member already exists 
            if (member) {
                req.flash("error", "Email already exisits.");
                return res.redirect("/admin/addMember")
            }
            await create(body);
            req.flash("success", "Member added successfully.");
            return res.redirect("/admin/getAllMembers/1")
        } catch (e) {
            return res.render("member/login2", { msg: e.message });
        }
    },
    // add a class, this function is calling getByClassType function from class.service
    addClass: async (req, res) => {
        try {
            const body = req.body;
            const classFit = await getByClassType(body.type)
            //check if class type already exists 
            if (classFit) {
                req.flash("error", "Type already exisits.");
                return res.redirect("/admin/addClass")
            }
            const classFit1 = new ClassFit({
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                type: req.body.type,
            })
            saveImage(classFit1, req.body.classImage)
            await createClass(classFit1);
            req.flash("success", "Class added successfully.");
            return res.redirect("/admin/getAllClasses/1")
        } catch (e) {
            return res.send(e.message);
        }
    },
    // admin login using json web token auth
    login: async (req, res) => {
        try {
            const body = req.body;
            const admin = await getByAdminEmail(body.email)
            //check if member already exists 
            if (!admin) {
                req.flash("error", "Invalid Credential! Please try again.");
                return res.redirect("/admin/login")
            }
            const result = compareSync(body.password, admin.password);
            if (result) {
                // make pass as undefiend so it cannot be attached in the token
                admin.password = undefined;
                // sign jwt token for auth attach result json of admin info as a payload
                const jsontoken = sign({ result: admin }, process.env.ACCESS_TOKEN_ADMIN_SECRET, {
                    expiresIn: "24h"
                });
                // store token in cookie to be accessible by client
                res.cookie('tokenAdmin', jsontoken, {
                    expires: new Date(Date.now() + 86400000), //access 24hours
                    secure: false, // set to true if your using https
                    httpOnly: true,
                })
                req.flash("success", `Welcome Back! ${admin.name}`);
                return res.redirect("/admin/dashboard")
            }
            else {
                req.flash("error", "Invalid Credential! Please try again.");
                return res.redirect("/admin/login")
            }
        } catch (e) {
            return res.send(e.message)
        }

    },

    // logout by clearing the assigned cookie
    logout: (req, res) => {
        res.cookie('tokenAdmin', {}, { maxAge: -1 });
        return res.redirect("/admin/login")

    },
    // get all classes info with pagination TODO Needs to be refactored into service
    getAllClassesPage: async (req, res, next) => {
        var perPage = 5
        var page = req.params.page || 1
        // aggregate used to display members count for each class
        ClassFit.aggregate([
            {
                $project: {
                    type: 1,
                    startDate: 1,
                    endDate: 1,
                    description: 1,
                    numberOfMembers: { $cond: { if: { $isArray: "$members" }, then: { $size: "$members" }, else: "NA" } }
                }
            }
        ])
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, results) {
                Member.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('admin/mangClass/manageClass', {
                        results: results,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        moment: moment,
                        layout: "layoutAdmin"
                    })
                })
            })
    },
    // get all members info with pagination TODO Needs to be refactored into service
    getAllMembers: async (req, res) => {
        var perPage = 5
        var page = req.params.page || 1

        Member
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, results) {
                Member.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('admin/mangMember/manageMember', {
                        results: results,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        moment: moment,
                        layout: "layoutAdmin"
                    })
                })
            })
    },
    // update member info, this function is calling updateByMemberId function from member.service
    updateByMemberId: async (req, res) => {
        try {
            const result = await updateByMemberId(req.params.id, req.body);
            if (result) {
                req.flash("success", "Member updated successfully.");
                return res.redirect("/admin/getAllMembers/1")
            }
            else {
                req.flash("error", "error in updating");
                return res.redirect("/admin/getAllMembers/1")
            }
        } catch (error) {
            return res.send(error.message)
        }

    },
    // update class info, this function is calling updateByClassId function from member.service
    updateByClassId: async (req, res) => {
        try {
            const classId = req.params.id
            const classFit = new ClassFit({
                _id: classId,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                type: req.body.type,
            })
            saveImage(classFit, req.body.classImage)
            const result = await updateByClassId(classId, classFit);
            if (result) {
                req.flash("success", "Class updated successfully.");
                return res.redirect("/admin/getAllClasses/1")
            }
            else {
                req.flash("error", "error in updating");
                return res.redirect("/admin/getAllClasses/1")
            }
        } catch (error) {
            return res.send(error.message)
        }

    },
    // delete a member, this function is calling deleteByMemberId function from member.service
    deleteByMemberId: async (req, res) => {
        try {
            const result = await deleteByMemberId(req.params.id)
            if (result) {
                req.flash("success", "Member deleted successfully.");
                return res.redirect("/admin/getAllMembers/1")
            }
            else {
                req.flash("error", "error in deleting");
                return res.redirect("/admin/getAllMembers/1")
            }
        } catch (error) {
            return res.send(error.message)
        }
    },
    // delete a class, this function is calling deleteByClassId function from class.service
    deleteByClassId: async (req, res) => {
        try {
            const result = await deleteByClassId(req.params.id)
            if (result) {
                req.flash("success", "Class deleted successfully.");
                return res.redirect("/admin/getAllClasses/1")
            }
            else {
                req.flash("error", "error in deleting");
                return res.redirect("/admin/getAllClasses/1")
            }
        } catch (error) {
            return res.send(error.message)
        }
    },
    // get member info, this function is calling getByMemberId function from member.service
    getByMemberId: async (req, res) => {
        try {
            const result = await getByMemberId(req.params.id);
            return res.render("admin/mangMember/updateMember", { result })
        } catch (error) {
            return res.send(error.message)

        }
    },
    // get class info, this function is calling getByClassId function from class.service
    getByClassId: async (req, res) => {
        try {
            const result = await getByClassId(req.params.id);
            return res.render("admin/mangclass/updateClass", { result, moment })
        } catch (error) {
            return res.send(error.message)

        }
    },
    // get admin info
    getByAdminId: async (req, res) => {
        try {
            //get the current admin who sign in decodedAdmin accessible from token_validation_admin
            const adminId = req.decodedAdmin.result._id;
            const result = await getByAdminId(adminId);
            return res.render("admin/profile", { result })
        } catch (error) {
            return res.send(error.message)

        }
    },
    // a query to filter counts of male and female TODO Needs to be refactored into service!
    chartDisplay: (req, res) => {
        let female, male;
        Member.find({})
            .then(members => {
                female = members.filter(member => member.gender == "female");
                male = members.filter(member => member.gender == "male");
                res.render('admin/dashboard', { female: female.length, male: male.length });
            })
            .catch(err => console.error(err));

    },

}
function saveImage(result, coverEncoded) {

    if (coverEncoded == null || coverEncoded == "")
        return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        // The Buffer class in Node.js is designed to handle raw binary data. 
        // SETTING IMAGE AS BINARY DATA
        result.classImg = new Buffer.from(cover.data, 'base64')
        result.classImgType = cover.type

    }
}