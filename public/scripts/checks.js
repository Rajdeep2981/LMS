let bookID, bookName, enrollmentNo;

function checkoutFn(id) {
  bookID = id;
  axios
    .post("/dashboard/checkoutreq", {
      bookID: bookID,
    })
    .then((res) => {
      window.location.href = "http://localhost:5000/dashboard";
    });
}

function checkinFn(id) {
  bookID = id;
  axios
    .post("/dashboard/checkin", {
      bookID: bookID,
    })
    .then((res) => {
      window.location.href = "http://localhost:5000/dashboard";
    });
}

function removeFn(id) {
  console.log("remove insitiiated");
  axios
    .post("/admin/admin-dashboard/removeBooks", {
      bookID: id,
      quantity: document.getElementById("quantity").value,
    })
    .then((res) => {
      window.location.href = "http://localhost5000/admin/admin-dashboard";
    });
}

function approveFn(id1, id2, id3) {
  axios
    .post("/admin/admin-dashboard/requests/approve", {
      bookID: id1,
      bookName: id2,
      enrollmentNo: id3,
    })
    .then((res) => {
      window.location.href =
        "http:localhost:5000/admin/admin-dashboard/requests";
    });
}

function denyFn(id1, id2, id3) {
  bookID = id1;
  bookName = id2;
  enrollmentNo = id3;
  axios
    .post("/admin/admin-dashboard/requests/deny", {
      bookID: bookID,
      bookName: bookName,
      enrollmentNo: enrollmentNo,
    })
    .then((res) => {
      window.location.href =
        "http:localhost:5000/admin/admin-dashboard/requests";
    });
}
