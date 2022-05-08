const service = require("../service");
const { postSchema } = require("../joi");

const get = async (req, res, next) => {
  try {
    const contacts = await service.getAllContacts();
    res.json(contacts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getOne = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await service.getSingleContact(contactId);
    if (!contact) {
      res.status(404).json({ message: "Contact not found!" });
    } else {
      res.json(contact);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = postSchema.validate({ name, email, phone });
  if (!error) {
    try {
      const result = await service.createContact({ name, email, phone });
      res.status(201).json({ message: "Contact was created", contact: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  } else {
    res.json({
      status: "error",
      code: 403,
      message: error.details[0].message,
    });
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    await service.removeContact(contactId);
    res.status(204).json();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contactToUpdate = req.body;
  try {
    const result = await service.updateContact(contactId, contactToUpdate);
    if (!result) {
      res.status(404).json({ message: "Contact not found!" });
    } else {
      res.json({ message: "Contact was updated!", contact: result });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const patchIsFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite = false } = req.body;
  try {
    const result = await service.updateContact(contactId, { favorite });
    if (!result) {
      res.status(404).json({ message: "Contact not found!" });
    } else {
      res.json({
        message: `Favorite was changed to ${favorite}`,
        contact: result,
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  get,
  getOne,
  addContact,
  removeContact,
  updateContact,
  patchIsFavorite,
};
