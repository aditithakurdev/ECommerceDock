import { Router } from 'express';
import categoryController from '../controller/categoryController/categoryController';
const router = Router();

// Create a new category
router.post('/', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get a single category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category
router.put('/:id', categoryController.updateCategory);

// Soft delete a category
router.delete('/:id', categoryController.deleteCategory);

export default router;
