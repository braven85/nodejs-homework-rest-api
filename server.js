const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const fs = require("fs").promises;
const path = require("path");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

require("./config/passport");

const apiRouter = require("./api");
app.use("/api", apiRouter);

app.use((_, res, __) => {
  res.status(404).json({
    message: "Use api on routes: /api",
  });
});

app.use((err, _, res, __) => {
  res.status(500).json({
    message: err.message,
  });
});

const uriDb = process.env.DB_URI;
const PORT = process.env.PORT;

const uploadDir = path.join(process.cwd(), "tmp");

const isAccesible = (accessiblePath) => {
  return fs
    .access(accessiblePath)
    .then(() => true)
    .catch(() => false);
};

const createFolderIfNotExist = async (folder) => {
  if (!(await isAccesible(folder))) {
    await fs.mkdir(folder);
  }
};

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, () => {
      createFolderIfNotExist(uploadDir);
      console.log(`Database connection successful! Listening on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed!");
    process.exit(1);
  });
