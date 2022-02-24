const allEpisodes = getAllEpisodes();
const cardBody = document.getElementById("card-body");
const searchInput = document.getElementById("search-input");
const displayLength = document.querySelector(".display-length");

function setup() {
  makePageForEpisodes(allEpisodes);
}

const createEpisodeCards = (episode) => {
  // Create card element
  const twoDigit = (n) => (n < 10 ? "0" + n : n);
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
  displayLength.innerText = `The number of displayed episodes is ${episodeList.length}`;
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
  displayLength.innerText = `The number of displayed episodes is ${filteredArr.length}`;
};

searchInput.addEventListener("input", search);

window.onload = setup;
