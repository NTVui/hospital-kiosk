const express = require("express");
const database = require("./config/database");
const path = require('path');
require("dotenv").config();
const app = express();
const port = process.env.PORT;

const routeAdmin = require("./API/v1/routes/admin/index-route");


database.connect();

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
app.use(express.static(`${__dirname}/public`))



routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
