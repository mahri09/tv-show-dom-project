let allEpisodes;
let allShows;
const cardBody = document.getElementById("card-body");
const searchInput = document.getElementById("search-input");
let selectEpisodes = document.getElementById("select-episode");
const displayLength = document.querySelector(".display-length");
const selectShows = document.getElementById("select-shows");
let showAllBtn = document.querySelector(".showAll-btn");
let urlShowId;

let currentPage = "SHOWS";

// works windows.onload
function setup() {
  allShows = getAllShows();
  let i,
    j,
    temporary,
    chunk = 10;
  for (i = 0, j = allShows.length; i < j; i += chunk) {
    temporary = allShows.slice(i, i + chunk);
    makePageForShows(temporary);
    select(temporary, "shows");
  }
}

const twoDigit = (n) => (n < 10 ? "0" + n : n);
const limitText = (text) => {
  return text && text.length > 200
    ? (text = text.substring(0, 200) + "...</p>")
    : text;
};

// create episode cards
const createEpisodeCards = ({ id, image, name, number, season, summary }) => {
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
  let h2El = document.createElement("h2");
  h2El.className = "card-title";
  h2El.innerText = `${name} - S${twoDigit(season)}E${twoDigit(number)}`;
  let text = document.createElement("div");
  text.innerHTML = limitText(summary);
  imgDiv.appendChild(img);
  cards.appendChild(imgDiv);
  imgDiv.after(h2El, text);
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
  let cards = document.createElement("div");
  cards.classList = "card show-cards";
  cards.id = id;
  let imgDiv = document.createElement("div");
  imgDiv.className = "show-card-image";
  cards.appendChild(imgDiv);
  let img = document.createElement("img");
  img.setAttribute("src", imgSrc);
  imgDiv.appendChild(img);
  let generalInfo = document.createElement("div");
  generalInfo.className = "general-info";
  let h2El = document.createElement("h2");
  h2El.className = "card-title";
  h2El.innerText = name;
  generalInfo.appendChild(h2El);
  let text = document.createElement("div");
  text.className = "card-text";
  text.innerHTML = mediaQuery.matches ? summary : limitText(summary);
  let extraInfo = document.createElement("div");
  extraInfo.className = "extras";
  let info1 = document.createElement("span");
  let info2 = document.createElement("span");
  let info3 = document.createElement("span");
  let info4 = document.createElement("span");
  info1.innerText = `Rated: ${rating.average}`;
  info2.innerText = `Genres: ${genres}`;
  info3.innerText = `Runtime: ${runtime}`;
  info4.innerText = `Status: ${status}`;
  extraInfo.append(info1, info2, info3, info4);
  imgDiv.after(generalInfo);
  h2El.after(text, extraInfo);
  return cards;
};

// add episode card to the dom
const makePageForEpisodes = (episodeList) => {
  episodeList.forEach((item) => {
    cardBody.appendChild(createEpisodeCards(item));
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
    console.log(searchQuery);
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
searchInput.addEventListener("input", search);

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

// select episodes on each changing
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

// select shows on each changing
selectShows.addEventListener("change", (e) => {
  if (e.target.value !== "starter") urlShowId = e.target.value;
  showAllBtn.classList.remove("hide");
  selectEpisodes.classList.remove("hide");
  selectShows.classList.add("hide");
  searchInput.value = "";
  displayLength.innerText = "";
  currentPage = "EPISODES";
  fetchMovies().then((result) => {
    allEpisodes = result;
    select(allEpisodes, "episodes");
    cardBody.innerHTML = "";
    makePageForEpisodes(allEpisodes);
  });
});

showAllBtn.addEventListener("click", () => {
  selectEpisodes.classList.add("hide");
  selectShows.classList.remove("hide");
  selectShows.value = "starter";
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

window.onload = setup;
