const { Console } = require("console");
const express = require("express");
const { ExpressHandlebars } = require("express-handlebars");
const { redirect } = require("express/lib/response");
const db = require("../../database");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//LoginGet implemented
exports.loginGet = (req, res) => {
  if (req.session.admin && req.session.name) {
    res.redirect("/admin/admin-dashboard");
  }
  res.sendFile("Static/adminLogin.html", { root: "." });
};

//LoginPost implemented
exports.loginPost = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  db.query(
    "SELECT * FROM admin WHERE username = " + db.escape(username) + ";",
    (err, row) => {
      if (!err) {
        if (row[0] === undefined) {
          res.send("Wrong credentials :)");
        } else {
          console.log(row[0]["salt"]);
          let saltedPass = password + row[0]["salt"];
          console.log(row[0]["password"]);
          let crypto = require("crypto");
          const hashedPass = crypto
            .createHash("sha256")
            .update(saltedPass)
            .digest("base64");
          console.log(hashedPass);
          if (row[0]["password"] == hashedPass) {
            console.log("Admin login successful");
            req.session.admin = true;
            req.session.name = row[0]["username"];
            console.log(req.session.name);
            console.log(req.session.admin);
            res.redirect("/admin/admin-dashboard");
          } else {
            res.send("Entered password is incorrect");
          }
        }
      } else {
        console.log(err);
      }
    }
  );
};

//
exports.dashboardView = (req, res) => {
  db.query("SELECT * FROM books;", (err, data) => {
    if (err) throw err;
    console.log(data);
    res.render("admin-dashboard", { layout: "admindashLayout", data: data });
  });
};

exports.addBooksView = (req, res) => {
  res.sendFile("Static/adminAddBooks.html", { root: "." });
};

exports.addBooks = (req, res) => {
  const isbn = req.body.isbn;
  const name = req.body.name;
  const quantity = req.body.quantity;

  db.query(
    "SELECT * FROM books WHERE isbn = " + db.escape(isbn) + ";",
    (err, row) => {
      if (err) throw err;
      if (row[0] === undefined) {
        db.query(
          "INSERT INTO books (title, quantity, isbn, status) VALUES (" +
            db.escape(name) +
            ", " +
            db.escape(quantity) +
            ", " +
            db.escape(isbn) +
            ", 1);",
          (err, row) => {
            if (err) throw err;
            console.log("Books added into db");
            res.redirect("/admin/admin-dashboard");
          }
        );
      } else {
        if (name == row[0]["title"]) {
          const x = row[0]["quantity"];
          x = x + quantity;
          db.query(
            "UPDATE books SET quantity = " +
              db.escape(x) +
              " WHERE isbn = " +
              db.escape(isbn) +
              ";",
            (err, row) => {
              if (err) throw error;
              console.log("Existing book's quantity updated");
            }
          );
        } else {
          res.send("Entered book's title and isbn do not match");
        }
      }
    }
  );
};

exports.removeBooksView = (req, res) => {
  db.query("SELECT isbn, title, quantity FROM books ;", (err, data) => {
    if (err) throw err;
    console.log(data);
    res.render("removeBooks", { layout: "removeBooksLayout", data: data });
  });
};

exports.removeBooks = (req, res) => {
  const quantity = req.body.quantity;
  const isbn = req.body.bookID;
  console.log(req.body);
  db.query(
    "SELECT isbn, title, quantity FROM books WHERE isbn = " +
      db.escape(isbn) +
      "; ",
    (err, data) => {
      if (err) throw err;
      console.log(data);
      console.log(data[0]["quantity"]);
      const x = data[0]["quantity"] - quantity;
      if (x >= 0) {
        db.query(
          "UPDATE books SET quantity = " +
            db.escape(x) +
            " WHERE isbn=" +
            db.escape(isbn) +
            ";",
          (err, row) => {
            if (err) throw err;
            console.log("Existing book's quantity updated");
          }
        );
      } else {
        res.send("Quantity of books lower than what you want to delete");
      }
    }
  );
};

exports.viewReqs = (req, res) => {
  db.query(
    "SELECT isbn, book, enrollmentNo FROM request WHERE status = 0;",
    (err, rows) => {
      if (err) throw err;
      console.log(rows);
      res.render("requests", { layout: "requestLayout", data: rows });
    }
  );
};

exports.approve = (req, res) => {
  const bookID = req.body.bookID;
  const bookName = req.body.bookName;
  const enroll = req.body.enrollmentNo;
  db.query(
    "SELECT * FROM request WHERE isbn = " +
      db.escape(bookID) +
      "AND enrollmentNo = " +
      db.escape(enroll) +
      ";",
    (err, row) => {
      if (err) throw err;
      console.log(row);
      db.query(
        "UPDATE request SET status = 1 WHERE isbn = " +
          db.escape(bookID) +
          " AND enrollmentNo = " +
          db.escape(enroll) +
          ";",
        (err, data) => {
          if (err) {
            throw err;
          } else {
            db.query(
              "SELECT (title,quantity,isbn) FROM books WHERE isbn = " +
                db.escape(isbn) +
                ";",
              (err, rows) => {
                if (err) throw err;
                console.log(rows[0][quantity]);
                const quant = row[0]["quantity"] - 1;
                db.query(
                  "UPDATE books SET QUANTITY = " +
                    db.escape(quant) +
                    " WHERE isbn = " +
                    db.escape(bookID) +
                    ";",
                  (err, data) => {
                    if (err) throw err;
                    res.redirect("/admin/admin-dashboard/requests");
                  }
                );
              }
            );
          }
        }
      );
    }
  );
};

exports.deny = (req, res) => {
  const bookID = req.body.bookID;
  const bookName = req.body.bookName;
  const enroll = req.body.enrollmentNo;
  db.query(
    "SELECT * FROM request WHERE isbn = " +
      db.escape(bookID) +
      "AND enrollmentNo = " +
      db.escape(enroll) +
      ";",
    (err, row) => {
      if (err) throw err;
      console.log(row);
      db.query(
        "DELETE FROM request WHERE isbn = " +
          db.escape(bookID) +
          " AND enrollmentNo = " +
          db.escape(enroll) +
          ";",
        (err, data) => {
          if (err) {
            throw err;
          } else {
            db.query(
              "SELECT (title,quantity,isbn) FROM books WHERE isbn = " +
                db.escape(bookID) +
                ";",
              (err, data) => {
                if (err) throw err;
                const y = data[0]["quantity"] + 1;
                db.query(
                  "UPDATE books SET quantity = " +
                    db.escape(y) +
                    " WHERE isbn = " +
                    db.escape(bookID) +
                    ";",
                  (err, data) => {
                    if (err) throw err;
                    res.redirect("/admin/admin-dashboard/requests");
                  }
                );
              }
            );
          }
        }
      );
    }
  );
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie(req.session.name);
  req.session.destroy();
  res.redirect("/admin");
};
