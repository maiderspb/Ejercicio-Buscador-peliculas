const API_KEY = "8bc9e665ccf4ff553195d67b461014b9";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";
let genreMap = {};

async function GenresCharge() {
  try {
    const res = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es`
    );
    const data = await res.json();
    genreMap = Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
  } catch (error) {
    console.error("Error al cargar géneros:", error);
  }
}

async function MoviesSearch() {
  const query = document.getElementById("searchInput").value;
  if (!query) return;

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=es`
    );
    const data = await res.json();
    showResults(data.results);
  } catch (error) {
    console.error("Error al buscar películas:", error);
  }
}

function showResults(movies) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (movies.length === 0) {
    container.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  movies.forEach((movie) => {
    const genres = movie.genre_ids.map((id) => genreMap[id]).join(", ");
    container.innerHTML += `
      <div class="movie">
        <img src="${
          movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : ""
        }" alt="${movie.title}" />
        <div class="movie-info">
          <h2>${movie.title}</h2>
          <p><strong>Géneros:</strong> ${genres || "No disponible"}</p>
          <p>${movie.overview || "Sin descripción disponible."}</p>
        </div>
      </div>
    `;
  });
}
GenresCharge();

document
  .getElementById("searchInput")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      MoviesSearch();
    }
  });
