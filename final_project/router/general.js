//This contains the skeletal implementations for the routes which a general user can access.
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  let book=books[isbn]
  if(book){
    return res.send(book);
  }else{
    return res.send("Unable to find book!");
  }
  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authorName = req.params.author;
  let result=[];
  for(let i=1;i<100;i++){
    book=books[i];
    if(book){
      if(book["author"]===authorName){
        result.push(books[i]);
      }
    }else{
      break;
    }
  }
  return res.send(result);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let titleName = req.params.title;
  let result=[];
  for(let i=1;i<100;i++){
    book=books[i];
    if(book){
      if(book["title"]===titleName){
        result.push(books[i]);
      }
    }else{
      break;
    }
  }
  return res.send(result);
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  let book=books[isbn];
  if(book){
    return res.send(book["reviews"]);
  }else{
    return res.send("Unable to find book!");
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
