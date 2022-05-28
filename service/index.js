const mongoose = require("mongoose");
const Contact = require("./schemas/contact");
const User = require("./schemas/user");

const getAllContacts = (owner) => Contact.find({ owner }).lean();

const getSingleContact = (contactId) => {
  return mongoose.isValidObjectId(contactId)
    ? Contact.findOne({ _id: contactId }).lean()
    : null;
};

const createContact = ({ name, email, phone, _id }) =>
  Contact.create({ name, email, phone, owner: _id });

const removeContact = (contactId) => Contact.deleteOne({ _id: contactId });

const updateContact = (contactId, contactToUpdate) =>
  Contact.findOneAndUpdate(
    { _id: contactId },
    { $set: contactToUpdate },
    {
      new: true,
      runValidators: true,
      strict: "throw",
    }
  );

const getFavContacts = (favorite, owner) => Contact.find({ favorite, owner });

const updateUserJWT = (_id, token) => User.findByIdAndUpdate(_id, { token });

module.exports = {
  getAllContacts,
  getSingleContact,
  createContact,
  removeContact,
  updateContact,
  getFavContacts,
  updateUserJWT,
};
