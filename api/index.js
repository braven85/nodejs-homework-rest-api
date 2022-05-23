const express = require("express");
const router = express.Router();
const contactsController = require("../controllers/contacts");
const usersController = require("../controllers/users");
const authMiddleware = require("../middleware/jwt");

const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const uploadDir = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/contacts", contactsController.get);
router.get("/contacts/:contactId", contactsController.getOne);
router.post("/contacts", contactsController.addContact);
router.delete("/contacts/:contactId", contactsController.removeContact);
router.put("/contacts/:contactId", contactsController.updateContact);
router.patch(
  "/contacts/:contactId/favorite",
  contactsController.patchIsFavorite
);

router.get("/users", usersController.listAllUsers);
router.post("/users/signup", usersController.registerUser);
router.post("/users/login", usersController.loginUser);
router.get("/users/current", authMiddleware, usersController.currentUser);
router.get("/users/logout", authMiddleware, usersController.logoutUser);
router.patch(
  "/users/avatars",
  authMiddleware,
  upload.single("avatar"),
  usersController.updateAvatar
);
router.delete("/users/:userId", usersController.removeUser);

module.exports = router;
