// const fs = require("fs/promises");
// const path = require("path");
// const contactsPath = path.join(__dirname, "contacts.json");

// const listContacts = async () => {
//   const contacts = await fs.readFile(contactsPath, (err, data) => {
//     if (err) console.error(err);
//     return data;
//   });
//   return {
//     status: "success",
//     code: 200,
//     data: JSON.parse(contacts),
//   };
// };

// const getContactById = async (contactId) => {
//   const contacts = await fs.readFile(contactsPath, (err, data) => {
//     if (err) console.error(err);
//     return data;
//   });

//   const foundContact = JSON.parse(contacts).find(
//     (contact) => contact.id === contactId
//   );

//   if (foundContact) {
//     return {
//       status: "error",
//       code: 404,
//       message: "There is no contact with given ID!",
//     };
//   } else {
//     return {
//       status: "success",
//       code: 200,
//       data: foundContact,
//     };
//   }
// };

// const removeContact = async (contactId) => {
//   const contacts = await fs.readFile(contactsPath, (err, data) => {
//     if (err) console.error(err);
//     return data;
//   });
//   const foundContacts = JSON.parse(contacts);

//   if (foundContacts.find(({ id }) => id === contactId) !== undefined) {
//     const newContactsList = foundContacts.filter(({ id }) => id !== contactId);
//     fs.writeFile(
//       contactsPath,
//       JSON.stringify(newContactsList, null, "\t"),
//       (err) => {
//         if (err) console.error(err);
//       }
//     );
//     return {
//       status: "success",
//       code: 200,
//       message: "Contact successfully deleted!",
//     };
//   } else {
//     return {
//       status: "error",
//       code: 404,
//       message: "Contact not found!",
//     };
//   }
// };

// const addContact = async (body) => {
//   const contacts = await fs.readFile(contactsPath, (err, data) => {
//     if (err) console.error(err);
//     return data;
//   });
//   const foundContacts = JSON.parse(contacts);

//   const newId = Math.max(...foundContacts.map(({ id }) => +id)) + 1;
//   const { name, email, phone } = body;
//   const newContact = {
//     id: String(newId),
//     name,
//     email,
//     phone,
//   };
//   const newContactsList = [...foundContacts, newContact];
//   fs.writeFile(
//     contactsPath,
//     JSON.stringify(newContactsList, null, "\t"),
//     (err) => {
//       if (err) console.error(err);
//     }
//   );
//   return {
//     status: "success",
//     code: 201,
//     data: newContact,
//   };
// };

// const updateContact = async (contactId, body) => {
//   const contacts = await fs.readFile(contactsPath, (err, data) => {
//     if (err) console.error(err);
//     return data;
//   });

//   const foundContacts = JSON.parse(contacts);

//   if (foundContacts.find(({ id }) => id === contactId) !== undefined) {
//     const { name, email, phone } = body;

//     if (!Object.entries(body).length) {
//       return {
//         status: "error",
//         code: 400,
//         message: "missing fields",
//       };
//     }

//     const [filteredContact] = foundContacts.filter(
//       (contact) => contact.id === contactId
//     );

//     name !== undefined ? (filteredContact.name = name) : filteredContact.name;
//     email !== undefined
//       ? (filteredContact.email = email)
//       : filteredContact.email;
//     phone !== undefined
//       ? (filteredContact.phone = phone)
//       : filteredContact.phone;

//     fs.writeFile(
//       contactsPath,
//       JSON.stringify(foundContacts, null, "\t"),
//       (err) => {
//         if (err) console.error(err);
//       }
//     );

//     return {
//       status: "success",
//       code: 200,
//       data: filteredContact,
//     };
//   } else {
//     return {
//       status: "error",
//       code: 400,
//       message: "Contact not found!",
//     };
//   }
// };

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
