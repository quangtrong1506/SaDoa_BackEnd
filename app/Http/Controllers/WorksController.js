import mongoose from 'mongoose';
import { responseErrors, responseSuccess } from '../../Common/helper.js';
import WorksRepository from '../../Repositories/WorksRepository.js';
import BaseController from './BaseController.js';
class UserController extends BaseController {
    base(req, res) {
        try {
            return responseSuccess(res, null);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async index(req, res) {
        try {
            const { limit, page, type, sort, category, q } = req.query;
            const sortOption = {};
            if (sort == 1) {
                sortOption.created_at = -1;
            } else if (sort == 2) {
                sortOption.created_at = 1;
            } else if (sort == 3) {
                sortOption.title = -1;
            } else if (sort == 4) {
                sortOption.title = 1;
            }
            const categoryOption = {};
            if (category) {
                categoryOption.category = {
                    $elemMatch: {
                        $eq: category,
                    },
                };
            }
            const searchOption = {};
            if (q) {
                searchOption.title = new RegExp(q, 'gi');
            }

            let data = {};
            if (type != -1)
                data = await WorksRepository.paginate(
                    { type, ...categoryOption, ...searchOption },
                    { limit: parseInt(limit) || 20, page: parseInt(page) || 1, sort: sortOption }
                );
            else if (type == -1)
                data = await WorksRepository.paginate(
                    { ...categoryOption, ...searchOption },
                    { limit: parseInt(limit) || 20, page: parseInt(page) || 1, sort: sortOption }
                );
            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async store(req, res) {
        try {
            const { title, category, media_id, site_id, thumbnail, images, type, albums } = req.body;
            const data = {
                title,
                type,
                category: JSON.parse(category),
                thumbnail,
                albums,
            };
            if (type === 0) {
                data.images = JSON.parse(images);
            } else if (type === 1) {
                data.media_id = media_id;
                data.site_id = site_id;
            }
            const works = await WorksRepository.store(data);
            return responseSuccess(res, works);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async get(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.isValidObjectId(id)) return responseErrors(res, 404, 'Your work does not exist');
            const data = await WorksRepository.findById(id);
            if (!data) return responseErrors(res, 404, 'Your work does not exist');
            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async getByAlbums(req, res) {
        try {
            const { albums } = req.params;
            const data = await WorksRepository.findBy({ albums });
            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async RecommendedWorks(req, res) {
        try {
            const { id } = req.params;
            const { limit, page } = req.query;
            let result = {};
            const works = await WorksRepository.findById(id);
            if (!works)
                result = {
                    page: 1,
                    pages: 1,
                    limit: 0,
                    docs: [],
                };
            const promise1 = [];
            if (works.albums)
                promise1.push(
                    WorksRepository.findBy({
                        albums: works.albums,
                        type: works.type,
                    })
                );
            const all = await Promise.all(
                works.category.map((cat) =>
                    WorksRepository.findBy({
                        category: {
                            $elemMatch: {
                                $eq: cat,
                            },
                        },
                        type: works.type,
                    })
                )
            );
            const arrAll = [];
            all.forEach((arr) => {
                arr.forEach((w) => {
                    if (
                        w._id.toString() !== works._id.toString() &&
                        arrAll.findIndex((w2) => w2._id.toString() === w._id.toString()) === -1
                    ) {
                        arrAll.push(w);
                    }
                });
            });
            const p = parseInt(page) || 1,
                l = parseInt(limit) || 20;
            const pages = Math.ceil(arrAll.length / l);
            const docs = arrAll.slice((p - 1) * l, p * l);
            result = {
                pages,
                page: p,
                docs,
                limit: l,
            };
            return responseSuccess(res, result);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.isValidObjectId(id)) return responseErrors(res, 404, 'Your work does not exist');
            const { title, category, media_id, site_id, thumbnail, images, type, albums } = req.body;
            const data = {
                title,
                type,
                category: JSON.parse(category),
                thumbnail,
                albums,
            };
            if (type === 0) {
                data.images = JSON.parse(images);
            } else if (type === 1) {
                data.media_id = media_id;
                data.site_id = site_id;
            }
            const work = await WorksRepository.update(id, data);
            if (!data) return responseErrors(res, 404, 'Your work does not exist');
            return responseSuccess(res, work);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
}

export default new UserController();
