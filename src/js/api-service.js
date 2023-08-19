//? npm install axios
//? https://pixabay.com/api/docs/
//? Your API key: 38932805-d594196d8ad5a18d00bd574f9

import axios from 'axios';

const PER_PAGE = 40; //*                                   К-сть результатів на 1 сторінці
const API_KEY = '38932805-d594196d8ad5a18d00bd574f9'; //*  API-ключ для доступу до Pixabay API
const BASE_URL = 'https://pixabay.com/api/'; //*           Базова URL-адреса для запитів

//* Клас ApiService для взаємодії з Pixabay API
export default class ApiService {
  //* Поля для збереження стану запитів
  #searchQuery; //* Пошуковий запит
  #page; //* Поточна сторінка результатів
  #totalHits; //* Загальна к-сть знайдених результатів.

  //* Конструктор класу
  constructor() {
    //* Ініціалізація пошукового запиту, сторінки та загальної к-сті результатів
    this.#searchQuery = '';
    this.#page = 1;
    this.#totalHits = 0;
  }

  //* Метод для збільшення номера поточної сторінки.
  addPage() {
    this.#page += 1;
  }

  //* Метод для скидання номера поточної сторінки на 1.
  resetPage() {
    this.#page = 1;
  }

  //* Метод для перевірки наявності більше сторінок для завантаження.
  isMorePage() {
    //* Перевірка наявності більше результатів для завантаження.
    return PER_PAGE * (this.#page - 1) < this.#totalHits;
  }

  //* Асинхронний метод для отримання зображень за допомогою API.
  async fetchImage() {
    //* Виконання GET-запиту до Pixabay API з використанням axios.
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${
        this.#searchQuery
      }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${
        this.#page
      }`
    );

    //* Оновлення загальної к-сті результатів з отриманої відповіді.
    this.#totalHits = response.data.totalHits;

    //* Повернення даних з відповіді API.
    return response.data;
  }
}
