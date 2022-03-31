class searchHelper {
    constructor(input) {
        this.input = input;
    }
    whichPlatform() {
        let sp = "spotify";
        let yt = "youtube";
        if (this.input.includes("youtube")) {
            return yt;
        }
        else {
            return sp;
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