import { hideScrollUpBtn } from './js/hide-scroll-up-button';
import { smoothscroll } from './js/smoothscroll';
// import { renderMarkup } from './js/showTrending/renderTrending';
import { fetchMovieByIdFromStorageWatched } from './js/fromStorage/fetchWatchedFromStorage';
import { hiddenElementsOnMobileVersion } from './js/hideElementsInMobileVersion';
// import './js/pagination/pagination';

import './js/modalTeam/teamModal';
import './js/modalTeam/renderTeam';
import './js/vanilla';
import './js/modal';

fetchMovieByIdFromStorageWatched();
smoothscroll();
window.addEventListener('scroll', hideScrollUpBtn);
