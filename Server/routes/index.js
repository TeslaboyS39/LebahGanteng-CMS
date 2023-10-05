const express = require('express');
const router = express.Router();
const Controller = require('../controllers');
const authentication = require('../middlewares/authentication');
const authorizationUpdate = require('../middlewares/authorizationUpdate');
const authorizationStatus = require('../middlewares/authorizationStatus');
const errorHandler = require('../middlewares/errorHandlers');

router.get('/', function(req, res) {
    res.status(200).json({ message: 'Hello World'})
})

router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.post('/google-login', Controller.googleLogin);

// middleware
router.use(authentication); //proses ini wajib dilewati

router.get('/movies', Controller.showAllMovies);
router.post('/movies', Controller.addMovie);
router.get('/movies/:id', Controller.showOneMovie);
router.get('/genres', Controller.showAllGenres);

router.get('/histories', Controller.showAllHistories)

router.put('/movies/:id', authorizationUpdate, Controller.updateMovie)
router.patch('/movies/:id', authorizationStatus, Controller.updateStatus)

router.delete('/movies/:id', authorizationStatus, Controller.deleteOneMovie);

router.use(errorHandler);

module.exports = router;