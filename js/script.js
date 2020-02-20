$(document).ready(function() {
    //--------------------------------------------------------------------------
    // GLOBAL FUNCTIONS AND MOOD SELECTIONS
    //---------------------------------------------------------------------------

    var finalMood = "";
    var moodArray = ["Happy", "Sad", "Calm", "Hyper", "Tired", "Energetic"];
    // remove the modal on click of launch button
    $(".launch-btn").on("click", function(event) {
        event.preventDefault();
        $(".modal").removeClass("is-active");
        $(".card").removeClass("is-hidden");
        getMood();
        setColor();
        getQuote();
        getPhotos();
        appendTime();
    });

    // get the mood from user input
    function getMood() {
        var selectedMood = $(".select option:selected")
            .text()
            .trim();
        if (selectedMood !== "I don't know, pick for me!") {
            finalMood = selectedMood;
        } else {
            finalMood = moodArray[Math.floor(Math.random() * moodArray.length)];
        }
    }

    // set color as relates to mood selection
    function setColor() {
        switch (finalMood) {
            case "Happy":
                $("html")
                    .removeClass()
                    .addClass("bg-ha");
                break;
            case "Sad":
                $("html")
                    .removeClass()
                    .addClass("bg-sa");
                break;
            case "Calm":
                $("html")
                    .removeClass()
                    .addClass("bg-ca");
                break;
            case "Hyper":
                $("html")
                    .removeClass()
                    .addClass("bg-hy");
                break;
            case "Tired":
                $("html")
                    .removeClass()
                    .addClass("bg-ti");
                break;
            case "Energetic":
                $("html")
                    .removeClass()
                    .addClass("bg-en");
        }
    }

    //--------------------------------------------------------------------------
    // WEATHER AND TIME FUNCTIONS
    //---------------------------------------------------------------------------
    var currDate = "";
    var currTime = "";

    // Capture selector for HTML area to hold current weather data  
    var $displayWeather = $("#display-weather");
    
    // Capture selector for HTML area to hold photos  
    var $displayPhoto = $("#display-photo");

    // This is my (JimG) weather API key.
    var APIKey = "7514abfe02ab6db7877685958ec119d7";

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
    var latitude = my_geolocation[0];
    var longitude = my_geolocation[1];
    console.log(
      "Your saved geolocation is: latitude ",
      latitude,
      "longitude ",
      longitude
    );
    getCurrentWeather(latitude, longitude);
  }

  //---------------------------------------------------------------------
  // functions to handle success or failure of getCurrentPosition method
  //---------------------------------------------------------------------

  function success(pos) {
    console.log(pos.coords);

    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;

    console.log(
      "Your geolocation is: latitude ",
      latitude,
      "longitude ",
      longitude
    );

    // save latitude and longitude in geolocation array
    my_geolocation.push(latitude);
    my_geolocation.push(longitude);

    // save geolocation array in local storage
    localStorage.setItem("MyGeoLocation", JSON.stringify(my_geolocation));

    // get current weather conditions at current geolocation
    getCurrentWeather(latitude, longitude);

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  }

  //---------------------------------------------------------------------
  // function to get current weather for specific latitude & longitude
  //---------------------------------------------------------------------

  function getCurrentWeather(lat, lon) {
    // set up the AJAX query URL

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?appid=" +
      APIKey +
      "&units=imperial&lat=" +
      lat +
      "&lon=" +
      lon;

    // AJAX call

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      var weatherIcon = $("<img>");

      weatherIcon.attr(
        "src",
        "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );

      var myDate = moment().format("dddd, MMM Do");
      var myTime = moment().format("h:mm a");
      currDate = $("<h1>").text(myDate);
      currTime = $("<h1>").text(myTime);

      currDate.append(weatherIcon);

    });
  }

       function appendTime() {
       $displayWeather.append(currDate);
       $displayWeather.append(currTime);
    }

    //--------------------------------------------------------------------------
    // QUOTE FUNCTIONS
    //---------------------------------------------------------------------------

    // quote section variables
    var quoteKey = "";

    // function to get quote
    function getQuote() {
        // parse user selection to searchable quote tags
        switch (finalMood) {
            case "Happy":
                quoteKey = "happiness";
                break;
            case "Sad":
                quoteKey = "alone";
                break;
            case "Calm":
                quoteKey = "nature";
                break;
            case "Hyper":
                quoteKey = "best";
                break;
            case "Tired":
                quoteKey = "good";
                break;
            case "Energetic":
                quoteKey = "life";
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
            var quotes = response.quotes.filter(
                quote => quote.body.length < 150
            );
            var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            // push the random quote onto the DOM
            var qBody = $("<p>");
            qBody.addClass("title").text(randomQuote.body);
            $(".quote-content").append(qBody);

            var qAuthor = $("<p>");
            qAuthor.addClass("subtitle").text(randomQuote.author);
            $(".quote-content").append(qAuthor);
        });
    }

    function getPhotos () {
    
        //debugger;

        var currentPhoto    = -1;
        var photoType       = "";
        var photoInfo       = [];       // You may request upto 80 photos per page
        var photosPerPage   = 80;
        var timerTime       = 10000;    // 10 second delay between photos

        // API key for Pexels:
        // 563492ad6f91700001000001bbb93d6089ee4731b7a0c2fa559ab484  

        // set photo search parameter based on mood.

        switch (finalMood) {
            case "Happy":
                photoType = "flowers";
                break;
            case "Sad":
                photoType = "sad";
                break;
            case "Calm":
                photoType = "landscape";
                break;
            case "Hyper":
                photoType = "fire";
                break;
            case "Tired":
                photoType = "sunset";
                break;
            case "Energetic":
                photoType = "sky";
        }
        
        // TESTING: override photoType
        //var photoType = "universe";
        // Some of the choices are:
        //  sunset, sky, mountains, sea, sad, night, light, desert, universe,
        //  forest, fire, beach, tree, trees, rain, earth, flowers, flower, clouds, smile

    /*  ---------------------------------------------------------------------------------------------------------------
            Whenever you are doing an API request make sure to show a prominent link to Pexels.
            You can use a text link (e.g. "Photos provided by Pexels") or a link with our logo (Download our logo in white or black).
            Always credit our photographers when possible (e.g. "Photo by John Doe on Pexels" with a link to the photo page on Pexels).
            Do not copy core functionality of Pexels.
            Do not abuse the API. The API is rate-limited to 200 requests per hour and 20,000 requests per month. (For higher limits contact us).

            If you want to get a random photo, you can use the "Curated photos" endpoint and set per_page to 1 and page to a random number between 1 and 1000 to get a beautiful random photo. You can do the same with popular searches if you want to get a random photo with a specific topic.

            We add at least one new photo per hour to our curated list so that you get a changing selection of trending photos. 
        -------------------------------------------------------------------------------------------------------------*/

        // set up the AJAX query URL

        var queryURL =
                "https://api.pexels.com/v1/search?query="
                + photoType
                + "&per_page="
                + photosPerPage
                + "&page=1";

        console.log("photo URL:", queryURL);

        // AJAX call

        $.ajax({
            url: queryURL,
            method: "GET",
            headers: {
                Authorization: "563492ad6f91700001000001bbb93d6089ee4731b7a0c2fa559ab484"
            }
        }).then(function (response) {
            console.log(response);

            for (let i = 0; i < 40; i++) {
                //console.log(response.photos[i].id,
                //    response.photos[i].photographer);
                if (response.photos[i].width > response.photos[i].height) {
                    // create new Photo object to hold photo data and save new Photo
                    // in array of photo information
                    var newPhoto = new Photo(response.photos[i].photographer,
                                                response.photos[i].src.small);
                    photoInfo.push(newPhoto);
                }
            }

            displayNextPhoto();
        })

        //-----------------------------------------------------------
        // start the countdown timer
        //-----------------------------------------------------------
        setTimer();


        //-----------------------------------------------------------
        // display next photo from array "photoInfo"
        //-----------------------------------------------------------
        function displayNextPhoto() {
            currentPhoto++;
            if (currentPhoto < photoInfo.length) {
                var foto = photoInfo[currentPhoto];
                console.log(foto.photographer);
                // clear out the area holding the current photo so the next one will replace it
                $displayPhoto.empty();
                var photoSpot = $("<img>");
                photoSpot.attr(
                    "src",
                    foto.photo
                );
                $displayPhoto.append(photoSpot);       
            } else {
                clearInterval(timerInterval);
            }
        }
        
        //-----------------------------------------------------------
        // function to set countdown timer 
        //-----------------------------------------------------------
        function setTimer() {
            console.log("start countdown"); 
            timerInterval = setInterval(displayNextPhoto, timerTime);
        }

        //-----------------------------------------------------------
        // Constructor function for Photo objects
        //-----------------------------------------------------------
        function Photo(fotographer, picture) {
            this.photographer = fotographer;
            this.photo        = picture;
        }
    }

    //--------------------------------------------------------------------------
    // SONG FUNCTIONS
    //---------------------------------------------------------------------------

    // Paring playlist to mood

