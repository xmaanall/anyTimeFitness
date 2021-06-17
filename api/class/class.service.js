/*
*****************************************SERVICES*****************************************
functions that deal with retrieving data from backend wethear is database or an external api.
It returns a promise since it is a promise when calling it you must make it as await, async.

services are useful and more efficient approach for testing, code organization, and code re-use.
*/

const ClassFit = require("../../models/class.model");

module.exports = {
    // create a new class 
    createClass: (data) => {
        return new Promise((resolve, reject) => {
            let classFit = new ClassFit(data);
            classFit.save(
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }

            )
        })
    },
    // get class info by type
    getByClassType: (type) => {
        return new Promise((resolve, reject) => {
            ClassFit.find({ type: type },
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })

    },
    // get all classes
    getAllClasses: (id) => {
        return new Promise((resolve, reject) => {
            ClassFit.find({},
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    // get a class by id
    getRegistedClasses: (id) => {
        return new Promise((resolve, reject) => {
            ClassFit.find({ id },
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    // add the member who register a class in the class model under member array since it is mutual relation
    registerMember: (member, classFit) => {
        return new Promise((resolve, reject) => {
            ClassFit.findByIdAndUpdate(classFit, { $addToSet: { members: member } },
                { useFindAndModify: false }).then(results => {
                    return resolve(results)
                })
                .catch(e => {
                    return reject(e)
                })
        })
    },
    //get a class info by id 
    getByClassId: (id) => {
        return new Promise((resolve, reject) => {
            ClassFit.findById(id,
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    // get a class by id
    getByClassIdMember: (id) => {
        return new Promise((resolve, reject) => {
            ClassFit.findById(id,
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    // update a class by id
    updateByClassId: (id, data) => {
        return new Promise((resolve, reject) => {
            ClassFit.findOneAndUpdate({ _id: id },
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
    // delete a class by id
    deleteByClassId: (id) => {
        return new Promise((resolve, reject) => {
            ClassFit.findByIdAndDelete(id,
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