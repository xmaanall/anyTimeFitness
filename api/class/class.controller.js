/*
***********************************CONTROLLER**********************************
functions that deal with calling the service do some logic, checking or validation
 of the returned results. And pass the data from the HTTP requests off to the service
*/

const {
    getByClassId, getAllClasses, getByClassIdMember
} = require("./class.service");
const {
    getAllMemberships
} = require("../membership/membership.service");

module.exports = {
    // call getAllClasses service and getAllMemberships service from membership and return result
    getAllClasses: async (req, res) => {
        try {
            const results = await getAllClasses()
            const membershipResults = await getAllMemberships()
            return res.render("member/classes", { results, membershipResults, layout: "layout" })
            // return res.send(results)
        } catch (error) {
            res.send(error.message)
        }
    },

    // call getByClassId service and return result
    getByClassId: async (req, res) => {
        try {
            const result = await getByClassId(req.params.classId)
            return res.send(result)
        } catch (error) {
            res.send(error.message)
        }

    },
}