document.addEventListener('DOMContentLoaded', function () {
    const menu = document.querySelector('.menu');
    const menuButton = document.querySelector('.menu_button');
    const buttonIcon = document.querySelector('.menu_button span i');

    menuButton.addEventListener('click', function () {
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        buttonIcon.classList.toggle('ri-close-line');
        buttonIcon.classList.toggle('ri-menu-4-fill');
    });

    // Music search functionality
    const searchInput = document.getElementById('search_input');
    const searchButton = document.getElementById('search_button');
    const resultsSection = document.querySelector('.results_section');

    searchButton.addEventListener('click', function () {
        const query = searchInput.value.trim();
        if (query !== '') {
            // Construct the Shazam API URL with the user's query
            const apiUrl = `https://shazam.p.rapidapi.com/search?term=${encodeURIComponent(query)}`;
            const apiKey = '6f458f333amsh2bd68b4bc01ad26p1efff8jsn57139ab6c0bc'; // Replace with your RapidAPI key

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
                    <span>${track.subtitle}</span>
                    <div class="image">
                        <img src="${track.images.coverart}" alt="${track.title} cover">
                    </div>
                    <a href="${track.hub.actions[1].uri}" download><i class="ri-download-cloud-line"></i></a>
                `;
                    resultsSection.style.display = 'flex';
                })
                .catch((error) => {
                    console.error(error);
                    resultsSection.innerHTML = 'Error occurred while searching for music.';
                });
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
