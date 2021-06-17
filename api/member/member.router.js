/*
*****************************************ROUTER*****************************************
Uses HTTP methods that invoke controller as callback.
*/

const router = require("express").Router();
const { checkToken } = require("./token_validation");

const {
  createMember,
  login,
  getByMemberId,
  forgotPassword,
  resetPassword,
  resetPasswordGet,
  logout,
  registerClass,
  getRegistedClasses,
  updateByMemberId,
  removeClass,
  registerMembership, removeMembership
} = require("./member.controller");
const { getAllMemberships } = require("../membership/membership.controller");
router.post("/", createMember);

router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", checkToken, getByMemberId);
router.get("/schedule", (req, res) => {
  res.render("member/schedule", { layout: "layout" });
});
router.get("/registerClass", checkToken, registerClass);
router.post("/registerClass/:classId", checkToken, registerClass);
router.post("/removeClass/:classId", checkToken, removeClass);


router.post("/updateByMemberId", checkToken, updateByMemberId)
router.get("/registerMembership", checkToken, registerMembership);
router.post("/registerMembership/:membershipId", checkToken, registerMembership);
router.post("/registerMembership/:membershipId", checkToken, removeMembership);


router.get("/getMemberDetails/:id", getByMemberId)

router.post("/forgot-password", forgotPassword);
router.get("/classes/", checkToken, getRegistedClasses);

router.post("/reset-password/:id/:token", resetPassword);
router.get("/login", (req, res) => {
  res.render("member/login2", { layout: "layout" });
});
router.get("/forgot-password", (req, res) => {
  res.render("member/forgotPassword", { layout: "layout" });
});

router.get("/reset-password/:id/:token", resetPasswordGet);

router.get("/classes", (req, res) => {
  res.render("classes", { layout: "layout" });
});
router.get("/membership", (req, res) => {
  res.render("membership", { layout: "layout" });
});

router.get("/index", getAllMemberships)
router.get("/reset-password/:id/:token", resetPasswordGet);

router.get("/", (req, res) => {
  res.render("member/login2", { layout: "layout" });
});


module.exports = router;