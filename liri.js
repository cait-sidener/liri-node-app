require("dotenv").config();
var fs = require("fs");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var axios = require("axios");
var keys = require("./keys.js");
var request = require('request');
var spotify = new Spotify(keys.spotify);
var liriArgument = process.argv[2];
var liriSubject = process.argv.slice(3).join(" ");

switch (liriArgument) {
    case "concert-this":
        concertThis(liriSubject);
        break;
    case "spotify-this-song":
        spotifyThisSong(liriSubject);
        break;
    case "movie-this":
        movieThis(liriSubject);
        break;
    case "do-what-it-says":
        iWantItThatWay();
        break;
    default:
        console.log("\r\n" + "Type one of the following commands after 'node.js': " + "\r\n" +
            "1. concert-this 'any artist/band name'" + "\r\n" +
            "2. spotify-this-song 'any song name'" + "\r\n" +
            "3. movie-this 'any movie name'" + "\r\n" +
            "4. do-what-it-says" + "\r\n" +
            "Please make sure the movie or song name is in quotation marks if it is more than one word!")
};

// Bands in Town function
function concertThis(subject) {
    var queryURL = "https://rest.bandsintown.com/artists/" + subject + "/events?app_id=codingbootcamp";

    axios.get(queryURL)
        .then(function (response) {
            if (response.status == 200) {
                let data = response.data[0];
                console.log("Venue name: " + data.venue.name +
                    "\nVenue location: " + data.venue.city +
                    "\nDate of Event: " + moment(data.datetime).format("MM/DD/YYYY"));
            }
        })
};

// Spotify function
function spotifyThisSong(songName) {
    if (!songName) {
        songName = "The Sign by Ace of Base";
    }
    spotify.search({
        type: "track",
        query: songName
    }, function (err, data) {
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
function movieThis(movie) {
    if (movie === '') {
        request("http://www.omdbapi.com/?t='mr+nobody'&y=&plot=short&apikey=trilogy", function (error, response, body) {
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
                console.log(movie);
                return;
            }
        });
    } else {
        request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
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
                console.log(movie);
                return;
            }
        })
    }
}

// Uses reads and writes module to access the random.txt file and do what is written
function iWantItThatWay() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            iWantItThatWayResults = data.split(",");
            spotifyThisSong(iWantItThatWayResults[1]);
        } else {
            console.log("An error occurred: " + error);
        }
    })
};