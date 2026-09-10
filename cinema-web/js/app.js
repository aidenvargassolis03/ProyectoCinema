const movieContainer = $("#movieContainer");
const genreContainer = $("#genreContainer");

async function getData() {
    const response = await fetch('data/movies.json');
    const data = await response.json();

    return data;
}

function renderMovies(movies) {

    movieContainer.empty();

    movies.forEach(movie => {

        const article = $("<article>");
        article.addClass("movie-card");

        // let texto = "<img src= " + movie.poster + " alt=" + movie.title + " class='movie-card__image'>"

       article.html(`
    <img src="${movie.poster}" alt="${movie.title}" class="movie-card__image">
            <div class="movie-card__content">
                <h4 class="movie-card__title">${movie.title}</h4>
                <p class="movie-card__description">${movie.shortDescription}</p>
                <div class="movie-card__meta">
                    <span class="movie-card__duration">${movie.duration} min</span>
                    <span class="movie-card__genre">${movie.genre}</span>                    
                </div>
            <button class="movie-card__button" data-movie-id="${movie.id}">Ver detalles</button>
        </div>
`);

        movieContainer.append(article);
        /*console.log(`Renderizando película: ${movie.title}`); */
    });

}

function renderGenres(genres) {
    genreContainer.html('<a href="#">Todos</a>');  

    genres.forEach(genre => {

        const link = $("<a>");
        link.attr("href", "#");

        link.html(genre);

        genreContainer.append(link);
    });
}

function addButtonAction() {

    $(".movie-card__button").click(function () { $(".site-footer").css("background", "white"); })

    /*const movieButtons = document.querySelectorAll(".movie-card__button");

    movieButtons.forEach((button) => {
        button.addEventListener("click", () => {
            console.log(button.dataset.movieId);
        })
    })*/

}

function filterByGenre(movies) {
    const genreButtons = $(".aside-menu a");

    genreButtons.each(function () {
        $(this).on("click", function (event) {
            event.preventDefault();

            const selectGenre = $(this).html();

            const filteredMovies = movies.filter(movie => {
                if (selectGenre == "Todos") {
                    return true;
                } 
                    return movie.genre.includes(selectGenre);
                
            });
            renderMovies(filteredMovies);
            addButtonAction();
        })
    })
}

async function init() {
    const data = await getData();
    //console.log(data);   
    renderMovies(data.movies);
    renderGenres(data.genres);

    addButtonAction();
    filterByGenre(data.movies)

    $("#year").text(new Date().getFullYear());

    /*const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();*/

    //const carts = document.getElementsByClassName("movie-card__content");
    //const genre_button = document.querySelector(".aside-menu a");
    //const genre_button = document.querySelector(".genreClass:nth-child(2)");
    //document.getElementById("genreContainer");
    //document.getElementsByClassName("genreClass");//todas las conincidencias

    //console.log(genre_button);

}

//document.addEventListener('DOMContentLoaded', init)


$(document).ready(init)