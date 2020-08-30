const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");

/** Create User */
router.post("/", UsersController.createUser);

/** Get User by Id */
router.get("/:userId", UsersController.getUserById);

/** Get All Customers */
router.get("/", (req, res, next) => {
  const { role } = req.query;
  if (role.toLowerCase() === "customer") {
    return UsersController.getAllCustomers(req, res, next);
  }
  res.sendStatus(404);
});

/** Update User */
router.put("/:userId", UsersController.updateUser);

/** Authenticate User by Email and Password */
router.post("/auth", UsersController.authenticateUser);

/** Update Password */
router.patch("/:userId", UsersController.updatePassword);

module.exports = router;
