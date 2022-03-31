// external library
const play = require('play-dl');
// internal library
const searchHelper = require('./utilities/search-helper');

async function inputSearcher(input) {
    
    let sp = "spotify";
    let yt = "youtube";
    let helper = new searchHelper(input);

    //determine platform
   /* if (helper.whichPlatform() == yt) {
        // TODO
    }
    else {
        // TODO
    } */

    // check if query or URL
    if (helper.isURL()) {
        return play.stream(input);
    }
    else {
        let [query] = await play.search(input, {limit: 1});
        return play.stream(query.url);
    }

}
module.exports = {inputSearcher};