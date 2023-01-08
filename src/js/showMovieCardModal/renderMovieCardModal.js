const refs = {
  movieModal: document.querySelector('.movieModal__info'),
};

const genresTxt = genres => {
  return genres.map(({ name }) => name).join(', ');
};

export const renderModalMarkup = ({
  id,
  poster_path,
  title,
  original_title,
  vote_average,
  vote_count,
  popularity,
  genres,
  overview,
}) => {
  const markup = `
    <img class="movieModal__image" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="movieImg" />
      <div class="movieModal__wraper">
        <table class="movieModal__table">
          <caption class="movieModal__caption">
            ${title}
          </caption>
          <tbody>
            <tr>
              <td class="movieModal__parameter padding-bottom-td">
                Vote / Votes
              </td>
              <td class="movieModal__value padding-bottom-td">
                <span class="movieModal__vote">${vote_average}</span> /
                <span class="movieModal__votes">${vote_count}</span>
              </td>
            </tr>
            <tr>
              <td class="movieModal__parameter padding-bottom-td">
                Popularity chocolate
              </td>
              <td class="movieModal__value padding-bottom-td">${popularity}</td>
            </tr>
            <tr>
              <td class="movieModal__parameter padding-bottom-td">
                Original Title
              </td>
              <td class="movieModal__value padding-bottom-td">
                ${original_title}
              </td>
            </tr>
            <tr>
              <td class="movieModal__parameter no-padding-td">Genre</td>
              <td class="movieModal__value no-padding-td">${genresTxt(
                genres
              )}</td>
            </tr>
          </tbody>
        </table>
        <div class="movieModal__description">
          <p class="movieModal__about">about</p>
          <p class="movieModal__text">
            ${overview}
          </p>
        </div>
        <div class="movieModal__btns">
          <button class="filmoteca-btn filmoteca-btn--secondary" type="button" data-id="${id}" id="addToWatchedBtn">
            Add to watched
          </button>
          <button class="filmoteca-btn filmoteca-btn--secondary" type="button" data-id="${id}" id="addToQueueBtn">
            Add to queue
          </button>
        </div>
      </div>
    `;
  document.querySelector('.movieModal__info').innerHTML = markup;
};
