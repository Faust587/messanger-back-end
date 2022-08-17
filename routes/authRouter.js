const express = require("express");
const {
  signInController,
  signUpController,
  activateUserController,
  signOutController,
  refreshTokenController
} = require("../controllers/authController");

const {authTokenMiddleware} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/sign-in", signInController);
router.post("/sign-up", signUpController);
router.get("/activate/:token", activateUserController);
router.post("/log-out", signOutController);
router.get("/refresh", refreshTokenController);
router.get("/test", authTokenMiddleware, (req, res) => {
  console.log(res)
});

module.exports = router;
