// internal library
const hex = require('./hex-values.json'); // hex values property of 28Goo

function NowPlaying(embed, head) {

    if (head.platform === 'sp') {
        return embed
            .setColor(hex.default)
            .setTitle('Now Playing')
            .setDescription(`Track requested by: ${head.user}`)
            .addFields(
                { name: 'Title:', value: `[${head.title}](${head.url})`, inline: false },
                { name: 'By:', value: `${head.artist}`, inline: true },
                { name: 'Duration:', value: `${head.duration}`, inline: true },
                { name: 'Platform:', value: 'Spotify', inline: true },
            )
            .setImage(head.thumbnail)
    }
    else {
        return embed
            .setColor(hex.default)
            .setTitle('Now Playing')
            .setDescription(`Track requested by: ${head.user}`)
            .addFields(
                { name: 'Title:', value: `[${head.track}](${head.url})`, inline: false },
                { name: 'By:', value: `${head.artist}`, inline: true },
                { name: 'Duration:', value: `${head.duration}`, inline: true },
                { name: 'Platform:', value: 'YouTube', inline: true },
            )
            .setImage(head.thumbnail)
    }

}

function QueueEmpty(embed) {
    return embed
        .setTitle('Operational Note.')
        .setDescription('The queue is empty.')
        .setColor(hex.note);
}

function QueueBig(embed, user) {
    return embed
        .setTitle('Operation Failed.')
        .setDescription('The number you entered is bigger than the queue.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .setColor(hex.note);
}

function QueuePrinter(embed, currentSong, queueString, page, totalPages, user) {
    return embed
        .setTitle('The Queue.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .setDescription(
            `**Currently Playing**\n` +
            (currentSong ? `Title: *${currentSong.title}*\nDuration: \`[${currentSong.duration}]\`\nRequester: ${currentSong.user}` : "None") +
            `\n\n**Queue**\n${queueString}`
        )
        .setFooter({
            text: `Page ${page + 1} of ${totalPages}`
        })
        .setColor(hex.note);
    }

function InvalidPage(embed, total) {
    return embed
        .setTitle('Operation Failed.')
        .setDescription(`Invalid number. There are only ${total} pages of this queue.`)
        .setColor(hex.error);
}

function YTTrack(embed, track, user, time) {
    return embed
        .setColor(hex.default)
        .setTitle('Enqueued.')
        .setDescription('Operation Successful.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .addFields(
            { name: 'Title:', value: `[${track.title}](${track.url})`, inline: false },
            { name: 'Type:', value: 'YouTube Track', inline: true },
        )
        .setFooter({
            text: `Query parsed in ${time} ms.`,
        });
}


function YTPlaylist(embed, playlist, user, time) {
    return embed
        .setColor(hex.default)
        .setTitle('YouTube playlist found.')
        .setDescription('Operation Successful.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .addFields(
            { name: 'Title:', value: `[${playlist.title}](${playlist.url})`, inline: false },
            { name: 'Owner:', value: `[${playlist.channel.name}](${playlist.channel.url})`, inline: true },
            { name: 'Total Tracks:', value: `${playlist.videoCount}`, inline: true },
            { name: 'Type:', value: 'YouTube Playlist', inline: true },
        )
        .setImage(playlist.thumbnail.url)
        .setFooter({
            text: `Query parsed in ${time} ms.`,
        });
}

function SPTrack(embed, track, user, time) {
    return embed
        .setColor(hex.spotify)
        .setTitle('Enqueued.')
        .setDescription('Operation Successful.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .addFields(
            { name: 'Title:', value: `[${track.name}](${track.url})`, inline: true },
            { name: 'Type:', value: 'Spotify Track', inline: true },
        )
        .setFooter({
            text: `Query parsed in ${time} ms.`,
        });
}

function SPPlaylist(embed, playlist, user, time) {
    return embed
        .setColor(hex.spotify)
        .setTitle('Enqueued.')
        .setDescription('Operation Successful.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .addFields(
            { name: 'Title:', value: `[${playlist.name}](${playlist.url})`, inline: false },
            { name: 'Owner:', value: `[${playlist.owner.name}](${playlist.owner.url})`, inline: true },
            { name: 'Total Tracks:', value: `${playlist.total_tracks}`, inline: true },
            { name: 'Type:', value: 'Spotify Playlist', inline: true },
        )
        .setImage(playlist.thumbnail.url)
        .setFooter({
            text: `Query parsed in ${time} ms.`,
        });
}

function SPAlbum(embed, album, user, time) {
    return embed
        .setColor(hex.spotify)
        .setTitle('Enqueued.')
        .setDescription('Operation Successful.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .addFields(
            { name: 'Title:', value: `[${album.name}](${album.url})`, inline: false },
            { name: 'Artist:', value: `[${album.artists[0].name}](${aalbum.artists[0].url})`, inline: true },
            { name: 'Total Tracks:', value: `${album.total_tracks}`, inline: true },
            { name: 'Type:', value: 'Spotify Album', inline: true },
        )
        .setImage(album.thumbnail.url)
        .setFooter({
            text: `Query parsed in ${time} ms.`,
        });
}

function BotNotConnected(embed, user) {
    return embed
        .setTitle('Operation Failed.')
        .setDescription(`${user.username}, I am not connected to any voice channel.`)
        .setThumbnail(user.displayAvatarURL())
        .setColor(hex.error);
}

function UserNotConnected(embed, user) {
    return embed
        .setTitle('Operation Failed.')
        .setDescription(`${user.username}, connect to a channel first.`)
        .setThumbnail(user.displayAvatarURL())
        .setColor(hex.error);
}

function Skip(embed, user) {
    return embed
        .setTitle('Operation Success.')
        .setDescription('Track(s) skipped.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .setColor(hex.skip);
}

function Stop(embed, user) {
    return embed
        .setTitle('Operation Success.')
        .setDescription('Music is stopped and queue is destroyed.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .setColor(hex.clear);
}

function Resume(embed, user) {
    return embed
        .setTitle('Operation Success.')
        .setDescription('Music is resumed.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .setColor(hex.default);
}

function Pause(embed, user) {
    return embed
        .setTitle('Operation Success.')
        .setDescription('Music is paused.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .setColor(hex.pause);
}

function Disconnect(embed, user) {
    return embed
        .setTitle('Operation Success.')
        .setDescription('Disconnected.')
        .setAuthor({
            name: `${user.username}`,
            iconURL: `${user.displayAvatarURL()}`,
        })
        .setColor(hex.default);
}

module.exports = {
    NowPlaying,
    QueueEmpty,
    QueueBig,
    QueuePrinter,
    InvalidPage,
    YTTrack,
    YTPlaylist,
    SPTrack,
    SPPlaylist,
    SPAlbum,
    BotNotConnected,
    UserNotConnected,
    Skip,
    Stop,
    Resume,
    Pause,
    Disconnect,
}
