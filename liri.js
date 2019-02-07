require("dotenv").config();
var fs = require("fs");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var axios = require("axios");
var keys = require("./keys.js");
var bandsintown = require('bandsintown')(codingbootcamp);
var spotify = new Spotify(keys.spotify);
var liriArgument = process.argv[2];

switch(liriArgument) {
    case "spotify-this-song": spotifyThisSong(); break;
    case "movie-this": movieThis(); break;
    case "do-what-it-says": iWantItThatWay(); break;
    default: console.log("\r\n" + "Type one of the following commands after 'node.js': " + "\r\n" +
    "1. spotify-this-song 'any song name'" + "\r\n" +
    "2. movie-this 'any movie name'" + "\r\n" +
    "3. do-what-it-says" + "\r\n" + 
    "4. concert-this 'any artist/band name'" + "\r\n" +
    "Please make sure the movie or song name is in quotation marks if it is more than one word!")
};

// Bands in Town function
// var Events = new BandsInTownEvents();

// Events.setParams({
//     "app_id": "codingbootcamp",
//     "artists": process.argv[3]
// });

// Events.getEvents(function(events){
//     for (var i = 0; i< events.length; i++){
//         console.log(events[i].venue.city + ", " + events[i].venue.region);
//     }
// }, function (errors){
//     console.log(errors);
// })

// Spotify function
function spotifyThisSong(songName) {
    var songName = process.argv[3];
    if(!songName) {
        songName = "The Sign";
    }
    params = songName;
    spotify.search({type: "track", query: params},function(err, data){
        var songInfo = data.tracks.items;
        for (var i = 0; i < 5; i++) {
            if (songInfo[i] != undefined) {
                var spotifyResults = 
                "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                "Song: " + songInfo[i].name + "\r\n" +
                "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                "Preview URL: " + songInfo[i].preview_url + "\r\n" +
                "------------------" + i + "------------------" + "\r\n";
                console.log(spotifyResults);
            } else {
                console.log("Error: " + err);
                return;
            }
        } 
    });
};

// Movie function
function movieThis() {
    var movie = process.argv[3];
    if(!movie) {
        movie = "Mr. Nobody"
    }
    params = movie
    request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);
            var movieResults = 
            "------------------------------" + "\r\n" +
            "Title: " + movieObject.Title + "\r\n" +
            "Year: " + movieObject.Year + "\r\n" +
            "Imdb Rating: " + movieObject.imdbRating + "\r\n" +
            "Country: " + movieObject.Country + "\r\n" +
            "Language: " + movieObject.Language + "\r\n" +
            "Plot: " + movieObject.Plot + "\r\n" +
            "Actors: " + movieObject.Actors + "\r\n" +
            "Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\r\n" +
            "Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" +
            "------------------------------" + "\r\n";
            console.log(movieResults);
        } else {
            console.log("Error: " + error);
            return;
        }
    })
}

// Uses reads and writes module to access the random.txt file and do what is written
function iWantItThatWay() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if(!error) {
            iWantItThatWayResults = data.split(",");
            spotifyThisSong(iWantItThatWayResults[0], iWantItThatWay[1])
        } else {
            console.log ("An error occurred: " + error);
        }
    });
}