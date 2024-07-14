import express from "express";
import DocsController from "../../app/Http/Controllers/DocsController.js";
const albumsRouter = (app) => {
    const router = express.Router();
    router.get("/", DocsController.filter);
    router.post("/", DocsController.store);
    router.get("/:id", DocsController.getById);
    router.delete("/:id", DocsController.destroy);
    router.put("/:id", DocsController.update);
    app.use("/docs", router);
};

export default albumsRouter;
