const express = require("express");
const router = express.Router();
const admincontroller = require("../controllers/admincontroller");
const middleware = require("../middleware.js");

// Routing for admin login functions
router.get("/", admincontroller.loginGet);
router.post("/", admincontroller.loginPost);

//Routing for dashboard
router.get(
  "/admin-dashboard",
  middleware.adminAuth,
  admincontroller.dashboardView
);

//Routing for adding books
router.get(
  "/admin-dashboard/addBooks",
  middleware.adminAuth,
  admincontroller.addBooksView
);
router.post(
  "/admin-dashboard/addBooks",
  middleware.adminAuth,
  admincontroller.addBooks
);

//Routing for removing books
router.get(
  "/admin-dashboard/removeBooks",
  middleware.adminAuth,
  admincontroller.removeBooksView
);
router.post(
  "/admin-dashboard/removeBooks",
  middleware.adminAuth,
  admincontroller.removeBooks
);

//Routing for requests
router.get(
  "/admin-dashboard/requests",
  middleware.adminAuth,
  admincontroller.viewReqs
);
router.post(
  "/admin-dashboard/requests/approve",
  middleware.adminAuth,
  admincontroller.approve
);
router.post(
  "/admin-dashboard/requests/deny",
  middleware.adminAuth,
  admincontroller.deny
);

// Routing for logout
router.get("/logout", admincontroller.logout);

module.exports = router;
