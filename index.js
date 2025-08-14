const express = require("express");
const database = require("./config/database");
//const path = require('path');

const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')

require("dotenv").config();
const app = express();
const port = process.env.PORT;

const routeAdmin = require("./API/v1/routes/admin/index-route");


database.connect();

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
app.use(express.static(`${__dirname}/public`))

//override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//giao tiếp 2 bên bằng json
app.use(bodyParser.json())

//Express-flash
app.use(cookieParser('key tu Vui'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(flash())

routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
