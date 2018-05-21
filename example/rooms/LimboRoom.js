const {RoomObjectType, compose} = require('lucid-engine');

let LimboRoom = () => ({
    key: 'limbo',
    attributes: {
        title: 'In Limbo',
        description: 'You see nothing but blackness.',
        shortDescription: 'You see nothing but blackness.'
    }
});

module.exports = compose(RoomObjectType, LimboRoom);
