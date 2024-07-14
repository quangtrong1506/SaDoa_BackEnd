import Docs from "../Models/Docs.js";
import BaseRepository from "./BaseRepository.js";

class DocsRepository extends BaseRepository {
    constructor() {
        super(Docs);
    }
}

export default new DocsRepository();
