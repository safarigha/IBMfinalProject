const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Register New user
public_users.post("/register", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (userName && password) {
    if (!isValid(userName)) {
      users.push({ "userName": userName, "password": password });
      return res.status(200).json({ message: `User successfully registred. Now you can login` });
    } else {
      return res.status(404).json({ message: `User already exists` });
    }
  }
  return res.status(404).json({ message: `Unable to register user` });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const bookList = JSON.stringify({ books }, null, 4);
  if (bookList) {
    return res.status(200).json({ books: bookList });
  } else {
    return res.status(404).json({ message: `Book list not found` });
  }
});

// Get the book list available in the shop - using async callback function and Promise
public_users.get('/async', async function (req, res) {
  try {
    const bookList = JSON.stringify({ books }, null, 4);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return res.status(200).json({ books: bookList });
  } catch (error) {
    return res.status(404).json({ message: `Book list not found` });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const filterByISBN = books[isbn];
    return res.status(200).json({ book: filterByISBN });
  } else {
    return res.status(404).json({ message: `The book with isbn ${isbn} not found` });
  }
});


// Get book details based on ISBN - using async callback function and Promise
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const filterByISBN = books[isbn];
    return res.status(200).json({ book: filterByISBN });
  } catch (error) {
    return res.status(404).json({ message: `The book with isbn ${isbn} not found` });
  }
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filterByAuthor = [];
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const bookList = books[isbn];
      if (bookList.author === author) {
        filterByAuthor.push(bookList);
      }
    }
  }
  if (filterByAuthor.length > 0) {
    return res.status(200).json({ books: filterByAuthor });
  } else {
    return res.status(404).json({ message: `The book with isbn '${author}' not found` });
  }
});


// Get book details based on author - using async callback function and Promise
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const filterByAuthor = [];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        const bookList = books[isbn];
        if (bookList.author === author) {
          filterByAuthor.push(bookList);
        }
      }
    }
    if (filterByAuthor.length > 0) {
      return res.status(200).json({ books: filterByAuthor });
    }
  } catch (error) {
    return res.status(404).json({ message: `The book with isbn '${author}' not found` });
  }

});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filterByTitle = [];
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const bookList = books[isbn];
      if (bookList.title === title) {
        filterByTitle.push(bookList);
      }
    }
  }
  if (filterByTitle.length > 0) {
    return res.status(200).json({ books: filterByTitle });
  } else {
    return res.status(404).json({ message: `The book with isbn '${title}' not found` });
  }
});

// Get all books based on title - using async callback function and Promise
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const filterByTitle = [];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        const bookList = books[isbn];
        if (bookList.title === title) {
          filterByTitle.push(bookList);
        }
      }
    }
    if (filterByTitle.length > 0) {
      return res.status(200).json({ books: filterByTitle });
    }
  } catch (error) {
    return res.status(404).json({ message: `The book with isbn '${title}' not found` });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    const bookReviews = books[isbn].reviews;
    return res.status(200).json({ reviews: bookReviews });
  } else {
    return res.status(404).json(`The reviews of book with isbn ${isbn} not found`);
  }
});

module.exports.general = public_users;
