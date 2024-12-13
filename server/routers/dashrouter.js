const express = require("express");
const router = express.Router();
const dashcontroller = require("../controllers/dashcontroller");
const middleware = require("../middleware.js");

router.get("/", middleware.userAuth, dashcontroller.dashboardView);
router.post("/checkoutreq", middleware.userAuth, dashcontroller.RequestOut);
router.get(
  "/checkoutList",
  middleware.userAuth,
  dashcontroller.viewCheckoutList
);

router.post("/checkin", middleware.userAuth, dashcontroller.handIn);

module.exports = router;
