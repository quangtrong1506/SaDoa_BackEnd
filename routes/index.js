import Albums from './slice/albums.js';
import Category from './slice/category.js';
import Works from './slice/works.js';
const router = (app) => {
    // create
    Albums(app);
    Category(app);
    Works(app);
};
export default router;
