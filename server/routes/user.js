const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();
const userController = require('../controllers/userController');

//craete, find, update, delete
router.get('/main', userController.view);

router.get('/', userController.register);
router.post('/', userController.reguser);
router.get('/login', userController.login);
router.post('/login', userController.loguser);

router.post('/main', userController.find);
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);
router.get('/:id', userController.delete);
router.get('/viewuser/:id', userController.viewall);
router.get('/remove/:id', userController.remove);
router.post('/deleteall', userController.deleteall);

router.post('/logout', userController.logout);

module.exports = router;
