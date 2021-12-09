//create server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

//capture data from forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

//assests
app.use("/resources", express.static("public"));
//app.use("/resources", express.static(__dirname + "/public"));

//motor de platillas
app.set("view engine", "ejs");

//hash password
const bcryptjs = require("bcryptjs");

//seccion var
const session = require("express-session");
app.use(
  session({
    secret: "password",
    resave: "true",
    saveUninitialized: "false",
    name: "",
  })
);

const connection = require("./Database/db");
const { read } = require("fs");

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/auth", (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;

  if (user && pass) {
    connection.query(
      "SELECT * FROM users WHERE name = ?",
      [user],
      async (error, results) => {
        if (results.length == 0) {
          res.send("usuario y/o password incorrectos");
        } else {
          if (!(await bcryptjs.compare(req.body.pass, results[0].pass))) {
            res.send("password incorrectos");
          } else {
            req.session.saveUninitialized = true;
            req.session.name = results[0].name;
            res.redirect("/dashboard");
          }
        }
      }
    );
  } else {
    res.send("usuario y/o password incorrectos");
  }
});

app.post("/register", (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  const email = req.body.email;
  const last = req.body.last;
  let passwordHash = bcryptjs.hashSync(pass, 8);
  connection.query(
    "INSERT INTO users SET ?",
    {
      name: user,
      pass: passwordHash,
      last_name: last,
      email: email,
    },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render("regresar");
      }
    }
  );
});

app.get("/register", (req, res) => {
  res.render("register");
});

//auth para todas las paginas

app.get("/", (req, res) => {
  if (req.session.saveUninitialized) {
    res.render("index", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      login: false,
      name: "no name",
    });
  }
});

app.get("/about", (req, res) => {
  if (req.session.saveUninitialized) {
    res.render("about", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("about", {
      login: false,
      name: "no name",
    });
  }
});


app.get("/contact", (req, res) => {
  if (req.session.saveUninitialized) {
    res.render("contact", {
      login: true,
    });
  } else {
    res.render("contact", {
      login: false,
    });
  }
});



app.get("/app", (req, res) => {
  if (req.session.saveUninitialized) {
    res.render("app", {
      login: true,
    });
  } else {
    res.render("app", {
      login: false,
    });
  }
});


app.get("/dashboard", (req, res) => {
  if (req.session.saveUninitialized) {
    res.render("dashboard", {
      name: req.session.name,
    });
  } else {
    res.render("dashboard", {
      name: "no name",
    });
  }
});