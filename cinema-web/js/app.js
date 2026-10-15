
const movieContainer = $("#movieContainer");
const genreContainer = $("#genreContainer");

const ticketPrice = 2500;
let selectedMovie = null;

// Obtener géneros desde la API
async function getGenres() {
    try {
        const response = await fetch(
            "https://proyectocinemaapi.onrender.com/genres"
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al cargar géneros:", error);
        return [];
    }
}

// Obtener películas desde la API
async function getMovies() {
    try {
        const response = await fetch(
            "https://proyectocinemaapi.onrender.com/movies"
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al cargar películas:", error);
        return [];
    }
}

// Mostrar las películas
function renderMovies(movies) {
    movieContainer.empty();

    movies.forEach(movie => {
        const article = $("<article>");
        article.addClass("movie-card");

        const poster =
            movie.title === "Spider-Man: Un nuevo universo"
                ? "images/poster-spiderman.jpg"
                : movie.poster;

        article.html(`
            <img
                src="${poster}"
                alt="${movie.title}"
                class="movie-card__image"
            >

            <div class="movie-card__content">
                <h4 class="movie-card__title">${movie.title}</h4>

                <p class="movie-card__description">
                    ${movie.shortDescription}
                </p>

                <div class="movie-card__meta">
                    <span class="movie-card__duration">
                        ${movie.duration} min
                    </span>

                    <span class="movie-card__genre">
                        ${movie.genre}
                    </span>
                </div>

                <button
                    class="movie-card__button"
                    data-movie-id="${movie.id}"
                >
                    Ver detalles
                </button>

                <button
                    class="buy-ticket-button"
                    data-movie-id="${movie.id}"
                >
                    Comprar tiquetes
                </button>
            </div>
        `);

        movieContainer.append(article);
    });
}

// Mostrar los géneros
function renderGenres(genres) {
    genreContainer.html('<a href="#">Todos</a>');

    genres.forEach(genre => {
        const link = $("<a>");
        link.attr("href", "#");
        link.text(genre);

        genreContainer.append(link);
    });
}

// Botón para ver detalles de una película
function addButtonAction(movies) {
    const movieDetails = document.getElementById("movieDetails");
    const movieDetailsContent =
        document.getElementById("movieDetailContent");

    $("#movieDetails button").remove();

    const closeButton = $("<button>");
    closeButton.text("×");
    closeButton.attr("aria-label", "Cerrar");

    closeButton.on("click", function () {
        $("#movieDetails").removeClass("show");
    });

    $("#movieDetails").prepend(closeButton);

    $(".movie-card__button").each(function () {
        $(this).on("click", function () {
            const movieId = $(this).attr("data-movie-id");

            const movie = movies.find(function (item) {
                return item.id == movieId;
            });

            if (movie) {
                movieDetails.classList.add("show");
                movieDetailsContent.textContent =
                    JSON.stringify(movie, null, 2);
            }
        });
    });
}

// Filtrar películas por género
function filterByGenre(movies) {
    $(".aside-menu a").each(function () {
        $(this).on("click", function (event) {
            event.preventDefault();

            const selectedGenre = $(this).text();

            const filteredMovies = movies.filter(function (movie) {
                if (selectedGenre === "Todos") {
                    return true;
                }

                return movie.genre.includes(selectedGenre);
            });

            renderMovies(filteredMovies);
            addButtonAction(movies);
        });
    });
}

// Mostrar el tipo de cambio
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
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const monedas = ["USD", "BRL", "CRC", "EUR", "JPY"];

        monedas.forEach(moneda => {
            if (data.rates[moneda]) {
                const li = $("<li>");
                li.css("margin-bottom", "5px");

                li.html(
                    `<strong>${moneda}:</strong> ${data.rates[moneda]}`
                );

                listaTipoCambio.append(li);
            }
        });

        estadoTipoCambio.text("Tipo de cambio actualizado");
    } catch (error) {
        console.error("Error al cargar el tipo de cambio:", error);

        estadoTipoCambio.text(
            "Ocurrió un error al cargar el tipo de cambio."
        );
    }
}

// Inicializar la página
async function init() {
    const [genres, movies] = await Promise.all([
        getGenres(),
        getMovies()
    ]);

    renderMovies(movies);
    renderGenres(genres);

    addButtonAction(movies);
    filterByGenre(movies);

    renderExchangeRate();

    $("#year").text(new Date().getFullYear());
}

$(document).ready(init);

// Abrir y cerrar el carrito desde el ícono
$(document).ready(function () {
    $("#cartToggle").on("click", function () {
        const cart = $("#carrito");
        const isHidden = cart.prop("hidden");

        cart.prop("hidden", !isHidden);
        $(this).attr("aria-expanded", String(isHidden));
    });
});

// Mostrar mensajes dentro del carrito
function showCartMessage(message, type = "success") {
    $("#cartMessage")
        .removeClass("success error")
        .addClass(type)
        .text(message)
        .prop("hidden", false);
}

