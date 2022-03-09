let allEpisodes;
let allShows;
const cardBody = document.getElementById("card-body");
const searchInput = document.getElementById("search-input");
let selectEpisodes = document.getElementById("select-episode");
const displayLength = document.querySelector(".display-length");
const selectShows = document.getElementById("select-shows");
let showBtn = document.querySelector(".showBtn");
let urlShowId;

const twoDigit = (n) => (n < 10 ? "0" + n : n);
const limitText = (text) => {
  return text && text.length > 10
    ? (text = text.substring(0, 200) + "...</p>")
    : text;
};

const createEpisodeCards = ({ id, image, name, number, season, summary }) => {
  let imgSrc =
    image && image.medium
      ? image.medium
      : "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg";
  // Create card element
  return `
    <div index=${id} class='card'>
    <div class='card-image'><img src=${imgSrc} alt='card-image ${name}'></div>
      <h2 class='card-title'> ${name} - S${twoDigit(season)}E${twoDigit(
    number
  )} </h2>
      ${limitText(summary)}
    </div>
      `;
};

const createShowCards = ({
  id,
  name,
  image,
  summary,
  genres,
  status,
  rating,
  runtime,
}) => {
  let imgSrc = image
    ? image.original
    : "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg";
  return `
    <div index=${id} class='card show-cards'>
      <div class='show-card-image'>
        <img src=${imgSrc} alt='card-image ${name}'>
      </div>
      <div class='general-info'>
        <div><h2 class='card-title'> ${name}</h2>
        ${summary}
        </div>
        <div class='extras'>
          <span>Rated: ${rating.average}</span>
          <span>Genres: ${genres}</span>
          <span>Status: ${status}</span>
          <span>Runtime: ${runtime}m</span>
        </div>
      </div>
    </div>
      `;
};

const makePageForEpisodes = (episodeList) => {
  episodeList.forEach((item) => {
    cardBody.innerHTML += createEpisodeCards(item);
  });
};

const makePageForShows = (episodeList) => {
  episodeList.forEach((item) => {
    cardBody.innerHTML += createShowCards(item);
  });
};

const search = (e) => {
  let searchQuery = e.target.value.toLowerCase();
  let filteredArr = allEpisodes.filter(({ name, summary }) => {
    return (
      name.toLowerCase().includes(searchQuery) ||
      summary.toLowerCase().includes(searchQuery)
    );
  });
  cardBody.innerHTML = "";
  makePageForEpisodes(filteredArr);
  displayLength.innerText = `The number of displayed episodes is ${filteredArr.length}/${allEpisodes.length}`;
};
searchInput.addEventListener("input", search);

// let selectEpisodesStarter = false;
const select = (listOfItems, selectFor) => {
  listOfItems.forEach((item) => {
    let option = document.createElement("option");
    if (selectFor === "shows") {
      option.setAttribute("value", item.id);
      option.innerText = item.name;
      selectShows.appendChild(option);
    } else if (selectFor === "episodes") {
      option.setAttribute(
        "value",
        `S${twoDigit(item.season)}E${twoDigit(item.number)} - ${item.name}`
      );
      option.innerText = `S${twoDigit(item.season)}E${twoDigit(
        item.number
      )} - ${item.name}`;
      selectEpisodes.appendChild(option);
    }
  });
};

selectEpisodes.addEventListener("change", (e) => {
  if (e.target.value === "starter") {
    makePageForEpisodes(allEpisodes);
  } else {
    let filteredArr = allEpisodes.filter((episode) => {
      return (
        `S${twoDigit(episode.season)}E${twoDigit(episode.number)} - ${
          episode.name
        }` === e.target.value
      );
    });
    cardBody.innerHTML = "";
    makePageForEpisodes(filteredArr);
  }
});

selectShows.addEventListener("change", (e) => {
  urlShowId = e.target.value;
  fetchMovies().then((result) => {
    allEpisodes = result;
    select(allEpisodes, "episodes");
    cardBody.innerHTML = "";
    makePageForEpisodes(allEpisodes);
  });
});

async function fetchMovies() {
  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${urlShowId}/episodes`
    );
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}

function setup() {
  allShows = getAllShows();
  makePageForShows(allShows);
  select(allShows, "shows");
}

window.onload = setup;
