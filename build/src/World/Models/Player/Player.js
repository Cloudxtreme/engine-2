"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 10,
        minlength: 4,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
});
schema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};
schema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};
const Player = mongoose.model('Player', schema);
exports.Player = Player;
//# sourceMappingURL=Player.js.map