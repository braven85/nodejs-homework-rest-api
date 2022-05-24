const express = require("express");
const router = express.Router();
const contactsController = require("../controllers/contacts");
const usersController = require("../controllers/users");
const authMiddleware = require("../middleware/jwt");

router.get("/contacts", authMiddleware, contactsController.getAll);
router.get("/contacts/:contactId", authMiddleware, contactsController.getOne);
router.post("/contacts", authMiddleware, contactsController.addContact);
router.delete(
  "/contacts/:contactId",
  authMiddleware,
  contactsController.removeContact
);
router.put(
  "/contacts/:contactId",
  authMiddleware,
  contactsController.updateContact
);
router.patch(
  "/contacts/:contactId/favorite",
  authMiddleware,
  contactsController.patchIsFavorite
);

router.post("/users/signup", usersController.registerUser);
router.post("/users/login", usersController.loginUser);
router.get("/users/current", authMiddleware, usersController.currentUser);
router.get("/users/logout", authMiddleware, usersController.logoutUser);

module.exports = router;
