let allEpisodes;
let allShows;
const cardBody = document.getElementById("card-body");
const searchInput = document.getElementById("search-input");
let selectInputEpisodes = document.getElementById("select-episode");
const displayLength = document.querySelector(".display-length");
const selectInputShows = document.getElementById("select-shows");
let showAllBtn = document.querySelector(".showAll-btn");
let urlShowId;

let currentPage = "SHOWS";

// works windows.onload
function renderShowList() {
  allShows = getAllShows();
  let i,
    j,
    temporary,
    chunk = 10;
  for (i = 0, j = allShows.length; i < j; i += chunk) {
    temporary = allShows.slice(i, i + chunk);
    makePageForShows(temporary);
    addShowToSelectDropdown(temporary);
  }
}

const makeNumberIntoTwoDigits = (n) => (n < 10 ? "0" + n : n);
const limitText = (text) => {
  return text && text.length > 200
    ? (text = text.substring(0, 200) + "...</p>")
    : text;
};

// create episode cards
const createEpisodeCard = ({ id, image, name, number, season, summary }) => {
  let imgSrc =
    image && image.medium
      ? image.medium
      : "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg";
  // Create card element

  let cards = document.createElement("div");
  cards.classList = "card episode-card";
  cards.id = id;
  let imgDiv = document.createElement("div");
  imgDiv.className = "card-image";
  let img = document.createElement("img");
  img.setAttribute("src", imgSrc);
  let title = document.createElement("h2");
  title.className = "card-title";
  title.innerText = `${name} - S${makeNumberIntoTwoDigits(
    season
  )}E${makeNumberIntoTwoDigits(number)}`;
  let text = document.createElement("div");
  text.innerHTML = limitText(summary);
  imgDiv.appendChild(img);
  cards.appendChild(imgDiv);
  imgDiv.after(title, text);
  return cards;
};

// create show cards
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
  let mediaQuery = window.matchMedia("(min-width: 650px)");
  let imgSrc = image
    ? image.original
    : "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg";

  let card = document.createElement("div");
  let imgDiv = document.createElement("div");
  let img = document.createElement("img");
  let generalInfo = document.createElement("div");
  let showTitle = document.createElement("h2");
  let showSummary = document.createElement("div");
  let extraInfo = document.createElement("div");
  let ratedValue = document.createElement("span");
  let genreValue = document.createElement("span");
  let runTimeValue = document.createElement("span");
  let statusValue = document.createElement("span");

  card.classList = "card show-cards";
  card.id = id;
  imgDiv.className = "show-card-image";
  card.appendChild(imgDiv);
  img.setAttribute("src", imgSrc);
  imgDiv.appendChild(img);
  generalInfo.className = "general-info";
  showTitle.className = "card-title";
  showTitle.innerText = name;
  generalInfo.appendChild(showTitle);
  showSummary.className = "card-text";
  showSummary.innerHTML = mediaQuery.matches ? summary : limitText(summary);

  extraInfo.className = "extras";
  ratedValue.innerText = `Rated: ${rating.average}`;
  genreValue.innerText = `Genres: ${genres}`;
  runTimeValue.innerText = `Runtime: ${runtime}`;
  statusValue.innerText = `Status: ${status}`;
  extraInfo.append(ratedValue, genreValue, runTimeValue, statusValue);

  imgDiv.after(generalInfo);
  showTitle.after(showSummary, extraInfo);

  return card;
};

// add episode card to the dom
const makePageForEpisodes = (episodeList) => {
  episodeList.forEach((item) => {
    cardBody.appendChild(createEpisodeCard(item));
  });
};

// add show card to the dom
const makePageForShows = (episodeList) => {
  episodeList.forEach((item) => {
    cardBody.appendChild(createShowCards(item));
  });
};

// search for shows and episodes
const search = (e) => {
  let searchQuery = e.target.value.toLowerCase();

  let filteredEpisodes;
  let filteredShows;
  if (currentPage === "SHOWS") {
    filteredShows = allShows.filter(({ name, summary, genres }) => {
      return (
        name.toLowerCase().includes(searchQuery) ||
        summary.toLowerCase().includes(searchQuery) ||
        genres.some((genre) => genre.toLowerCase().includes(searchQuery))
      );
    });
    cardBody.innerHTML = "";
    makePageForShows(filteredShows);
    displayLength.innerText = `The number of displayed shows is: ${filteredShows.length}/${allShows.length}`;
  } else {
    filteredEpisodes = allEpisodes.filter(({ name, summary }) => {
      return (
        name.toLowerCase().includes(searchQuery) ||
        summary.toLowerCase().includes(searchQuery)
      );
    });
    cardBody.innerHTML = "";
    makePageForEpisodes(filteredEpisodes);
    displayLength.innerText = `The number of displayed episodes is ${filteredEpisodes.length}/${allEpisodes.length}`;
  }
};

const addEpisodeToSelectDropdown = (episodes) => {
  episodes.forEach((episode) => {
    let option = document.createElement("option");
    const seasonAndEpisodeDetails = getSeasonAndEpisodeDetails(episode);
    option.setAttribute("value", seasonAndEpisodeDetails);
    option.innerText = seasonAndEpisodeDetails;
    selectInputEpisodes.appendChild(option);
  });
};

const getSeasonAndEpisodeDetails = (episode) => {
  return `S${makeNumberIntoTwoDigits(episode.season)}E${makeNumberIntoTwoDigits(
    episode.number
  )} - ${episode.name}`;
};

const addShowToSelectDropdown = (listOfItems) => {
  listOfItems.forEach((item) => {
    let option = document.createElement("option");
    option.setAttribute("value", item.id);
    option.innerText = item.name;
    selectInputShows.appendChild(option);
  });
};

// Event listeners

searchInput.addEventListener("input", search);

// select episodes on each changing
selectInputEpisodes.addEventListener("change", (e) => {
  if (e.target.value === "starter") {
    makePageForEpisodes(allEpisodes);
  } else {
    let filteredEpisodes = allEpisodes.filter((episode) => {
      return (
        `S${makeNumberIntoTwoDigits(episode.season)}E${makeNumberIntoTwoDigits(
          episode.number
        )} - ${episode.name}` === e.target.value
      );
    });
    cardBody.innerHTML = "";
    makePageForEpisodes(filteredEpisodes);
  }
});

// select shows on each changing
selectInputShows.addEventListener("change", (e) => {
  if (e.target.value !== "starter") urlShowId = e.target.value;
  showAllBtn.classList.remove("hide");
  selectInputEpisodes.classList.remove("hide");
  selectInputShows.classList.add("hide");
  searchInput.value = "";
  displayLength.innerText = "";
  currentPage = "EPISODES";
  fetchMovies().then((result) => {
    allEpisodes = result;
    addEpisodeToSelectDropdown(allEpisodes);
    cardBody.innerHTML = "";
    makePageForEpisodes(allEpisodes);
  });
});

showAllBtn.addEventListener("click", () => {
  selectInputEpisodes.classList.add("hide");
  selectInputShows.classList.remove("hide");
  selectInputShows.value = "starter";
  showAllBtn.classList.add("hide");
  cardBody.innerHTML = "";
  searchInput.value = "";
  displayLength.innerText = "";
  makePageForShows(allShows);
  currentPage = "SHOWS";
});

// fetches episodes from api
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

window.onload = renderShowList;
