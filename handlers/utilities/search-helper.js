const play = require('play-dl');

class searchHelper {
    constructor(input) {
        this.input = input;
    }
    async platformParser(platform) {
        if (platform == 'sp_track') {
            let track = await play.spotify(this.input);
            let trackInfo = `${track.name} - ${track.artists[0].name}`;
            return trackInfo;
        }
    }
    isURL() {
        if (this.input.startsWith("https://") || this.input.startsWith("http://")) {
            return true;
        }
        else {
            return false;
        }
    }
}
module.exports = searchHelper;