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
    appendTime();
    getMood();
    setColor();
    getQuote();
    getPhotos();
    loadPlaylist();
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
    getCurrentWeather(latitude, longitude);
  }

  //---------------------------------------------------------------------
  // functions to handle success or failure of getCurrentPosition method
  //---------------------------------------------------------------------

  function success(pos) {
    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;

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
      var myDate = moment().format("dddd, MMM Do");
      var myTime = moment().format("h:mm a");
      currDate = $("<h1>").text(myDate);
      currTime = $("<h1>").text(myTime);

      var wClass = "";
      var cloudy = ["802", "803", "804"];
      var storm = [
        "200",
        "201",
        "202",
        "210",
        "211",
        "212",
        "221",
        "230",
        "231",
        "232"
      ];
      var drizzle = [
        "300",
        "301",
        "302",
        "310",
        "311",
        "312",
        "313",
        "314",
        "321"
      ];
      var rain = [
        "500",
        "501",
        "502",
        "503",
        "504",
        "511",
        "520",
        "521",
        "522",
        "531"
      ];
      var snow = [
        "600",
        "601",
        "602",
        "611",
        "612",
        "613",
        "615",
        "616",
        "620",
        "621",
        "622"
      ];
      var atmosphere = ["701", "711", "721", "731", "741", "751", "761"];

      if (response.weather[0].id === 801) {
        wClass = "wi wi-day-cloudy";
      } else if (response.weather[0].id === 800) {
        wClass = "wi wi-day-sunny";
      } else if (jQuery.inArray("response.weather[0].id", cloudy)) {
        wClass = "wi wi-cloudy";
      } else if (jQuery.inArray("response.weather[0].id", storm)) {
        wClass = "wi wi-owm-230";
      } else if (jQuery.inArray("response.weather[0].id", drizzle)) {
        wClass = "wi wi-owm-301";
      } else if (jQuery.inArray("response.weather[0].id", rain)) {
        wClass = "wi wi-owm-302";
      } else if (jQuery.inArray("response.weather[0].id", snow)) {
        wClass = "wi wi-owm-600";
      } else if (jQuery.inArray("response.weather[0].id", atmosphere)) {
        wClass = "wi wi-owm-731";
      }

      var weatherIcon = $("<i>");
      weatherIcon.addClass(wClass);
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
      url: "https://favqs.com/api/quotes/?filter=" + quoteKey + "&type=tag",
      headers: {
        Authorization: 'Token token="c7feecf386bc6d6ca78ebf0002238dc8"'
      }
    }).then(function(response) {
      // pick a random quote from the returned results
      var quotes = response.quotes.filter(quote => quote.body.length < 150);
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

  //--------------------------------------------------------------------------
  // PHOTO FUNCTIONS
  //---------------------------------------------------------------------------

  function getPhotos() {
    //debugger;

    var currentPhoto = -1;
    var photoType = "";
    var photoInfo = []; // You may request upto 80 photos per page
    var photosPerPage = 80;
    var timerTime = 10000; // 10 second delay between photos

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
      "https://api.pexels.com/v1/search?query=" +
      photoType +
      "&per_page=" +
      photosPerPage +
      "&page=1";

    // AJAX call

    $.ajax({
      url: queryURL,
      method: "GET",
      headers: {
        Authorization:
          "563492ad6f91700001000001bbb93d6089ee4731b7a0c2fa559ab484"
      }
    }).then(function(response) {
      for (let i = 0; i < 40; i++) {
        //console.log(response.photos[i].id,
        //    response.photos[i].photographer);
        if (response.photos[i].width > response.photos[i].height) {
          // create new Photo object to hold photo data and save new Photo
          // in array of photo information
          var newPhoto = new Photo(
            response.photos[i].photographer,
            response.photos[i].src.medium
          );
          photoInfo.push(newPhoto);
        }
      }

      displayNextPhoto();
    });

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
        // clear out the area holding the current photo so the next one will replace it
        $displayPhoto.empty();
        var photoSpot = $("<img>");
        photoSpot.attr("src", foto.photo);
        $displayPhoto.append(photoSpot);
      } else {
        clearInterval(timerInterval);
      }
    }

    //-----------------------------------------------------------
    // function to set countdown timer
    //-----------------------------------------------------------
    function setTimer() {
      timerInterval = setInterval(displayNextPhoto, timerTime);
    }

    //-----------------------------------------------------------
    // Constructor function for Photo objects
    //-----------------------------------------------------------
    function Photo(fotographer, picture) {
      this.photographer = fotographer;
      this.photo = picture;
    }
  }

  //--------------------------------------------------------------------------
  // SONG FUNCTIONS
  //---------------------------------------------------------------------------

  APIKey = "ZTM0M2ZjNDAtY2Y1Ny00MjQ1LWIxYmEtMzAwY2FlNDU2ZGNj";

  var playlists = {
    energetic: "pp.243995364",
    tired: "pp.201748658",
    happy: "pp.181321249",
    calm: "pp.191473986",
    hyper: "pp.283875163",
    sad: "pp.162612012"
  };

  function loadPlaylist() {
    var moodLowercase = finalMood.toLocaleLowerCase();
    let finalPlaylist = playlists[moodLowercase];
    singlePlaylist(finalPlaylist);
  }

  function singlePlaylist(moodLowercase) {
    var queryURL = `http://api.napster.com/v2.2/playlists/${moodLowercase}/tracks?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10`;

    $.ajax({
      url: queryURL,

      method: "GET"
    }).then(function(response) {
      player.tracks = response.tracks;
      console.log(response.tracks);
      player.init();
      player.play();
    });
  }

  let player = {
    htmlPlayer:null,
    tracks: [], 
    currentIndex: Math.floor(Math.random() * 10),

    play() {
      let songTitle = this.tracks[this.currentIndex].name;
      let artist = this.tracks[this.currentIndex].artistName;
      console.log(songTitle);
      console.log(artist);

      let songHtml = `<p class="song-title">${songTitle}</p>`;
      songHtml += `<p class="artist-name">${artist}</p>`;

      $("#current-song").html(songHtml);

      
      
      // htmlPlayer.load();
     this.htmlPlayer.play();
    },
    next() {
        this.htmlPlayer.pause()
        this.currentIndex++;
      if (typeof this.tracks[this.currentIndex] === "undefined") {
        this.currentIndex = 0;
      }
      document.getElementById("currentTrackSource").src = this.tracks[this.currentIndex].previewURL;
      console.log(this.tracks[this.currentIndex].previewURL)
      this.htmlPlayer.load();
      this.play();
    },
    previous() {
        this.htmlPlayer.pause()
        if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.tracks.length - 1;
      }
      document.getElementById("currentTrackSource").src = this.tracks[this.currentIndex].previewURL;
      this.htmlPlayer.load();
      this.play();
    },

    init() {
      $("#song-content").append('<audio id="player" controls></audio>');
      this.htmlPlayer = document.getElementById("player");
      $("#player").append(
        `<source id="currentTrackSource" src="${
          this.tracks[this.currentIndex].previewURL
        }">`
      );
      $("#song-content").append('<div id="current-song"></div>');

      document
        .getElementById("next-button")
        .addEventListener("click", function() {
          player.next();
        });
      document
        .getElementById("previous-button")
        .addEventListener("click", function() {
          player.previous();
        });
    }
  };
});
