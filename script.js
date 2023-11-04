document.addEventListener('DOMContentLoaded', function () {
    const menu = document.querySelector('.menu');
    const menuButton = document.querySelector('.menu_button');
    const buttonIcon = document.querySelector('.menu_button span i');

    menuButton.addEventListener('click', function () {
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        buttonIcon.classList.toggle('ri-close-line');
        buttonIcon.classList.toggle('ri-menu-4-fill');
    });

    // Function to open the API key modal
    function openApiKeyModal() {
        const apiKeyModal = document.getElementById('apiKeyModal');
        apiKeyModal.style.display = 'flex';

        // Close the modal when the close button is clicked
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', function () {
            apiKeyModal.style.display = 'none';
        });

        // Handle API key submission
        const apiKeySubmitBtn = document.getElementById('apiKeySubmit');
        apiKeySubmitBtn.addEventListener('click', function () {
            const apiKeyInput = document.getElementById('apiKeyInput');
            const apiKeyValue = apiKeyInput.value.trim();

            if (apiKeyValue) {
                // Save the API key in localStorage
                localStorage.setItem('apiKey', apiKeyValue);

                // Close the modal
                apiKeyModal.style.display = 'none';
            }
        });
    }

    // Check if API key is already set in localStorage
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
        openApiKeyModal();
    }

    // Music search functionality
    const searchInput = document.getElementById('search_input');
    const searchButton = document.getElementById('search_button');
    const resultsSection = document.querySelector('.results_section');

    searchButton.addEventListener('click', function () {
        const query = searchInput.value.trim();
        if (query !== '') {
            // Construct the Shazam API URL with the user's query
            const apiUrl = `https://shazam.p.rapidapi.com/search?term=${encodeURIComponent(query)}`;
            const apiKey = localStorage.getItem('apiKey'); // Retrieve the API key from localStorage

            if (!apiKey) {
                openApiKeyModal();
            } else {
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
                    },
                };

                fetch(apiUrl, options)
                    .then((response) => response.json())
                    .then((data) => {
                        const track = data.tracks.hits[0].track;
                        resultsSection.innerHTML = `
                        <h2>${track.title}</h2>
                        <span class="artist">${track.subtitle}</span>
                        <div class="image">
                            <img src="${track.images.coverart}" alt="${track.title} cover">
                        </div>
                        <div class="music_player">
                            <audio id="audio" src="${track.hub.actions[1].uri}"></audio>
                            <div class="progress_container">
                                <div id="progress_bar" class="progress_bar"></div>
                            </div>
                            <div class="song_time">
                                <span id="current_time">0:00</span>
                                <span id="total_time">0:00</span>
                            </div>
                            <div class="player_controls">
                                <button id="play_pause_button" class="play"><i class="ri-play-line"></i></button>
                                <a href="${track.hub.actions[1].uri}" download><i class="ri-download-cloud-line"></i></a>
                            </div>
                        </div>
                    `;
                        resultsSection.style.display = 'flex';

                        // Audio player control logic
                        const audio = document.getElementById("audio");
                        const playPauseButton = document.getElementById("play_pause_button");
                        const playPauseButtonIcon = document.querySelector("#play_pause_button i");
                        const progressBar = document.getElementById("progress_bar");
                        const currentTimeDisplay = document.getElementById("current_time");
                        const totalTimeDisplay = document.getElementById("total_time");

                        playPauseButton.addEventListener("click", function () {
                            if (audio.paused) {
                                audio.play();
                                playPauseButtonIcon.classList.remove('ri-play-line');
                                playPauseButtonIcon.classList.add('ri-pause-line');
                            } else {
                                audio.pause();
                                playPauseButtonIcon.classList.remove('ri-pause-line');
                                playPauseButtonIcon.classList.add('ri-play-line');
                            }
                        });

                        audio.addEventListener("timeupdate", function () {
                            const currentTime = audio.currentTime;
                            const duration = audio.duration;
                            const progress = (currentTime / duration) * 100;
                            progressBar.style.width = progress + "%";

                            // Update current time and total time display
                            currentTimeDisplay.textContent = formatTime(currentTime);
                            totalTimeDisplay.textContent = formatTime(duration);
                        });

                        // Format time in minutes and seconds
                        function formatTime(time) {
                            const minutes = Math.floor(time / 60);
                            const seconds = Math.floor(time % 60);
                            return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        resultsSection.innerHTML = 'Error occurred while searching for music.';
                    });
            }
        }
    });

    // Microphone functionality
    const micButton = document.getElementById('mic_button');
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        searchButton.click();
    };

    micButton.addEventListener('click', function () {
        recognition.start();
    });

    recognition.onend = function () {
        recognition.start();
    };
});
