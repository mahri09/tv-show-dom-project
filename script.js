const allEpisodes = getAllEpisodes();
const cardBody = document.getElementById("card-body");
const searchInput = document.getElementById("search-input");
const selectInput = document.getElementById("select-episode");
const displayLength = document.querySelector(".display-length");

function setup() {
  makePageForEpisodes(allEpisodes);
  select(allEpisodes);
}

const twoDigit = (n) => (n < 10 ? "0" + n : n);
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
      ${episode.summary}
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

const select = (episodeList) => {
  episodeList.forEach((episode) => {
    let option = document.createElement("option");
    option.setAttribute(
      "value",
      `S${twoDigit(episode.season)}E${twoDigit(episode.number)} - ${
        episode.name
      }`
    );
    option.innerText = `S${twoDigit(episode.season)}E${twoDigit(
      episode.number
    )} - ${episode.name}`;
    selectInput.appendChild(option);
  });
};

selectInput.addEventListener("change", (e) => {
  console.log(e.target.value);
  let filteredArr = allEpisodes.filter((episode) => {
    return (
      `S${twoDigit(episode.season)}E${twoDigit(episode.number)} - ${
        episode.name
      }` === e.target.value
    );
  });
  console.log(filteredArr);
  cardBody.innerHTML = "";
  makePageForEpisodes(filteredArr);
});

window.onload = setup;
