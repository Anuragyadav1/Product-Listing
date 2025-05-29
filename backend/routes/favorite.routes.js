const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const favoriteCtrl = require("../controllers/favorite.controller");

router.post("/", auth, favoriteCtrl.addFavorite);
router.get("/", auth, favoriteCtrl.getFavorites);
router.delete("/:propertyId", auth, favoriteCtrl.removeFavorite);

module.exports = router;
