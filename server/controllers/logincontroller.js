const express = require("express");
const db = require("../../database");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//LoginGet implemented
exports.loginGet = (req, res) => {
  res.sendFile("Static/login.html", { root: "." });
};

//LoginPost implemented
exports.loginPost = (req, res) => {
  let enroll = req.body.enroll;
  let password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE enrollmentNo = " + db.escape(enroll) + ";",
    (err, row) => {
      if (!err) {
        if (row[0] === undefined) {
          res.send("User doesn't exist on the database");
        } else {
          console.log(row[0]["salt"]);
          console.log(password);
          let saltedPass = password + row[0]["salt"];
          console.log(saltedPass);

          let crypto = require("crypto");
          const hashedPass = crypto
            .createHash("sha256")
            .update(saltedPass)
            .digest("base64");
          if (row[0]["password"] == hashedPass) {
            req.session.eno = row[0].enrollmentNo;
            req.session.loggedin = true;
            req.session.name = row[0].username;

            console.log("Login successful");
            res.redirect("/dashboard");
          } else {
            res.send("Entered password is incorrect");
            console.log("Login unsuccessful");
          }
        }
      } else {
        console.log(err);
      }
    }
  );
};

// SignupGet implemented
exports.signupGet = (req, res) => {
  res.sendFile("Static/signup.html", { root: "." });
};

//SignupPost implemented
exports.signupPost = (req, res) => {
  function salt(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let username = req.body.username;
  let enroll = req.body.enroll;
  let password = req.body.password;
  let passwordC = req.body.passwordC;
  let crypto = require("crypto");
  let PassSalt = salt(7);
  console.log(PassSalt);
  let saltedPass = password + PassSalt; //made salted password with salt as suffix
  const hashedPass = crypto
    .createHash("sha256")
    .update(saltedPass)
    .digest("base64"); //hash generated

  db.query(
    "SELECT * FROM users WHERE enrollmentNo = " + db.escape(enroll) + ";",
    (err, rows) => {
      if (!err) {
        if (rows[0] === undefined) {
          console.log("New User");
          if (password == passwordC) {
            db.query(
              "INSERT INTO users (username,salt,enrollmentNo,password) VALUES(" +
                db.escape(username) +
                ", " +
                db.escape(PassSalt) +
                ", " +
                db.escape(enroll) +
                ", " +
                db.escape(hashedPass) +
                ");",
              (err, row) => {
                if (!err) {
                  console.log("Database updated with new User");
                  res.redirect("/");
                } else {
                  console.log(err);
                }
              }
            );
          } else {
            res.send("Both passwords are not the same :( ");
          }
        } else {
          res.send("User already exists!");
        }
      } else {
        console.log(err);
      }
    }
  );
};

exports.logout = (req, res) => {
  console.log(req.session);
  // res.clearCookie(req.session.name);
  req.session.destroy();
  res.redirect("/");
};
