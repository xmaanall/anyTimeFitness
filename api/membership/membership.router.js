const router = require("express").Router();

const {
  createMembership, getByMembershipId, deleteByMembershipId, getAllMemberships, updateByMembershipId
} = require("./membership.controller");
router.get("/memberships", getAllMemberships)
router.delete("/deleteByMembershipId/:membershipId", deleteByMembershipId);
router.put("/updateByMembershipId/:membershipId", updateByMembershipId)
router.get("/getById/:membershipId", getByMembershipId);
router.get("/getAllMemberships", getAllMemberships)

router.post("/newmembership", createMembership);
router.get("/newmembership", (req, res) => {
  res.render("newmembership");
});
module.exports = router;