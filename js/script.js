$(document).ready(function() {
    //--------------------------------------------------------------------------
    // WEATHER AND TIME FUNCTIONS
    //---------------------------------------------------------------------------
    var currDate = "";
    var currTime = "";

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
                "http://openweathermap.org/img/w/" +
                    response.weather[0].icon +
                    ".png"
            );

            var myDate = moment().format("dddd, MMM Do");
            var myTime = moment().format("h:mm a");
            currDate = $("<h1>").text(myDate);
            currTime = $("<h1>").text(myTime);

            currDate.append(weatherIcon);
        });
    }
    function appendTime() {
        $displayArea.append(currDate);
        $displayArea.append(currTime);
    }
    //--------------------------------------------------------------------------
    // QUOTE FUNCTIONS
    //---------------------------------------------------------------------------

    // quote section variables
    var finalMood = "";
    var quoteKey = "";
    // remove the modal on click of launch button
    $(".launch-btn").on("click", function(event) {
        event.preventDefault();
        $(".modal").removeClass("is-active");
        getMood();
        getQuote();
        appendTime();
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
});
