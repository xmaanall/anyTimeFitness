/*
*****************************************ROUTER*****************************************
Uses HTTP methods that invoke controller as callback.
*/

const router = require("express").Router();
const { checkToken } = require("./token_validation_admin");

const {
  getAllMembers,
  updateByMemberId,
  chartDisplay,
  addMemberAdmin,
  createAdmin,
  login, addClass,
  logout, getAllClassesPage,
  updateByClassId,
  deleteByMemberId, getByMemberId,
  getByAdminId, deleteByClassId,
  getByClassId
} = require("./admin.controller");
router.post("/", createAdmin);


router.post("/login", login)
router.get("/profile", checkToken, getByAdminId)
router.get("/logout", checkToken, logout);
router.get("/dashboard", checkToken, chartDisplay)
router.get("/dashboard", checkToken, (req, res) => {
  res.render("admin/dashboard", { layout: "layoutAdmin" });
});
router.get("/login", (req, res) => {
  res.render("admin/login", { layout: "layoutAdmin" });
});


router.get("/getAllMembers/:page", checkToken, getAllMembers)
router.get("/deleteByMemberId/:id", checkToken, deleteByMemberId);
router.get("/getMemberDetails/:id", checkToken, getByMemberId)
router.post("/updateByMemberId/:id", checkToken, updateByMemberId)
router.post("/addMember", checkToken, addMemberAdmin);
router.get("/addMember", checkToken, (req, res) => {
  res.render("admin/mangMember/addmember", { layout: "layoutAdmin" });
});


router.get("/getAllClasses/:page", checkToken, getAllClassesPage)
router.post("/updateByClassId/:id", checkToken, updateByClassId)
router.get("/deleteByClassId/:id", checkToken, deleteByClassId);
router.get("/getClassDetails/:id", checkToken, getByClassId)
router.post("/addClass", checkToken, addClass)
router.get("/addClass", checkToken, (req, res) => {
  res.render("admin/mangClass/addClass", { layout: "layoutAdmin" });
});



module.exports = router;