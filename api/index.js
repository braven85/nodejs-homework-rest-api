const express = require("express");
const router = express.Router();
const contactsController = require("../controllers/contacts");

router.get("/contacts", contactsController.get);
router.get("/contacts/:contactId", contactsController.getOne);
router.post("/contacts", contactsController.addContact);
router.delete("/contacts/:contactId", contactsController.removeContact);
router.put("/contacts/:contactId", contactsController.updateContact);
router.patch("/contacts/:contactId/favorite", contactsController.patchIsFavorite);

module.exports = router;
