const APIURL = "https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const search_res = document.getElementById("search_res");
const total_records = document.getElementById("total_records");

// initially get fav movies
fetchMovies(APIURL);

async function fetchMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    if (respData.results.length == 0) {
        search_res.innerHTML = "No Results Founds";
        total_records.innerHTML = '';
    }else{
        total_records.innerHTML = "Total Records "+respData.total_results
    }
    
    console.log(respData);

    showMovies(respData.results);
}
function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function showMovies(movies) {
    // clear main
    movies.forEach((movie, index) => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        if (movie.poster_path != null) {
            poster_path = IMGPATH + movie.poster_path;
        } else {
            poster_path = 'https://www.peakndt.com/wp-content/uploads/2017/02/No_picture_available.png';
        }

        movieEl.innerHTML = `
            <img
                src="${poster_path}"
                alt="${movie.title}"
            />
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span class="${getClassByRate(
                    movie.vote_average
        )}">${movie.vote_average}</span>
            </div>
        `;

        main.appendChild(movieEl);
    });
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);
        search.value = searchTerm;
        search_res.innerHTML = "Search Result for "+searchTerm;
    } else {
        getMovies(APIURL);
    }
    

});

window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});
