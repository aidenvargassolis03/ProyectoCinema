const movieContainer = $("#movieContainer");
const genreContainer = $("#genreContainer");

async function getData() {
    const response = await fetch('data/movies.json');
    const data = await response.json();

    return data;
}

async function getGenres() {
    try {
        const response = await fetch('https://proyectocinemaapi.onrender.com/genres');
        const genres = await response.json();

        return genres;

    } catch (error) {
        alert("error type: " + error);
    }
}

async function getMovies() {
    try {
        const response = await fetch('https://proyectocinemaapi.onrender.com/movies');
        const movies = await response.json();

        return movies;

    } catch (error) {
        alert("error type: " + error);
    }
}

function renderMovies(movies) {

    movieContainer.empty();

    movies.forEach(movie => {

        const article = $("<article>");
        article.addClass("movie-card");

        article.html(`
            <img src="${movie.title === "Spider-Man: Un nuevo universo" ? "images/poster-spiderman.jpg" : movie.poster}" alt="${movie.title}" class="movie-card__image">
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

function addButtonAction(movies) {

    const movieDetails = document.getElementById("movieDetails");
    const movieDetailsContent = document.getElementById("movieDetailContent");

        $("#movieDetails button").remove();

    const closeButton = $("<button>");
    closeButton.text("x");
    closeButton.attr("arial-label", "Cerrar");

    closeButton.on("click", function () {
        $("#movieDetails").removeClass("show");
    });

    $("#movieDetails").prepend(closeButton);

    const buttons = $(".movie-card__button");

    buttons.each(function () {

        $(this).on("click", function () {

            const movieId = $(this).attr("data-movie-id");

            const movie = movies.find(function (movie) {
                return movie.id == movieId;
            });

            if (movie) {

                movieDetails.classList.add("show");

                movieDetailsContent.textContent = JSON.stringify(movie, null, 2);

            }
        });
    });
}

function filterByGenre(movies) {

    const genreButtons = $(".aside-menu a");

    genreButtons.each(function () {

        $(this).on("click", function (event) {

            event.preventDefault();

            const selectGenre = $(this).html();

            const filteredMovies = movies.filter(function (movie) {

                if (selectGenre == "Todos") {
                    return true;
                }

                return movie.genre.includes(selectGenre);
            });

            renderMovies(filteredMovies);

            addButtonAction(movies);
        });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function renderExchangeRate() {

    $("#dolarChange").show();

    const estadoTipoCambio = $("#dolarChange h2");
    const listaTipoCambio = $("#dolarChange ul");

    estadoTipoCambio.text("Cargando...");
    listaTipoCambio.empty();

    try {

        const response = await fetch(
            "https://api.exchangerate-api.com/v4/latest/USD"
        );

        if (!response.ok) {
            throw new Error(`Error Http: ${response.status}`);
        }

        const data = await response.json();

        const monedas = ["USD", "BRL", "CRC", "EUR", "JPY"];

        for (const moneda of monedas) {

            if (data.rates[moneda]) {

                const li = $("<li>");

                li.css("margin-bottom", "5px");

                li.html(
                    `<strong>${moneda}:</strong> ${data.rates[moneda]}`
                );

                listaTipoCambio.append(li);
            }
        }

        estadoTipoCambio.text("Tipo de cambio actualizado");

    } catch (error) {

        console.error(error);

        estadoTipoCambio.text(
            "Ocurrió un error al cargar el tipo de cambio."
        );
    }
}

async function init() {

    const data = await getData();
    const genres = await getGenres();
    const movies = await getMovies();

    renderMovies(movies);
    renderGenres(genres);

    addButtonAction(movies);
    filterByGenre(movies);

    renderExchangeRate();

    $("#year").text(new Date().getFullYear());
}

$(document).ready(init);