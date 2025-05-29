const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const propertyCtrl = require("../controllers/property.controller");

router.post("/", auth, propertyCtrl.createProperty);
router.get("/", propertyCtrl.getProperties);
router.get("/:id", propertyCtrl.getProperty);
router.put("/:id", auth, propertyCtrl.updateProperty);
router.delete("/:id", auth, propertyCtrl.deleteProperty);

module.exports = router;
