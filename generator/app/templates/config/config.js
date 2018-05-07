require('dotenv').config({path: '../.env'});
const path = require('path');

process.env.GAME_ROOT = path.dirname(__dirname);
