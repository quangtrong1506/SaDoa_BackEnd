import express from 'express';
import AlbumsController from '../../app/Http/Controllers/AlbumsController.js';
const albumsRouter = (app) => {
    const router = express.Router();
    router.get('/index', AlbumsController.index);
    router.get('/', AlbumsController.index);
    router.post('/', AlbumsController.store);
    router.get('/get-by-title/:title', AlbumsController.getByTitle);
    router.get('/:id', AlbumsController.get);
    router.put('/:id', AlbumsController.update);
    app.use('/albums', router);
};

export default albumsRouter;
