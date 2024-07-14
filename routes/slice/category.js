import express from 'express';
import CategoryController from '../../app/Http/Controllers/CategoryController.js';
const categoryRouter = (app) => {
    const router = express.Router();
    router.get('/index', CategoryController.index);
    router.get('/', CategoryController.index);
    router.post('/', CategoryController.store);
    router.get('/:id', CategoryController.get);
    router.put('/:id', CategoryController.update);
    app.use('/category', router);
};

export default categoryRouter;
