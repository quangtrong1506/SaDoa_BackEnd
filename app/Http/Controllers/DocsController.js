import { responseErrors, responseSuccess } from "../../Common/helper.js";
import DocsRepository from "../../Repositories/DocsRepository.js";
import BaseController from "./BaseController.js";

function stringToSlug(str) {
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
        to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, "-")
        .replace(/-+/g, "-");

    return str;
}
class DocsController extends BaseController {
    base(req, res) {
        try {
            return responseSuccess(res, null);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async store(req, res) {
        try {
            const slug = stringToSlug(req.body.title);
            console.log(slug);
            let data = await DocsRepository.store({
                title: req.body.title,
                content: req.body.content,
                slug,
            });

            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async filter(req, res) {
        try {
            const { q, page } = req.query;
            const conditions = {};
            if (q) conditions.slug = new RegExp(stringToSlug(q), "gi");
            let data = await DocsRepository.findBy(
                { ...conditions },
                {
                    updated_at: -1,
                }
            );
            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            let data = await DocsRepository.findById(id);
            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async update(req, res) {
        try {
            const slug = stringToSlug(req.body.title);
            let data = await DocsRepository.update(req.params.id, {
                title: req.body.title,
                content: req.body.content,
                slug,
            });
            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async destroy(req, res) {
        try {
            let data = await DocsRepository.destroy(req.params.id);
            console.log(data);
            return responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
}

export default new DocsController();
