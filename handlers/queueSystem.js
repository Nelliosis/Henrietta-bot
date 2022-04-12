//internal library
let Queue = require('./utilities/Queue');

const queueMap = new Map();

function makeQueue(guild, connection) {
    const source = {
        voiceChannel: connection,
        tracks: new Queue(),
    }
    queueMap.set(guild, source);
    return queueMap;
}

function retrieveQueue(guild) {
    const guildQueue = queueMap.get(guild);
    let queue = guildQueue.tracks.retrieve();
    return queue;
}

function toQueue(guild, track) {
    const guildQueue = queueMap.get(guild);
    guildQueue.tracks.enqueue(track);
    return;
}

function fromQueue(guild) {
    const guildQueue = queueMap.get(guild);
    return guildQueue.tracks.dequeue();
}

function clearQueue(guild) {
    const guildQueue = queueMap.get(guild);
    guildQueue.tracks.destroy();
    return;
}

/*function peekAtHead(guild) {
    const guildQueue = queueMap.get(guild);
    let head = guildQueue.tracks.peek();
    return head;
}*/

function queueCurrent(guild) {
    const guildQueue = queueMap.get(guild);
    let current = guildQueue.tracks.current;
    return current;
}

function queueShuffle(guild) {
    const guildQueue = queueMap.get(guild);
    guildQueue.tracks.shuffle();
    return;
}

function queueIsEmpty(guild) {
    const guildQueue = queueMap.get(guild);
    if (guildQueue.tracks.isEmpty) return true;
    else return false;
}

function queueLength(guild) {
    const guildQueue = queueMap.get(guild); 
    return guildQueue.tracks.size;
}

module.exports = {
    makeQueue,
    retrieveQueue,
    toQueue,
    fromQueue,
    clearQueue,
    //peekAtHead,
    queueCurrent,
    queueShuffle,
    queueIsEmpty,
    queueLength,
}