"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editFileName = exports.imageFileFilter = void 0;
const path_1 = require("path");
const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error("Only image files are allowed!"), false);
    }
    callback(null, true);
};
exports.imageFileFilter = imageFileFilter;
const editFileName = (req, file, callback) => {
    const name = req.user.user_name;
    const fileExtName = (0, path_1.extname)(file.originalname);
    callback(null, `${name}${fileExtName}`);
};
exports.editFileName = editFileName;
//# sourceMappingURL=file-upload.utils.js.map