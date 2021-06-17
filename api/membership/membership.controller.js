const {
    create, getByMembershipId, deleteByMembershipId, updateByMembershipId, getAllMemberships, getByMembershipIdMember
} = require("./membership.service");


module.exports = {
    createMembership: async (req, res) => {
        try {
            const body = req.body;
            //service call
            await create(body);
            // check if exist
            res.json({ status: 'ok' })
        } catch (e) {
            return res.json({ msg: e.message })
        }



    },
    getAllMemberships: async (req, res) => {
        try {
            const results = await getAllMemberships()
            return res.render("index", { results, layout: "layout" })
            // return res.send(results)
        } catch (error) {
            res.send(error.message)
        }
    },
    getByMembershipId: async (req, res) => {
        try {
            const result = await getByMembershipId(req.params.membershipId)
            return res.send(result)
        } catch (error) {
            res.send(error.message)
        }

    },
    getByMembershipIdMember: async (req, res) => {
        try {
            const result = await getByMembershipIdMember(req.params.membershipId)
            return res.send(result)
        } catch (error) {
            res.send(error.message)
        }

    },
    updateByMembershipId: async (req, res) => {
        try {
            await updateByMembershipId(req.params.membershipId, req.body)
            return res.send("updated successfully")
        } catch (error) {
            return res.send(error.message)
        }
    },
    deleteByMembershipId: async (req, res) => {
        try {
            const result = await deleteByMembershipId(req.params.membershipId)
            if (result)
                return res.send("deleted successfully")
            else {
                return res.send("not found")
            }
        } catch (error) {
            return res.send(error.message)
        }
    }


}