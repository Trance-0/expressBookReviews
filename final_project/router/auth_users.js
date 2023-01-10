//This contains the skeletal implementations for the routes which an authorized user can access.
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
     
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            let isbn = parseInt(req.params.isbn);
            let book=books[isbn]
            if(book){
              let review=book["reviews"];
              review[req.session.authorization['username']]=req.body.review;
              return res.send("Review added!");
            }else{
              return res.send("Unable to find book!");
            }
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
  // return res.status(300).json({ message: "Yet to be implemented" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
   //Write your code here
   if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            let isbn = parseInt(req.params.isbn);
            let book=books[isbn]
            if(book){
              const review=book["reviews"];
              const userName=req.session.authorization['username'];
              if(review){
              delete review[userName];
              }
              return res.send(`Review of ${userName} deleted.`);
            }else{
              return res.send("Unable to find book!");
            }
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
  // return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
