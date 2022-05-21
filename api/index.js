const express = require("express");
const router = express.Router();
const contactsController = require("../controllers/contacts");
const usersController = require("../controllers/users");
const authMiddleware = require("../middleware/jwt");

router.get("/contacts", contactsController.get);
router.get("/contacts/:contactId", contactsController.getOne);
router.post("/contacts", contactsController.addContact);
router.delete("/contacts/:contactId", contactsController.removeContact);
router.put("/contacts/:contactId", contactsController.updateContact);
router.patch(
  "/contacts/:contactId/favorite",
  contactsController.patchIsFavorite
);

router.post("/users/signup", usersController.registerUser);
router.post("/users/login", usersController.loginUser);
router.get("/users/current", authMiddleware, usersController.currentUser);
router.get("/users/logout", authMiddleware, usersController.logoutUser);

module.exports = router;