// I. user clicks mood they get playlist linked to mood
    // A. need music player on HTML
        // i. next button
       // ii. previous button
    // B. create a function that grabs a specific playlist id and returns 10 songs
        // i. next funtion
            // - play next song on playlist
            // - TO DO: how to change src of audio element
            // - create a way to go to the next index
         // ii.  previous function
            // - play previous song on playlist
            // - create a way to go to the previous index
            // 
 // II.  When user clicks mood they should see arist and song         
     // A. Show artist
        // i.TO DO : find where atist exsist in object "may have to do another api call" 
        // ii.  
        // iii.
        // iv.
    // B.
        // i.
        // ii.  
        // iii.
        // iv.


APIKey = "ZTM0M2ZjNDAtY2Y1Ny00MjQ1LWIxYmEtMzAwY2FlNDU2ZGNj";

var playlists = {
  energetic: "pp.243995364",
  tired: "pp.201748658",
  happy: "pp.181321249",
  calm: "pp.191473986",
  hyper: "pp.283875163",
  sad: "pp.162612012",
};

function loadPlaylist(mood){
   console.info(typeof mood)
  if(typeof playlists[mood.toLowerCase()] !== "undefined"){
        let finalPlaylist = playlists[mood.toLowerCase()];
        singlePlaylist(finalPlaylist);
     } else{
            console.log("error; no such playlist")
        }
    }
    
    
function singlePlaylist(playlistId) {
  var queryURL = `http://api.napster.com/v2.2/playlists/${playlistId}/tracks?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10`;

  $.ajax({
    url: queryURL,

    method: "GET"
  }).then(function(response) {
    player.tracks = response.tracks;
    player.init();
    player.play();

  });
}

        let player = {
          tracks:[],
          currentIndex:0,
          init(){
              $("#display-area").append('<audio id="player" controls></audio>');
        
          },
          play(){
              $("#player").append(`<source src = "${this.tracks[this.currentIndex].previewURL}">`);
        
              document.querySelector('#player').play();
          }
        };

  
});

