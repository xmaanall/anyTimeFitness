/*
*****************************************SERVICES*****************************************
functions that deal with retrieving data from backend wethear is database or an external api.
It returns a promise since it is a promise when calling it you must make it as await, async.

services are useful and more efficient approach for testing, code organization, and code re-use.
*/

const Member = require("../../models/member.model");
const Admin = require("../../models/user.model")

module.exports = {
    // create a new admin
    createAdmin: (data) => {
        return new Promise((resolve, reject) => {
            let member = new Admin(data);
            member.save(
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }

            )
        })
    },

    // get admin info by email
    getByAdminEmail: (email) => {
        return new Promise((resolve, reject) => {
            Admin.find({ email },
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },

    // get admin info by id
    getByAdminId: (id) => {
        return new Promise((resolve, reject) => {
            Admin.findById(id,
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },

};