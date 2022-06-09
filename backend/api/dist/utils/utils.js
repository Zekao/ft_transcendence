"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUuid = void 0;
const class_validator_1 = require("class-validator");
function isUuid(id) {
    const splited = id.split("-");
    for (const s in splited) {
        if (!(0, class_validator_1.isAlphanumeric)(s))
            return false;
    }
    return (id.length === 36 &&
        splited.length === 5 &&
        splited[0].length === 8 &&
        splited[1].length === 4 &&
        splited[2].length === 4 &&
        splited[3].length === 4 &&
        splited[4].length === 12);
}
exports.isUuid = isUuid;
//# sourceMappingURL=utils.js.map