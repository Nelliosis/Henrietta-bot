function trackObjectifier(track, platform, requester) {
    let data;
    if (platform === 'sp') {
        data = {
            track: `${track.name} - ${track.artists[0].name}`,
            url: track.url,
            user: requester,
            platform: platform,
        };
    }
    else {
        data = {
            track: track.title,
            url: track.url,
            user: requester,
            platform: platform,
        };
    }
    return data;
}
module.exports = {trackObjectifier};