// Actualizar el precio total y el contador
function updateTicketTotal() {
    let quantity = Number($("#ticketQuantity").val());

    if (!Number.isInteger(quantity) || quantity < 1) {
        quantity = 1;
    }

    if (quantity > 10) {
        quantity = 10;
    }

    $("#ticketQuantity").val(quantity);

    const total = quantity * ticketPrice;

    $("#ticketTotal").text(
        "₡" + total.toLocaleString("es-CR")
    );

    $("#cartCount").text(quantity);
}

// Seleccionar una película para comprar tiquetes
$(document).on("click", ".buy-ticket-button", async function () {
    const movieId = $(this).attr("data-movie-id");
    const movies = await getMovies();

    selectedMovie = movies.find(function (movie) {
        return movie.id == movieId;
    });

    if (!selectedMovie) {
        return;
    }

    const showtimes = selectedMovie.showtimes || [];

    const showtimesOptions = showtimes
        .map(function (time) {
            return `<option value="${time}">${time}</option>`;
        })
        .join("");

    $("#cartContent").html(`
        <h4>${selectedMovie.title}</h4>

        <p>
            <strong>Género:</strong> ${selectedMovie.genre}
        </p>

        <label for="showtimeSelect">
            Seleccione el horario:
        </label>

        <select id="showtimeSelect">
            <option value="">Elija un horario</option>
            ${showtimesOptions}
        </select>

        <p class="ticket-price">
            Precio por tiquete: <strong>₡2.500</strong>
        </p>

        <div class="ticket-quantity">
            <label for="ticketQuantity">
                Cantidad de tiquetes:
            </label>

            <input
                type="number"
                id="ticketQuantity"
                min="1"
                max="10"
                value="1"
            >
        </div>

        <p class="ticket-total">
            Total: <strong id="ticketTotal">₡2.500</strong>
        </p>

        <button
            type="button"
            id="confirmPurchase"
            class="confirm-purchase-button"
        >
            Confirmar compra
        </button>

        <button
            type="button"
            id="cancelPurchase"
            class="cancel-purchase-button"
        >
            Cancelar compra
        </button>

        <p id="cartMessage" class="cart-message" hidden></p>
    `);

    // Guardar la película en el carrito para la confirmación
    $("#cartContent").data("selectedMovie", selectedMovie);

    $("#carrito").prop("hidden", false);
    $("#cartToggle").attr("aria-expanded", "true");

    // Actualizar el total al cambiar la cantidad
    $("#ticketQuantity").on(
        "input change",
        updateTicketTotal
    );

    updateTicketTotal();
});

// Confirmar la compra y descargar el comprobante JSON
$(document).on("click", "#confirmPurchase", function () {
    const movieToBuy = $("#cartContent").data("selectedMovie");
    const showtime = $("#showtimeSelect").val();
    const quantity = Number($("#ticketQuantity").val());

    if (!movieToBuy) {
        showCartMessage(
            "No se encontró la película seleccionada.",
            "error"
        );
        return;
    }

    if (!showtime) {
        showCartMessage(
            "Seleccione un horario antes de confirmar.",
            "error"
        );
        return;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        showCartMessage(
            "Elija entre 1 y 10 tiquetes.",
            "error"
        );
        return;
    }

    const transaction = {
        movie: movieToBuy.title,
        genre: movieToBuy.genre,
        showtime: showtime,
        quantity: quantity,
        pricePerTicket: ticketPrice,
        total: quantity * ticketPrice,
        purchaseDate: new Date().toISOString()
    };

    const jsonData = JSON.stringify(transaction, null, 2);

    const blob = new Blob([jsonData], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = url;
    downloadLink.download = "comprobante-cinema.json";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 1000);

    showCartMessage(
        "¡Compra confirmada! Su comprobante se ha generado.",
        "success"
    );

    $("#cancelPurchase").hide();

    $("#confirmPurchase").text("Nueva compra");
    $("#confirmPurchase").attr("id", "newPurchase");
});

$(document).on("click", "#cancelPurchase", function () {
    // Limpiar la pelicula seleccionada
    $("#cartContent").removeData("selectedMovie");
    selectedMovie = null;

    // Restablecer el contenido del carrito
    $("#cartContent").html(`
        <p>Selecciona una película para comenzar tu compra.</p>
    `);

    // Restablecer el contador
    $("#cartCount").text("0");

    // Cerrar el carrito
    $("#carrito").prop("hidden", true);
    $("#cartToggle").attr("aria-expanded", "false");
});


 // Iniciar una nueva compra
$(document).on("click", "#newPurchase", function () {
    $("#cartContent").removeData("selectedMovie");
    selectedMovie = null;

    $("#cartContent").html(`
        <p>Seleccione una película para comenzar su compra.</p>
    `);

    $("#cartCount").text("0");

    $("#carrito").prop("hidden", true);
    $("#cartToggle").attr("aria-expanded", "false");
});

