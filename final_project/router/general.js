const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({
    message: "Unable to register user. No username or password provided",
  });
});

// Get the book list available in the shop
const getAllBooks = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};

public_users.get("/", async function (req, res) {
  try {
    const books = await getAllBooks();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Get book details based on ISBN
const getBookByISBN = async (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      resolve(book);
    }, 1000);
  });
};

public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Get book details based on author

const getBookByAuthor = async (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksArray = Object.values(books);

      const book = booksArray.filter((item) => item.author == author);

      resolve(book);
    }, 1000);
  });
};

public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    const book = await getBookByAuthor(author);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Get all books based on title
//
const getBookByTitle = async (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksArray = Object.values(books);

      const book = booksArray.filter((item) => item.title == title);

      resolve(book);
    }, 1000);
  });
};

public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  try {
    const book = await getBookByTitle(title);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
