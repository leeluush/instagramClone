const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories.controllers');

router.get('/api/categories', categoryController.getCategories);
router.get('/api/categories/:categoryId', categoryController.getCategory);
router.post('/api/categories', categoryController.createCategory);
router.delete('/api/categories/:categoryId', categoryController.removeCategory);
router.put('/api/categories/:categoryId', categoryController.updateCategory);

module.exports = router;
