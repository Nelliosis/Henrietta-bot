// external library
const play = require('play-dl');
// internal library
const searchHelper = require('./searchHelper');

async function inputSearcher(input) {
    
    let helper = new searchHelper(input);

    // check if query or URL
    if (helper.isURL()) {
        //check if YT or SP
        let determiner = await play.validate(input);
        if (determiner == 'sp_track') {
            // if song is SP, parse the song into a query, search, and return
            let song = await helper.platformParser(determiner);
            let [query] = await play.search(song, {limit: 1});
            return play.stream(query.url);
        }
        else {
            // if YT video, return as is
            return play.stream(input);
        }
    }
    else {
        // search and return the first result
        let [query] = await play.search(input, {limit: 1});
        return play.stream(query.url);
    }

}
module.exports = {inputSearcher};