/*
*****************************************ROUTER*****************************************
Uses HTTP methods that invoke controller as callback.
*/


const router = require("express").Router();
const {
  getByClassId, getAllClasses
} = require("./class.controller");

router.get("/classes", getAllClasses)
router.get("/getById/:classId", getByClassId);

module.exports = router;

