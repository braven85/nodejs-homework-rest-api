const {
  Types: { ObjectId },
} = require("mongoose");
const Contact = require("./schemas/contact");

const getAllContacts = () => Contact.find({}).lean();

const getSingleContact = (contactId) => {
  let objectIdContactId;
  try {
    // map to ObjectId
    objectIdContactId = ObjectId(contactId);
  } catch (err) {
    return null;
  }
  return Contact.findOne({ _id: objectIdContactId }).lean();
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
