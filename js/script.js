// function buildQueryURL() {




// var queryURL = "http://api.napster.com/v2.2/genres/g.115/stations?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4"

//  APIKey = "ZTM0M2ZjNDAtY2Y1Ny00MjQ1LWIxYmEtMzAwY2FlNDU2ZGNj"


// queryParams.q = $("#search-term")

// }

var playlists= {
    energetic: "pp.243995364",
    sleepy: "pp.201748658",
    happy: "pp.181321249",
    calm:"pp.191473986",
    hyper: "pp.283875163",
    sad: "pp.162612012",
};




function getMoodPlaylist(tagId){

   //  returns all playlist by mood(chill)
   // http://api.napster.com/v2.2/tags/tag.152196523/playlists?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4



//  returns a playlist by playlist ID(eletronic Chill playlist)
    // http://api.napster.com/v2.2/playlists/pp.237239631/tracks?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=5


    $.ajax({
        url:`http://api.napster.com/v2.2/tags/${tagId}/playlists?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4`,
        
        method:"GET"
    })
    .then(function(response) {
        console.log(response)

        var playlistId = response.playlists[7].id;
        console.log(playlistId)

        singlePlaylist(playlistId)

    })

}
// getMoodPlaylist("tag.152196437")

function singlePlaylist(playlistId) {

    var queryURL = `http://api.napster.com/v2.2/playlists/${playlistId}/tracks?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10`

    $.ajax({
        url: queryURL,
        
        method:"GET"
    })
    .then(function(response) {
        console.log(response)

        

    })

   

   
}
singlePlaylist(playlists["sleepy"])
console.log(singlePlaylist)


   $("audio").attr("src", "https://listen.hs.llnwd.net/g3/2/6/2/5/2/1329325262.mp3");
   
//    <source src="https://api.napster.com/v2.2/tracks/tra.257425041" type="audio/mpeg">
//   Your browser does not support the audio tag.


$(document).ready(function () {

    // Capture selector for HTML area to hold current weather data  
    var $displayArea = $("#display-area");

    // This is my (JimG) API key.
    var APIKey = "7514abfe02ab6db7877685958ec119d7";

    // testing ...
    //localStorage.removeItem("MyGeoLocation");

    //---------------------------------------------------------------------------
    // get geolocation (latitude & longitude) from local storage if it exists,
    // otherwise get geographic location using navigator function.
    //---------------------------------------------------------------------------

    var data = localStorage.getItem("MyGeoLocation");

    if (!data) {
        // create empty array to hold geolocation
        var my_geolocation = [];
        // get current geolocation (latitude & longitude)
        navigator.geolocation.getCurrentPosition(success, error);

    } else {
        var my_geolocation = JSON.parse(data);
        var latitude  = my_geolocation[0];
        var longitude = my_geolocation[1];
        console.log("Your saved geolocation is: latitude ", latitude, "longitude ", longitude);
        getCurrentWeather(latitude, longitude);
    }


    //---------------------------------------------------------------------
    // functions to handle success or failure of getCurrentPosition method
    //---------------------------------------------------------------------

    function success(pos) {

        console.log(pos.coords);

        var latitude = pos.coords.latitude;
        var longitude = pos.coords.longitude;

        console.log("Your geolocation is: latitude ", latitude, "longitude ", longitude);

        // save latitude and longitude in geolocation array
        my_geolocation.push(latitude);
        my_geolocation.push(longitude);

        // save geolocation array in local storage
        localStorage.setItem("MyGeoLocation", JSON.stringify(my_geolocation));

        // get current weather conditions at current geolocation
        getCurrentWeather(latitude, longitude);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }


    //---------------------------------------------------------------------
    // function to get current weather for specific latitude & longitude 
    //---------------------------------------------------------------------

    function getCurrentWeather(lat, lon) {

        // set up the AJAX query URL

        var queryURL =
            "https://api.openweathermap.org/data/2.5/weather?appid=" +
            APIKey +
            "&units=imperial&lat=" + lat + "&lon=" + lon;

        // AJAX call

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var weatherIcon = $("<img>");

            weatherIcon.attr(
                "src",
                "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
            );

            //var date = moment().format("l");
            //var datetime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
            var myDate = moment().format("dddd, MMM Do");
            var myTime = moment().format("h:mm a");
            //var banner   = $("<p>");
            var currDate = $("<p>").text(myDate);
            var currTime = $("<p>").text(myTime);
            //currTime.attr("text-align", "center");
            //currDateTime.attr("fontsize", "2em");

            //banner.append(currDate);
            //banner.append(currTime);
            currDate.append(weatherIcon);

            //$displayArea.append(banner);
            $displayArea.append(currDate);
            $displayArea.append(currTime);
        })

    }


    // quote section variables
    var finalMood = "";
    var quoteKey = "";
    // remove the modal on click of launch button
    $(".launch-btn").on("click", function(event) {
        event.preventDefault();
        $(".modal").removeClass("is-active");
        getMood();
        getQuote();
    });

    // remove the modal on click of X
    $(".modal-close").on("click", function(event) {
        event.preventDefault();
        $(".modal").removeClass("is-active");
    });

    // get the mood from user input
    function getMood() {
        var selectedMood = $(".select option:selected")
            .text()
            .trim();
        if (selectedMood !== "I don't know, pick for me!") {
            finalMood = selectedMood;
        } else {
            console.log("will be random mood");
        }
    }
    // function to get quote
    function getQuote() {
        // parse user selection to searchable quote tags
        switch (finalMood) {
            case "Happy":
                quoteKey = "happiness";
                break;
            case "Sad":
                quoteKey = "sad";
                break;
            case "Calm":
                quoteKey = "peace";
                break;
            case "Hyper":
                quoteKey = "imagination";
                break;
            case "Tired":
                quoteKey = "simplicity";
                break;
            case "Energetic":
                quoteKey = "funny";
        }

        // quote AJAX call
        $.ajax({
            type: "GET",
            url:
                "https://favqs.com/api/quotes/?filter=" +
                quoteKey +
                "&type=tag",
            headers: {
                Authorization: 'Token token="c7feecf386bc6d6ca78ebf0002238dc8"'
            }
        }).then(function(response) {
            // pick a random quote from the returned results
            var randomQuote =
                response.quotes[
                    Math.floor(Math.random() * response.quotes.length)
                ];
            // push the random quote onto the DOM
            var qBody = $("<p>");
            qBody.addClass("title").text(randomQuote.body);
            $(".card-content").append(qBody);

            var qAuthor = $("<p>");
            qAuthor.addClass("subtitle").text(randomQuote.author);
            $(".card-content").append(qAuthor);
        });
    }
});
