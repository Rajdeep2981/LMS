const express = require("express");
const app = express();

// Express hbs setup
const hbs = require("express-handlebars");
const handlebars = hbs.create({ extname: ".hbs" });
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

// Session management set-up
const session = require("express-session");
const cookie = require("cookie-parser");
app.use(cookie());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "123456",
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

app.use(express.static(__dirname + "/public"));

const loginrouter = require("./server/routers/loginrouter.js");
const dashrouter = require("./server/routers/dashrouter.js");
const adminrouter = require("./server/routers/adminrouter.js");

app.use("/", loginrouter);
app.use("/dashboard", dashrouter);
app.use("/admin", adminrouter);

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
