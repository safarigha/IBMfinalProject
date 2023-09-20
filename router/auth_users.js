const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (userName) => {
  let userswithsamename = users.filter((user) => {
    return user.userName === userName
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (userName, password) => {
  let validusers = users.filter((user) => {
    return (user.userName === userName && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}


regd_users.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    return res.status(404).json({ message: `Error to login. Call to support team` });
  }

  if (authenticatedUser(userName, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.Authorization = {
      accessToken,
      userName
    };
    return res.status(200).json({ message: `User successfully logged in` });
  } else {
    return res.status(404).json({ message: `Invalid Login. Check username and password` });
  }
});


// Add-update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let filteredBook = books[isbn]
  if (filteredBook) {
    let review = req.query.review;
    let userName = req.session.Authorization['userName'];
    if (review) {
      review = filteredBook['reviews'][userName];
      filteredBook = books[isbn];
    }
    return res.status(200).json({ message: `The review for the book with ISBN  ${isbn} has been added-updated` });
  }
  else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

// //Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const userName = req.session.Authorization['userName'];
  const filteredBook = books[isbn];
  if (!filteredBook) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
  if (filteredBook) {
    delete filteredBook.reviews[userName];
    return res.status(200).json({ message: `Review for ISBN ${isbn} by ${userName} deleted successfully` });
  } else {
    return res.status(404).json({ message: `Review not found for ISBN ${isbn} by ${userName}` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
