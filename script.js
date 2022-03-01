let allEpisodes;
let allShows = getAllShows();
const cardBody = document.getElementById("card-body");
const searchInput = document.getElementById("search-input");
let selectEpisodes = document.getElementById("select-episode");
const displayLength = document.querySelector(".display-length");
const selectShows = document.getElementById("select-shows");
let urlShowId = 82;

function setup() {
  fetchMovies().then((result) => {
    allEpisodes = result;
    makePageForEpisodes(allEpisodes);
    select(allEpisodes, "episodes");
  });
  select(allShows, "shows");
}

const twoDigit = (n) => (n < 10 ? "0" + n : n);
const limitText = (text) => {
  return text.length > 10 ? (text = text.substring(0, 200) + "...</p>") : text;
};
const createEpisodeCards = (episode) => {
  // Create card element
  return `
    <div index=${episode.id} class='card'>
    <div class='card-image'><img src=${episode.image.medium} alt=card-image ${
    episode.name
  }></div>
      <h2 class='card-title'> ${episode.name} - S${twoDigit(
    episode.season
  )}E${twoDigit(episode.number)} </h2>
      ${limitText(episode.summary)}
    </div>
      `;
};

const makePageForEpisodes = (episodeList) => {
  episodeList.forEach((item) => {
    cardBody.innerHTML += createEpisodeCards(item);
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

let selectEpisodesStarter = false;
const select = (listOfItems, selectFor) => {
  listOfItems.forEach((item) => {
    let option = document.createElement("option");
    option.setAttribute("value", "starter");
    option.innerText = "Choose one Show";
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
    selectEpisodesStarter = true;
    cardBody.innerHTML = "";
    makePageForEpisodes(filteredArr);
  }
});

selectShows.addEventListener("change", (e) => {
  urlShowId = e.target.value;
  console.log(urlShowId);
  fetchMovies().then((result) => {
    allEpisodes = result;
    selectEpisodes.innerHTML =
      '<option value="starter" selected>Choose one Episodes</option>';
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

window.onload = setup;
