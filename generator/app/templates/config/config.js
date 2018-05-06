require('dotenv').config({path: '../.env'});
const path = require('path');

console.log(path.dirname(require.main.filename))
