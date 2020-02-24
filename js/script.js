$(document).ready(function() {
    //--------------------------------------------------------------------------
    // GLOBAL FUNCTIONS AND MOOD SELECTIONS
    //---------------------------------------------------------------------------

    // global arrays
    var finalMood = "";
    var moodArray = ["Happy", "Sad", "Calm", "Hyper", "Tired", "Energetic"];
    var wClass = "";
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
        getArticle();
        addLink();
    });

    // get the mood from user input
    function getMood() {
        var selectedMood = $(".select option:selected")
            .text()
            .trim();

        if ($("input[name=question]:checked", ".control").val() === "no") {
            if (selectedMood !== "I don't know, pick for me!") {
                switch (selectedMood) {
                    case "Happy":
                        finalMood = "Sad";
                        break;
                    case "Sad":
                        finalMood = "Happy";
                        break;
                    case "Calm":
                        finalMood = "Hyper";
                        break;
                    case "Hyper":
                        finalMood = "Calm";
                        break;
                    case "Tired":
                        finalMood = "Energetic";
                        break;
                    case "Energetic":
                        finalMood = "Tired";
                        break;
                }
            } else {
                finalMood =
                    moodArray[Math.floor(Math.random() * moodArray.length)];
            }
        } else if (
            $("input[name=question]:checked", ".control").val() ===
            "weather-yes"
        ) {
            switch (wClass) {
                case "wi wi-day-cloudy":
                    finalMood = "Calm";
                    break;
                case "wi wi-day-sunny":
                    finalMood = "Happy";
                    break;
                case "wi wi-cloudy":
                    finalMood = "Tired";
                    break;
                case "wi wi-thunderstorm":
                    finalMood = "Tired";
                    break;
                case "wi wi-showers":
                    finalMood = "Calm";
                    break;
                case "wi wi-rain":
                    finalMood = "Calm";
                    break;
                case "wi wi-snow":
                    finalMood = "Sad";
                    break;
                case "wi wi-sandstorm":
                    finalMood = "Hyper";
                    break;
                case "wi wi-night-alt-cloudy":
                    finalMood = "Tired";
                    break;
                case "wi wi-night-clear":
                    finalMood = "Tired";
                    break;
            }
        } else if (
            $("input[name=question]:checked", ".control").val() === "time-yes"
        ) {
            if (moment().format("H") >= 0 && moment().format("H") < 7) {
                finalMood = "Tired";
            } else if (moment().format("H") >= 7 && moment().format("H") < 12) {
                finalMood = "Energetic";
            } else if (
                moment().format("H") >= 12 &&
                moment().format("H") < 17
            ) {
                finalMood = "Happy";
            } else if (
                moment().format("H") >= 17 &&
                moment().format("H") < 21
            ) {
                finalMood = "Calm";
            } else if (
                moment().format("H") >= 21 &&
                moment().format("H") < 24
            ) {
                finalMood = "Tired";
            }
        } else {
            if (selectedMood !== "I don't know, pick for me!") {
                finalMood = selectedMood;
            } else {
                finalMood =
                    moodArray[Math.floor(Math.random() * moodArray.length)];
            }
        }
    }

    // set color as relates to mood selection
    function setColor() {
        switch (finalMood) {
            case "Happy":
                $("html")
                    .removeClass()
                    .addClass("bg-ha");
                $(".card")
                    .removeClass(
                        "card-ha card-sa card-ca card-hy card-ti card-en"
                    )
                    .addClass("card-ha");
                break;
            case "Sad":
                $("html")
                    .removeClass()
                    .addClass("bg-sa");
                $(".card")
                    .removeClass(
                        "card-ha card-sa card-ca card-hy card-ti card-en"
                    )
                    .addClass("card-sa");
                break;
            case "Calm":
                $("html")
                    .removeClass()
                    .addClass("bg-ca");
                $(".card")
                    .removeClass(
                        "card-ha card-sa card-ca card-hy card-ti card-en"
                    )
                    .addClass("card-ca");
                break;
            case "Hyper":
                $("html")
                    .removeClass()
                    .addClass("bg-hy");
                $(".card")
                    .removeClass(
                        "card-ha card-sa card-ca card-hy card-ti card-en"
                    )
                    .addClass("card-hy");
                break;
            case "Tired":
                $("html")
                    .removeClass()
                    .addClass("bg-ti");
                $(".card")
                    .removeClass(
                        "card-ha card-sa card-ca card-hy card-ti card-en"
                    )
                    .addClass("card-ti");
                break;
            case "Energetic":
                $("html")
                    .removeClass()
                    .addClass("bg-en");
                $(".card")
                    .removeClass(
                        "card-ha card-sa card-ca card-hy card-ti card-en"
                    )
                    .addClass("card-en");
        }
    }

    // add link to return to modal
    function addLink() {
        var modalLink = $("<a>");
        modalLink
            .addClass("subtitle")
            .text("Current Mood: " + finalMood)
            .append("<br />" + "Don't like this mood? Pick another here!");
        $("#bottom-link").append(modalLink);
    }

    $("#bottom-link").on("click", function(event) {
        event.preventDefault;
        $(".card").removeClass(
            "is-active card-ha card-sa card-ca card-hy card-ti card-en"
        );
        $(".modal").removeClass("is-hidden");
        $(".card").addClass("is-hidden");
        $(".modal").addClass("is-active");
        $("h1").remove();
        $("i").remove();
        $("p").remove();
        $("img").remove();
        $("a").remove();
        $("audio").remove();
        $("html").removeClass();
    });

    //--------------------------------------------------------------------------
    // WEATHER AND TIME FUNCTIONS - OpenWeatherMap API
    //---------------------------------------------------------------------------
    var currDate = "";
    var currTime = "";

    // Capture selector for HTML area to hold current weather data
    var $displayWeather = $("#display-weather");

    // This is my (JimG) weather API key.
    var weatherAPIKey = "7514abfe02ab6db7877685958ec119d7";

    //---------------------------------------------------------------------------
    // get geolocation (latitude & longitude) from local storage if it exists,
    // otherwise get geographic location using navigator function.
    //---------------------------------------------------------------------------

    var data = localStorage.getItem("MyGeoLocation");

    if (!data) {
        // create empty array to hold geolocation
        var my_geolocation = [];
        // get current geolocation (latitude & longitude)
        navigator.geolocation.getCurrentPosition(success);
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
    }

    //---------------------------------------------------------------------
    // function to get current weather for specific latitude & longitude
    //---------------------------------------------------------------------

    function getCurrentWeather(lat, lon) {
        // set up the AJAX query URL

        var queryURL =
            "https://api.openweathermap.org/data/2.5/weather?appid=" +
            weatherAPIKey +
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
            // get date and time
            var myDate = moment().format("dddd, MMMM Do");
            var myTime = moment().format("h:mm a");
            currDate = $("<h1>").text(myDate);
            currTime = $("<h1>").text(myTime);

            // set weather icon
            if (response.weather[0].icon === "02d") {
                wClass = "wi wi-day-cloudy";
            } else if (response.weather[0].icon === "02n") {
                wClass = "wi wi-night-alt-cloudy";
            } else if (response.weather[0].icon === "01d") {
                wClass = "wi wi-day-sunny";
            } else if (response.weather[0].icon === "01n") {
                wClass = "wi wi-night-clear";
            } else if (
                response.weather[0].id === 801 ||
                response.weather[0].id === 802 ||
                response.weather[0].id === 803 ||
                response.weather[0].id === 804
            ) {
                wClass = "wi wi-cloudy";
            } else if (
                response.weather[0].id === 200 ||
                response.weather[0].id === 201 ||
                response.weather[0].id === 202 ||
                response.weather[0].id === 210 ||
                response.weather[0].id === 211 ||
                response.weather[0].id === 212 ||
                response.weather[0].id === 221 ||
                response.weather[0].id === 230 ||
                response.weather[0].id === 231 ||
                response.weather[0].id === 232
            ) {
                wClass = "wi wi-thunderstorm";
            } else if (
                response.weather[0].id === 300 ||
                response.weather[0].id === 301 ||
                response.weather[0].id === 302 ||
                response.weather[0].id === 310 ||
                response.weather[0].id === 311 ||
                response.weather[0].id === 312 ||
                response.weather[0].id === 313 ||
                response.weather[0].id === 314 ||
                response.weather[0].id === 321 ||
                response.weather[0].id === 500 ||
                response.weather[0].id === 701
            ) {
                wClass = "wi wi-showers";
            } else if (
                response.weather[0].id === 501 ||
                response.weather[0].id === 502 ||
                response.weather[0].id === 503 ||
                response.weather[0].id === 504 ||
                response.weather[0].id === 511 ||
                response.weather[0].id === 520 ||
                response.weather[0].id === 521 ||
                response.weather[0].id === 522 ||
                response.weather[0].id === 531
            ) {
                wClass = "wi wi-rain";
            } else if (
                response.weather[0].id === 600 ||
                response.weather[0].id === 601 ||
                response.weather[0].id === 602 ||
                response.weather[0].id === 611 ||
                response.weather[0].id === 612 ||
                response.weather[0].id === 613 ||
                response.weather[0].id === 615 ||
                response.weather[0].id === 616 ||
                response.weather[0].id === 620 ||
                response.weather[0].id === 621 ||
                response.weather[0].id === 622
            ) {
                wClass = "wi wi-snow";
            } else if (
                response.weather[0].id === 711 ||
                response.weather[0].id === 721 ||
                response.weather[0].id === 731 ||
                response.weather[0].id === 741 ||
                response.weather[0].id === 751 ||
                response.weather[0].id === 761 ||
                response.weather[0].id === 762
            ) {
                wClass = "wi wi-sandstorm";
            }
            // append weather icon to date
            var weatherIcon = $("<i>");
            weatherIcon.removeClass();
            weatherIcon.addClass(wClass);
            currDate.append(weatherIcon);
        });
    }

    // append time to DOM
    function appendTime() {
        $displayWeather.append(currDate);
        $displayWeather.append(currTime);
    }

    //--------------------------------------------------------------------------
    // QUOTE FUNCTIONS FavQs API v2
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
            // pick a random quote from the returned results under certain length
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

    //--------------------------------------------------------------------------
    // PHOTO FUNCTIONS - Pexels API
    //---------------------------------------------------------------------------

    function getPhotos() {
        // Capture selector for HTML area to hold photos
        var $displayPhoto = $("#display-photo");
        //var $displayPhoto = $(".photo-content");

        var photoType = "";
        var photosPerPage = 80;
        var timerTime = 10000; // 10 second delay between photos
        var nextPageOfPhotos = "";

        var currentPhoto = -1;
        var photoInfo = []; // clear out photo info array

        // API key for Pexels:
        // 563492ad6f91700001000001bbb93d6089ee4731b7a0c2fa559ab484

        var photoTypesHappy = ["flowers", "smile", "flower", "fun", "sky"];
        var photoTypesSad = ["sad", "rain", "clouds", "sea", "desert"];
        var photoTypesCalm = [
            "landscape",
            "universe",
            "sunset",
            "nature",
            "mountains"
        ];
        var photoTypesHyper = ["fire", "gym", "party", "kids"];
        var photoTypesTired = ["night", "forest", "light", "tree"];
        var photoTypesEnergetic = ["adventure", "sport", "success", "newyork"];
        //   beach, trees, earth,

        // set photo search parameter based on mood.

        switch (finalMood) {
            case "Happy":
                //photoType = "flowers";
                var idx = Math.floor(Math.random() * photoTypesHappy.length);
                photoType = photoTypesHappy[idx];
                break;
            case "Sad":
                //photoType = "sad";
                var idx = Math.floor(Math.random() * photoTypesSad.length);
                photoType = photoTypesSad[idx];
                break;
            case "Calm":
                //photoType = "landscape";
                var idx = Math.floor(Math.random() * photoTypesCalm.length);
                photoType = photoTypesCalm[idx];
                break;
            case "Hyper":
                //photoType = "fire";
                var idx = Math.floor(Math.random() * photoTypesHyper.length);
                photoType = photoTypesHyper[idx];
                break;
            case "Tired":
                //photoType = "sunset";
                var idx = Math.floor(Math.random() * photoTypesTired.length);
                photoType = photoTypesTired[idx];
                break;
            case "Energetic":
                //photoType = "beach";
                var idx = Math.floor(
                    Math.random() * photoTypesEnergetic.length
                );
                photoType = photoTypesEnergetic[idx];
        }

        // Some of the choices are:
        //  sunset, sky, mountains, sea, sad, night, light, desert, universe,
        //  forest, fire, beach, tree, trees, rain, earth, flowers, flower, clouds, smile

        /*  -----------------------------------------------------------------------------------------------------------
            Whenever you are doing an API request make sure to show a prominent link to Pexels.
            You can use a text link (e.g. "Photos provided by Pexels") or a link with our logo (Download our logo in white or black).
            Always credit our photographers when possible (e.g. "Photo by John Doe on Pexels" with a link to the photo page on Pexels).
            Do not copy core functionality of Pexels.
            Do not abuse the API. The API is rate-limited to 200 requests per hour and 20,000 requests per month. (For higher limits contact us).
        -------------------------------------------------------------------------------------------------------------*/

        getNextPageOfPhotos();

        function getNextPageOfPhotos() {
            currentPhoto = -1;
            photoInfo = []; // clear out photo info array

            // set up the AJAX query URL
            if (nextPageOfPhotos === "") {
                var queryURL =
                    "https://api.pexels.com/v1/search?query=" +
                    photoType +
                    "&per_page=" +
                    photosPerPage +
                    "&page=1";
            } else {
                var queryURL = nextPageOfPhotos;
            }

            // AJAX call

            $.ajax({
                url: queryURL,
                method: "GET",
                headers: {
                    Authorization:
                        "563492ad6f91700001000001bbb93d6089ee4731b7a0c2fa559ab484"
                }
            }).then(function(response) {
                nextPageOfPhotos = response.next_page;

                for (let i = 0; i < response.photos.length; i++) {
                    if (response.photos[i].width > response.photos[i].height) {
                        // create new Photo object to hold photo data and save new Photo
                        // in array of photo information
                        var newPhoto = new Photo(
                            response.photos[i].photographer,
                            response.photos[i].id,
                            response.photos[i].width,
                            response.photos[i].height,
                            response.photos[i].src.landscape,
                            response.photos[i].url
                        );
                        photoInfo.push(newPhoto);
                    }
                }
                displayNextPhoto();

                // start the countdown timer
                setTimer();
            });
        }

        //-----------------------------------------------------------
        // display next photo from array "photoInfo"
        // "https://images.pexels.com/lib/api/pexels-white.png"
        //-----------------------------------------------------------
        function displayNextPhoto() {
            currentPhoto++;
            if (currentPhoto < photoInfo.length) {
                var foto = photoInfo[currentPhoto];
                // clear out the area holding the current photo so the next one will replace it
                $displayPhoto.empty();
                var photoSpot = $("<img>").attr("src", foto.photo);
                $displayPhoto.append(photoSpot);
                // setup photo credit
                var photoURL = $("<a>");
                photoURL
                    .addClass("subtitle")
                    .attr("href", foto.url)
                    .text("Photograph by: " + foto.photographer + " on Pexels");
                $displayPhoto.append(photoURL);

                // fade-in in 1.5 seconds
                $displayPhoto.fadeIn(1500);
                // set timer to start fade-out in 8 seconds
                var fade = setTimeout(fadePhoto, 8000);
            } else {
                clearTimeout(fade);
                clearInterval(timerInterval);
                if (typeof nextPageOfPhotos !== "undefined") {
                    getNextPageOfPhotos();
                }
            }
            // clear all timer functions on return to modal to pick new mood
            $("#bottom-link").on("click", function(event) {
                event.preventDefault;
                clearTimeout(fade);
                clearInterval(timerInterval);
            });
        }

        function fadePhoto() {
            $displayPhoto.fadeOut(1500);
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
        function Photo(
            fotographer,
            picId,
            picWidth,
            picHeight,
            picture,
            picURL
        ) {
            this.photographer = fotographer;
            this.photoId = picId;
            this.photoWidth = picWidth;
            this.photoHeight = picHeight;
            this.photo = picture;
            this.url = picURL;
        }
    }

    //--------------------------------------------------------------------------
    // SONG FUNCTIONS - Napster API
    //---------------------------------------------------------------------------

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
        var queryURL = `https://api.napster.com/v2.2/playlists/${moodLowercase}/tracks?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10`;

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
        htmlPlayer: null,
        tracks: [],
        currentIndex: Math.floor(Math.random() * 10),

        play() {
            let songTitle = this.tracks[this.currentIndex].name;
            let artist = this.tracks[this.currentIndex].artistName;

            var newSongTitle = "";

            if (songTitle.length > 50) {
                newSongTitle = songTitle.substring(0, 50) + "...";
            } else {
                newSongTitle = songTitle;
            }

            let songHtml = `<p class="song-title">${"Song: " +
                newSongTitle}</p>`;
            songHtml += `<p class="artist-name">${"By: " + artist}</p>`;

            $(".content").html(songHtml);

            this.htmlPlayer.play();
        },
        next() {
            this.htmlPlayer.pause();
            this.currentIndex++;
            if (typeof this.tracks[this.currentIndex] === "undefined") {
                this.currentIndex = 0;
            }
            document.getElementById("currentTrackSource").src = this.tracks[
                this.currentIndex
            ].previewURL;
            this.htmlPlayer.load();
            this.play();
        },
        previous() {
            this.htmlPlayer.pause();
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.tracks.length - 1;
            }
            document.getElementById("currentTrackSource").src = this.tracks[
                this.currentIndex
            ].previewURL;
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

            // change accessibility outline color to blend in background
            switch (finalMood) {
                case "Happy":
                    $("audio");
                    $("#player").css("outline-color", "#fac8d3");
                    break;
                case "Sad":
                    $("audio");
                    $("#player").css("outline-color", "#8093b0");
                    break;
                case "Calm":
                    $("audio");
                    $("#player").css("outline-color", "#74a384");
                    break;
                case "Hyper":
                    $("audio");
                    $("#player").css("outline-color", "#c94d4d");
                    break;
                case "Tired":
                    $("audio");
                    $("#player").css("outline-color", "#948e9c");
                    break;
                case "Energetic":
                    $("audio");
                    $("#player").css("outline-color", "#8ed164");
                    break;
            }

            var previous = $("<a>");
            previous
                .addClass("previous-button")
                .attr("href", "#")
                .text("Previous")
                .css({ color: "white", "padding-right": "40px" });
            previous.hover(
                function() {
                    $(this).css("color", "#383a3d");
                },
                function() {
                    $(this).css("color", "white");
                }
            );

            $("#song-content").append(previous);

            $(".previous-button").on("click", function(event) {
                event.preventDefault();
                player.previous();
            });

            var next = $("<a>");
            next.addClass("next-button")
                .attr("href", "#")
                .text("Next")
                .css("color", "white");
            next.hover(
                function() {
                    $(this).css("color", "#383a3d");
                },
                function() {
                    $(this).css("color", "white");
                }
            );
            $("#song-content").append(next);

            $(".next-button").on("click", function(event) {
                event.preventDefault();
                player.next();
            });
        }
    };

    //--------------------------------------------------------------------------
    // ARTICLE FUNCTIONS - New York Times API
    //---------------------------------------------------------------------------

    function getArticle() {
        var articleKey = "";

        // create article search keywords
        switch (finalMood) {
            case "Happy":
                articleKey = "happiness";
                break;
            case "Sad":
                articleKey = "solitude";
                break;
            case "Calm":
                articleKey = "nature";
                break;
            case "Hyper":
                articleKey = "hyper";
                break;
            case "Tired":
                articleKey = "art";
                break;
            case "Energetic":
                articleKey = "energetic";
        }
        // set article URL
        var articleQueryURL =
            "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=PV7q6CymGpwmm5FszG8i5ZWTzvmDvnxQ&q=" +
            articleKey;

        // article AJAX call
        $.ajax({
            type: "GET",
            url: articleQueryURL
        }).then(function(response) {
            var randomArticle =
                response.response.docs[
                    Math.floor(Math.random() * response.response.docs.length)
                ];
            // push the random article headline onto the DOM
            var aHeadline = $("<p>");
            aHeadline.addClass("title").text(randomArticle.headline.main);
            $(".article-content").append(aHeadline);

            var newAbstract = "";

            // shorten abstract length to fit in display card
            if (randomArticle.abstract.length > 175) {
                newAbstract = randomArticle.abstract.substring(0, 175) + "...";
            } else {
                newAbstract = randomArticle.abstract;
            }

            // push article abstract and link onto the DOM
            var aAbstract = $("<p>");
            aAbstract.addClass("subtitle").text(newAbstract);
            $(".article-content").append(aAbstract);

            var aURL = $("<a>");
            aURL.addClass("subtitle")
                .attr("href", randomArticle.web_url)
                .text("Read article here");
            $(".article-content").append(aURL);
        });
    }
});
