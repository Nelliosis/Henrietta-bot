function trackObjectifier(track, platform, requester) {
    let data;
    if (platform == 'sp') {
        data = {
            track: `${track.name} - ${track.artists[0].name}`,
            url: track.url,
            platform,
        };
    }
    else {
        data = {
            track: track.title,
            url: track.url,
            requester,
            platform,
        };
    }
    return data;
}
module.exports = {trackObjectifier};