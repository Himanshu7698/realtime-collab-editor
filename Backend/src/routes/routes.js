const express = require('express');
const route = express.Router();
const { Registration } = require('../controllers/RegistrationContollers');
const { Login } = require('../controllers/LoginController');
const DocCtrl = require("../controllers/DocumentController");
const UserCtrl = require("../controllers/userController");
const auth = require("../middleware/UserAuth");

// Register
route.post('/register', Registration);

// Login
route.post('/login', Login);

// All-user
route.get("/users", auth, UserCtrl.getAllUsers);

// CRUD
route.post("/createDocument", auth, DocCtrl.createDocument);
route.get("/myDocument", auth, DocCtrl.getMyDocuments);
route.get("/myDocument/:id", auth, DocCtrl.viewDocument);
route.put("/myDocument/:id", auth, DocCtrl.updateDocument);
route.delete("/myDocument/:id", auth, DocCtrl.deleteDocument);

// Collaborators
route.post("/collaborators/create/:id", auth, DocCtrl.addCollaborator);
route.delete("/collaborators/:id", auth, DocCtrl.removeCollaborator);


module.exports = route;
