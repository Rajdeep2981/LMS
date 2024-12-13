const express = require("express");
const { ExpressHandlebars } = require("express-handlebars");
const db = require("../../database");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Viewing Dashboard
exports.dashboardView = (req, res) => {
  db.query("SELECT isbn, title, quantity FROM books;", (err, data) => {
    if (!err) {
      console.log(data);
      res.render("dashboard", { layout: "dashboardlayout", data: data });
    } else {
      throw err;
    }
  });
};

exports.RequestOut = (req, res) => {
  const bookID = req.body.bookID;
  db.query(
    "SELECT title, isbn FROM books WHERE isbn = " + db.escape(bookID) + ";",
    (err, row) => {
      if (err) throw err;
      console.log(row[0]);
      if (row[0] === undefined) {
        res.send("Current book not available right now :/");
      } else {
        let status = 0;
        db.query(
          "INSERT INTO request (enrollmentNo, book, status, isbn) VALUES (" +
            db.escape(req.session.eno) +
            ", " +
            db.escape(row[0]["title"]) +
            ", " +
            db.escape(status) +
            ", " +
            db.escape(bookID) +
            ");",
          (err, data) => {
            if (err) throw err;
            res.redirect("/dashboard");
          }
        );
      }
    }
  );
};

//Viewing CheckOut-List
exports.viewCheckoutList = (req, res) => {
  db.query(
    "SELECT book, isbn FROM request WHERE enrollmentNo = " +
      db.escape(req.session.eno) +
      " AND status=1" +
      ";",
    (err, data) => {
      if (err) throw err;
      console.log(data);
      res.render("checkoutList", { layout: "checkoutListLayout", data: data });
    }
  );
};

//Hand In
exports.handIn = (req, res) => {
  const bookID = req.body.bookID;
  db.query(
    "SELECT * FROM books where isbn = " + db.escape(bookID) + ";",
    (err, data) => {
      if (err) throw err;
      const z = data[0]["quantity"] + 1;
      db.query(
        "UPDATE books SET quantity = " +
          db.escape(z) +
          "WHERE isbn = " +
          db.escape(bookID) +
          ";",
        (err, row) => {
          if (err) throw err;
          console.log(row);
          db.query(
            "SELECT * FROM request WHERE isbn = " +
              db.escape(bookID) +
              " AND enrollmentNo = " +
              db.escape(req.session.eno) +
              ";",
            (err, row) => {
              if (err) throw err;
              console.log(row);
              db.query(
                "DELETE FROM request WHERE isbn = " +
                  db.escape(bookID) +
                  " AND enrollmentNo = " +
                  db.escape(req.session.eno) +
                  ";",
                (err, row) => {
                  if (err) throw err;
                  console.log(row);
                  res.redirect("/dashbaord/checkoutList");
                }
              );
            }
          );
        }
      );
    }
  );
};
