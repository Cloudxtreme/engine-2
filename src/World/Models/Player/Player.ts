import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

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

schema.methods.validatePassword = function(password: String) {
    // tslint:disable-next-line:no-invalid-this
    return bcrypt.compare(password, this.password);
};

// tslint:disable-next-line:no-function-expression
schema.statics.hashPassword = function(password: String) {
    return bcrypt.hash(password, 10);
};

// tslint:disable-next-line:variable-name
const Player = mongoose.model('Player', schema);

export {Player};
