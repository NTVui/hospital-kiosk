const express = require("express");
const database = require("./config/database");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

database.connect();
//Tạo thử route
app.get("/tasks", async (req, res) => {
  res.send("DS");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
