const express = require("express");
const database = require("./config/database");
const path = require('path');
require("dotenv").config();
const app = express();
const port = process.env.PORT;

const routeAdmin = require("./API/v1/routes/admin/index-route");
const systemConfig = require('./config/system')

database.connect();

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
app.use(express.static(`${__dirname}/public`))

app.locals.prefixAdmin = systemConfig.prefixAdmin

routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
