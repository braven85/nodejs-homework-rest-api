// const express = require("express");
// const {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// } = require("../../models/contacts");
// const { postSchema, putSchema } = require("../../joi");

// const router = express.Router();

// router.get("/", (req, res, next) => {
//   listContacts()
//     .then((data) => res.json(data))
//     .catch((err) => console.error(err));
// });

// router.get("/:contactId", async (req, res, next) => {
//   const { contactId } = req.params;
//   getContactById(contactId)
//     .then((data) => {
//       res.json(data);
//     })
//     .catch((err) => console.error(err));
// });

// router.post("/", async (req, res, next) => {
//   const body = postSchema.validate(req.body);
//   if (body.error) {
//     res.status(400).json({ message: "Missing required name field" });
//   } else {
//     addContact(body.value)
//       .then((data) => {
//         res.json(data);
//       })
//       .catch((err) => console.error(err));
//   }
// });

// router.delete("/:contactId", async (req, res, next) => {
//   const { contactId } = req.params;
//   removeContact(contactId)
//     .then((data) => {
//       res.json(data);
//     })
//     .catch((err) => console.error(err));
// });

// router.put("/:contactId", async (req, res, next) => {
//   const { contactId } = req.params;
//   const body = putSchema.validate(req.body);
//   if (body.error) {
//     res.json({
//       status: "error",
//       code: 403,
//       message: body.error.message,
//     });
//   } else {
//     updateContact(contactId, body.value)
//       .then((data) => {
//         res.json(data);
//       })
//       .catch((err) => console.error(err));
//   }
// });

// module.exports = router;
