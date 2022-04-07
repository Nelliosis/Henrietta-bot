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
    return queueMap.get(guild);
}

function toQueue(guild, track) {
    const guildQueue = queueMap.get(guild);
    guildQueue.tracks.enqueue(track);
    return;
}

function fromQueue(guild) {
    const guildQueue = queueMap.get(guild);
    guildQueue.tracks.dequeue();
    return;
}

function clearQueue(guild) {
    const guildQueue = queueMap.get(guild);
    guildQueue.tracks.destroy();
    return;
}

function peekAtHead(guild) {
    const guildQueue = queueMap.get(guild);
    let head = guildQueue.tracks.peek();
    return head;
}

module.exports = {
    makeQueue,
    retrieveQueue,
    toQueue,
    fromQueue,
    clearQueue,
    peekAtHead,
}