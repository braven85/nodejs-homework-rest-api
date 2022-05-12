const mongoose = require("mongoose");
const Contact = require("./schemas/contact");

const getAllContacts = () => Contact.find({}).lean();

const getSingleContact = (contactId) => {
  return mongoose.isValidObjectId(contactId)
    ? Contact.findOne({ _id: contactId }).lean()
    : null;
};

const createContact = ({ name, email, phone }) =>
  Contact.create({ name, email, phone });

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

module.exports = {
  getAllContacts,
  getSingleContact,
  createContact,
  removeContact,
  updateContact,
};
