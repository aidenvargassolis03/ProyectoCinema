const movieContainer = document.getElementById("movieContainer");
const genreContainer = document.getElementById("genreContainer");

async function getData() {
    const response = await fetch('data/movies.json');
    const data = await response.json();

    return data;
}

function renderMovies(movies) {

    movieContainer.innerHTML = '';

    movies.forEach(movie => {

        const article = document.createElement('article');
        article.classList.add("movie-card");

        // let texto = "<img src= " + movie.poster + " alt=" + movie.title + " class='movie-card__image'>"

        article.innerHTML =
            `<img src="${movie.poster}" alt="${movie.title}" class="movie-card__image">
            <div class="movie-card__content">
                <h4 class="movie-card__title">${movie.title}</h4>
                <p class="movie-card__description">${movie.shortDescription}</p>
                <div class="movie-card__meta">
                    <span class="movie-card__duration">${movie.duration} min</span>
                    <span class="movie-card__genre">${movie.genre}</span>                    
                </div>
            <button class="movie-card__button" data-movie-id="${movie.id}">Ver detalles</button>
        </div>`;

        movieContainer.appendChild(article);
        /*console.log(`Renderizando película: ${movie.title}`); */
    });

}

function renderGenres(genres) {
    //genreContainer.innerHTML = "";

    genres.forEach(genre => {

        const link = document.createElement("a");
        link.setAttribute("href", "#");

        link.innerHTML = genre;

        genreContainer.append(link);
    });
}

function addButtonAction() {

    $(".movie-card__button").click(function () { $(".site-footer").css("background", "white"); })

}

function filterByGenre(movies) {
    const genreButtons = document.querySelectorAll(".aside-menu a");

    genreButtons.forEach((genreButton) => {
        genreButton.addEventListener("click", () => {
            const filteredMovies = movies.filter(movie => {
                if (genreButton.innerHTML == "Todos") {
                    return movie.genre
                } else {
                    return movie.genre.split("/").includes(genreButton.innerHTML);
                }
            })
            renderMovies(filteredMovies);
        })
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function renderExchangeRate() {

    $("#dolarChange").show();
    //$("#dolarChange").hide();

    const estadoTipoCambio = $("#dolarChange h2");
    const listaTipoCambio = $("#dolarChange ul");

    estadoTipoCambio.text("Cargando...");
    listaTipoCambio.empty();// .html = "";    

    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");

        if (!response.ok) throw new Error(`Error Http: ${response.status}`);

        const data = await response.json();

        const monedas = ["USD", "BRL", "CRC", "EUR", "JPY"];

        //monedas.forEach(moneda => {
        for (const moneda of monedas) {

            if (data.rates[moneda]) {
                const li = $("<li>"); //document.createElement("li");
                li.css("margin-bottom", "5px");

                li.html(`<strong>${moneda}:</strong> ${data.rates[moneda]}`);
                listaTipoCambio.append(li);

                //await sleep(2000)
            }
        }

        estadoTipoCambio.text("Tipo de cambio actualizado");

    } catch (error) {
        console.error(error);
        estadoTipoCambio.text("Ocurrió un error al cargar el tipo de cambio.");
    }
}

async function init() {
    const data = await getData();
    //console.log(data);   
    renderMovies(data.movies);
    renderGenres(data.genres);

    addButtonAction();
    filterByGenre(data.movies);

    renderExchangeRate();

    $("#year").text(new Date().getFullYear());

}

document.addEventListener('DOMContentLoaded', init)


//$(document).ready(init)