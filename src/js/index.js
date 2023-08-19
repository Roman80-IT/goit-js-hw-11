//? npm install simplelightbox
//? npm install notiflix
//? npm install scrollmonitor

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import scrollMonitor from 'scrollmonitor';

//* Ініціалізація повідомлень Notiflix для відображення сповіщень користувачеві
Notify.init({
  position: 'right-bottom',
});

//* Ініціалізація компонента завантаження Loading з відповідними налаштуваннями
Loading.init({
  backgroundColor: 'rgba(0,0,0,0.3)',
  svgColor: 'rgb(60, 197, 218)',
  clickToClose: false,
});

//* Отримання посилань на елементи DOM (елементи сторінки) за допомогою їх ідентифікаторів або селекторів
const form$ = document.getElementById('search-form'); //* Форма пошуку
const imageContainer$ = document.querySelector('.gallery'); //* Контейнер для зображень

//* Створення екземплярів класів для роботи з пошуком і світловим боксом
const search = new ApiService();
const lightBox = new SimpleLightbox('.gallery a');

//* Створення слухача подій для прокручування контейнера зі зображеннями
const scrollListener = scrollMonitor.create(imageContainer$);
scrollListener.partiallyExitViewport(loadMore);

//* Cлухач
form$.addEventListener('submit', submitForm);

//* Ф-ція, яка виконується при поданні форми пошуку
function submitForm(event) {
  event.preventDefault(); //* Скидування cтандартної поведінки форми
  imageContainer$.innerHTML = ''; //* Очистка контейнера зі зображеннями
  Loading.dots(); //* Відображення анімації завантаження
  search.searchQuery = form$.elements.searchQuery.value; //* Отримання тексту запиту з форми
  search.resetPage(); //* Скидання поточної сторінки пошуку
  addImageAndUpdateUI(); //* Виклик ф-ції для завантаження зображень та оновлення інтерфейсу
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
  imageContainer$.insertAdjacentHTML('beforeend', markup); //* Додавання HTML розмітки зображень до контейнера
  lightBox.refresh(); //* Оновлення світлового боксу

  Loading.remove(); //* Прибирання анімації завантаження

  search.addPage(); //* Збільшення номера поточної сторінки пошуку
}
