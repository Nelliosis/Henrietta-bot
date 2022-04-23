function trackObjectifier(track, platform, requester) {
    let data;
    if (platform === 'sp') {
        //create time
        const minutes = Math.floor(track.durationInSec / 60);
        const seconds = track.durationInSec % 60;
        const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        //create the new object 
        data = {
            track: `${track.name} - ${track.artists[0].name}`,
            title: track.name,
            artist: track.artists[0].name,
            url: track.url,
            user: requester,
            thumbnail: track.thumbnail.url,
            duration: duration,
            platform: platform,
        };
    }
    else {
        // retrieve the first thumbnail
        const [thumb] = track.thumbnails; 

        //create the new object
        data = {
            track: track.title,
            title: track.title,
            artist: track.channel.name,
            url: track.url,
            user: requester,
            thumbnail: thumb.url,
            duration: track.durationRaw,
            platform: platform,
        };
    }
    return data;
}
module.exports = {trackObjectifier};