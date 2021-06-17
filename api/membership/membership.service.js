const MemberShip = require("../../models/membership.model");

module.exports = {

    create: (data) => {
        return new Promise((resolve, reject) => {
            let memberShip = new MemberShip(data);
            memberShip.save(
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }

            )
        })
    },
    getAllMemberships: (id) => {
        return new Promise((resolve, reject) => {
            MemberShip.find({},
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    getRegistedMemberships: (id) => {
        return new Promise((resolve, reject) => {
            MemberShip.find({ id },
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    getByMembershipId: (id) => {
        return new Promise((resolve, reject) => {
            MemberShip.find({ id },
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    getByMembershipIdMember: (id) => {
        return new Promise((resolve, reject) => {
            MemberShip.findById(id,
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    updateByMembershipId: (id, data) => {
        return new Promise((resolve, reject) => {
            MemberShip.findOneAndUpdate({ _id: id },
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
    deleteByMembershipId: (id) => {
        return new Promise((resolve, reject) => {
            MemberShip.findByIdAndDelete(id,
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