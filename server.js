const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

require("./config/passport");

const apiRouter = require("./api");
app.use("/api", apiRouter);

app.use((_, res, __) => {
  res.status(404).json({
    message: "Use api on routes: /api/contacts",
  });
});

app.use((err, _, res, __) => {
  res.status(500).json({
    message: err.message,
  });
});

const uriDb = process.env.DB_URI;
const PORT = process.env.PORT;

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful! Listening on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed!");
    process.exit(1);
  });
