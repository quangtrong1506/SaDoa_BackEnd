import mongoose from 'mongoose';
import { responseErrors, responseSuccess } from '../../Common/helper.js';
import CategoryRepository from '../../Repositories/CategoryRepository.js';
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
            const { limit, page } = req.query;
            const data = await CategoryRepository.paginate(
                {},
                { limit: parseInt(limit) || 20, page: parseInt(page) || 1 }
            );
            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async store(req, res) {
        try {
            const c = await CategoryRepository.findOne({ title: req.body.title });
            if (c) return responseErrors(res, 401, 'Category already exist');
            const works = await CategoryRepository.store(req.body);
            return responseSuccess(res, works);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async get(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.isValidObjectId(id)) return responseErrors(res, 404, 'Your work does not exist');
            const data = await CategoryRepository.findById(id);
            if (!data) return responseErrors(res, 404, 'Your work does not exist');
            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.isValidObjectId(id)) return responseErrors(res, 404, 'Your work does not exist');
            const { title, category, media_id, site_id, thumbnail, images, type } = req.body;
            const data = {
                title,
                type,
                category: JSON.parse(category),
            };
            if (type === 0) {
                data.images = JSON.parse(images);
                data.thumbnail = thumbnail;
            } else if (type === 1) {
                data.media_id = media_id;
                data.site_id = site_id;
            }
            const work = await CategoryRepository.update(id, data);
            if (!data) return responseErrors(res, 404, 'Your work does not exist');
            return responseSuccess(res, work);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
}

export default new UserController();
