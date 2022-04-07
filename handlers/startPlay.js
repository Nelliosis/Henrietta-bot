//external libraries
const play = require('play-dl');
const {
	AudioPlayerStatus,
    StreamType,
    NoSubscriberBehavior,
	createAudioPlayer,
	createAudioResource,
    getVoiceConnection,
} = require('@discordjs/voice');

//internal libraries
const queueHandler = require('./queueSystem');

module.exports.startPlay = async (interaction) => {
    
    //get necessary data
    const guild = interaction.guild.id;
    let connection = getVoiceConnection(interaction.guild.id);

    //get track data
    const queueHead = queueHandler.peekAtHead(guild);

    //get audio
    let track, stream;
    // if SP, get title, else, get link
    if (queueHead.platform === 'sp') {
        [track] = await play.search(queueHead.track, { limit: 1 });
        stream = await play.stream(track.url);
    }
    else {
        stream = await play.stream(queueHead.url);
    }

    //create player
    let resource, player;
    if (!resource && !player) {
        resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        });
        player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        });
    }

    // Play
    player.play(resource);
    connection.subscribe(player);

    //recursion & player state
    //copyright 28Goo
    player.on('stateChange', async (oldState, newState) => {
        console.log(`[BERRY TRANSITION] ${oldState.status} => ${newState.status}`);

        if (oldState.status === 'buffering' && newState.status === 'playing') {
            //todo message
        }

        if (oldState.status === 'playing' && newState.status === 'idle') {
            queueHandler.fromQueue(guild);
            this.startPlay(interaction);
        }
    });

    //todo error handler


};

