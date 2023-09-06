//Rutas para productos
const express = require('express');
const router = express.Router();
const asistenteController = require('../controllers/asistenteController')


router.get('/menu',  asistenteController.obtenerMenuPrimero);




module.exports = router;