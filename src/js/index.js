//? npm install simplelightbox
//? npm install notiflix
//? npm install scrollmonitor

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import scrollMonitor from 'scrollmonitor';

//* Ініціалізація повідомлень 'Notiflix'
Notify.init({
  position: 'right-bottom',
});

//* Ініціалізація компонента завантаження Loading
Loading.init({
  backgroundColor: 'rgba(0,0,0,0.3)',
  svgColor: 'rgb(60, 197, 218)',
  clickToClose: false,
});

const form$ = document.getElementById('search-form');
const imageContainer$ = document.querySelector('.gallery');

//* Створення екземплярів класів для роботи з пошуком і Lightbox
const search = new ApiService();
const lightBox = new SimpleLightbox('.gallery a');

//* Слухач для прокручування контейнера зі зображеннями
const scrollListener = scrollMonitor.create(imageContainer$);
scrollListener.partiallyExitViewport(loadMore);

form$.addEventListener('submit', submitForm);

//* Ф-ція, яка виконується при поданні форми пошуку
function submitForm(event) {
  event.preventDefault();
  imageContainer$.innerHTML = '';
  Loading.dots();
  search.searchQuery = form$.elements.searchQuery.value; //* Отримання тексту запиту з форми
  search.resetPage();
  addImageAndUpdateUI(); //* Виклик ф-ції для завантаження додаткових зображень
}

//* Ф-ція, яка викликається при частковому виході контейнера зі зображеннями з області видимості
function loadMore() {
  if (search.isMorePage()) {
    Loading.dots();
    addImageAndUpdateUI(); //* Виклик ф-ції для завантаження додаткових зображень
    return;
  }
  Notify.info("We're sorry, but you've reached the end of search results.");
}

//* Ф-ція для завантаження додаткових зображень
async function addImageAndUpdateUI() {
  try {
    const image = await search.fetchImage(); //* Отримання даних зображення з API
    if (search.currentPage === 1 && search.totalHits !== 0) {
      Notify.success(`Hooray! We found ${search.totalHits} images.`);
    }

    renderImage(image.hits); //* Оновлення інтерфейсу з отриманими даними зображення
  } catch {
    Notify.failure('Oops! Something went wrong! Try to reload the page!');
  }
}

//* Ф-ція для відображення зображень на сторінці
function renderImage(array) {
  if (!array.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    Loading.remove(); //* Прибирання анімації завантаження
    return;
  }
  const markup = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${downloads}
              </p>
            </div></a>
          </div>`;
      }
    )
    .join('');
  imageContainer$.insertAdjacentHTML('beforeend', markup); //* Додавання HTML-розмітки зображень до контейнера
  lightBox.refresh();

  Loading.remove();

  search.addPage();
}
