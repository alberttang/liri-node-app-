var fs = require("fs");
var key = require("./keys.js");
var Twitter = require('twitter');
var axios = require("axios");
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: key.client_id,
    secret: key.client_secret
  });

//twitter keys
var twitConKey = key.consumer_key;
var twitConSecret = key.consumer_secret;
var twitAccKey = key.access_token_key;
var twitAccSecret = key.access_token_secret;

var client = new Twitter({
    consumer_key: twitConKey,
    consumer_secret: twitConSecret,
    access_token_key: twitAccKey,
    access_token_secret: twitAccSecret
  });

var nodeArgs = process.argv[2];
var userInput = process.argv;
var usrSong = "";


var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=40e9cece"

runLiri();

function runLiri(){

if (nodeArgs === "my-tweets"){
    // console.log("last 20 tweets and when they were created");
    
    var params = {
        screen_name: 'AlbertT4ng',
        count: 20
};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (error) {
        console.log(error);
      }
       for(i=0; i<tweets.length; i++){
      console.log(tweets[i].created_at +" "+ tweets[i].text)
    //   console.log(tweets[1].created_at +" "+ tweets[1].text)
       };    
    });



} else if (nodeArgs === "spotify-this-song"){
    //find song based on var userInput
    //If no song is provided then your program will default to "The Sign" by Ace of Base.

    for (var i = 3; i < userInput.length; i++) {     
          usrSong = usrSong + userInput[i] + " ";
        }
    if(usrSong === ""){
        usrSong = "The Sign";
    };

    spotify.search({ type: 'track', query: usrSong,limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("Artist: "+ data.tracks.items[0].artists[0].name);
        console.log("Song: "+ data.tracks.items[0].name); 
        console.log("Preview Link: "+ data.tracks.items[0].external_urls.spotify);         
        console.log("Album: "+ data.tracks.items[0].album.name); 
      });
    // console.log("Artist");
    // console.log("The song's name");
    // console.log("A preview link of the song from Spotify");
    // console.log("The album that the song is from");
} else if (nodeArgs === "movie-this"){
        //find movie based on var userInput
        //if no movie default to Mr. Nobody
        var movieName = "";
        for (var i = 3; i < userInput.length; i++) {     
              movieName = movieName + userInput[i] + " ";
            }
        if(movieName === ""){
            movieName = "Mr.Nobody";
        };

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece"
        console.log(queryUrl);
        axios.get(queryUrl)
        .then(function(response){
            console.log("Title: " + response.data.Title);
            console.log("Year: "+response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: "+response.data.Ratings[1].Value);
            console.log("Country: "+response.data.Country);
            console.log("Language: "+response.data.Language);
            console.log("Plot: "+response.data.Plot);
            console.log("Actors: "+response.data.Actors);
            
        
        })
        .catch(function(err){
            console.log(err);
        })
} else if (nodeArgs === "do-what-it-says"){
    fs.readFile("./random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
      
        // Break the string down by comma separation and store the contents into the output array.
        var output = data.split(",");
        nodeArgs = output[0];
        usrSong = output[1];
        runLiri()
      });
    
}
};


