//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  let result = createEpisodeCards(allEpisodes);
  makePageForEpisodes(result);
}

const createEpisodeCards = (episodesArr) => {
  // Create card element
  const card = document.createElement("div");
  const twoDigit = (n) => (n < 10 ? "0" + n : n);
  episodesArr.forEach((episode) => {
    card.classList = "card-body";
    // Construct card content
    const content = `
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
    // Append newly created card element to the card
    // console.log(card);
    card.innerHTML += content;
  });
  return card;
};

const makePageForEpisodes = (episodeList) => {
  const rootElem = document.getElementById("root");
  rootElem.append(episodeList);
};

window.onload = setup;
