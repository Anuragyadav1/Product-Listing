const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const recommendationCtrl = require("../controllers/recommendation.controller");

router.post("/", auth, recommendationCtrl.recommendProperty);
router.get("/", auth, recommendationCtrl.getReceivedRecommendations);

module.exports = router;
