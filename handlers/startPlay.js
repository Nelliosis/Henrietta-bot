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

    //declare audio variables
    let track, stream;

    //report to log of queue length
    console.log(`[BERRY NOTE] Queue length: ${queueHandler.queueLength(guild)}`);
    console.log(`[BERRY NOTE] Queue isempty: ${queueHandler.queueIsEmpty(guild)}`);
    
    // check if queue is empty, if true, return end of queue and reset queue to 0;
    if (queueHandler.queueIsEmpty(guild)) {
        console.log('[BERRY NOTE] End of Queue.');
        await interaction.channel.send('[BERRY NOTE] You have reached the end of the queue.');
        queueHandler.clearQueue(guild);
        return;
    }
    // if queue has data, play.
    else if (queueHead.platform === 'sp') {
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
        console.log(`[BERRY TRANSITION] ${oldState.status} -> ${newState.status}`);
        if (oldState.status === 'buffering' && newState.status === 'playing') {
            //todo message
            console.log(`[BERRY OPERATION] Now Playing: ${queueHead.track}, requested by ${queueHead.user}`);
        }

        if (oldState.status === 'playing' && newState.status === 'idle') {
            //if queue still has data, dequeue, else return.
            if (!queueHandler.queueIsEmpty(guild)) {
                queueHandler.fromQueue(guild);
                this.startPlay(interaction);
            }
            else {
                this.startPlay(interaction);
            }
        }
    });

    //todo error handler


};

