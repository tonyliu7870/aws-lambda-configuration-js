"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DocumentNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = 'DocumentNotFound';
    }
}
exports.DocumentNotFound = DocumentNotFound;
var Mode;
(function (Mode) {
    Mode["Direct"] = "direct";
    Mode["Core"] = "core";
    Mode["Cache"] = "cache";
})(Mode = exports.Mode || (exports.Mode = {}));
var UpdateType;
(function (UpdateType) {
    UpdateType["Get"] = "GET";
    UpdateType["Put"] = "PUT";
    UpdateType["Delete"] = "DELETE";
    UpdateType["Check"] = "CHECK";
})(UpdateType = exports.UpdateType || (exports.UpdateType = {}));
