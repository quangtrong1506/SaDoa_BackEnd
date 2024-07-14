import express from 'express';
import WorksController from '../../app/Http/Controllers/WorksController.js';
const usersAdminRouter = (app) => {
    const router = express.Router();
    router.get('/index', WorksController.index);
    router.get('/', WorksController.index);
    router.post('/', WorksController.store);
    router.get('/:id', WorksController.get);
    router.get('/albums/:albums', WorksController.getByAlbums);
    router.get('/recommended/:id', WorksController.RecommendedWorks);
    router.put('/:id', WorksController.update);
    app.use('/works', router);
};

export default usersAdminRouter;
