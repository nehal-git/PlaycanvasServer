
module.exports = class Player{
    constructor(spawned,room, username, position, rotation) {
        this.spawned = spawned;
        this.room = room;
        this.username = username;
        this.id = "";
        this.position = position;
        this.rotation = rotation;
    }
}