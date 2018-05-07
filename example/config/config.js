const path = require('path');
if (!process.env.GAME_ROOT) process.env.GAME_ROOT = path.dirname(__dirname);

require('dotenv').config({path: path.join(process.env.GAME_ROOT, '.env')});
