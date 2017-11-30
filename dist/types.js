"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DocumentNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = 'DocumentNotFound';
    }
}
exports.DocumentNotFound = DocumentNotFound;
var UpdateType;
(function (UpdateType) {
    UpdateType["get"] = "GET";
    UpdateType["put"] = "PUT";
    UpdateType["delete"] = "DELETE";
    UpdateType["check"] = "CHECK";
})(UpdateType = exports.UpdateType || (exports.UpdateType = {}));
