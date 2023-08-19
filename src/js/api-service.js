//? npm install axios
//? https://pixabay.com/api/docs/
//? Your API key: 38932805-d594196d8ad5a18d00bd574f9

import axios from 'axios';

const PER_PAGE = 40;
const API_KEY = '38932805-d594196d8ad5a18d00bd574f9';
const BASE_URL = 'https://pixabay.com/api/';

//* Клас ApiService для взаємодії з Pixabay API
export default class ApiService {
  #searchQuery;
  #page;
  #totalHits;

  //* Конструктор класу - iніціалізація пошукового запиту, сторінки та загальної к-сті результатів
  constructor() {
    this.#searchQuery = '';
    this.#page = 1;
    this.#totalHits = 0;
  }

  addPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  isMorePage() {
    //* Перевірка наявності більше результатів для завантаження.
    return PER_PAGE * (this.#page - 1) < this.#totalHits;
  }

  get totalHits() {
    return this.#totalHits;
  }

  get currentPage() {
    return this.#page;
  }

  set searchQuery(value) {
    this.#searchQuery = value;
  }

  async fetchImage() {
    //* Виконання GET-запиту до Pixabay API з використанням axios.
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${
        this.#searchQuery
      }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${
        this.#page
      }`
    );

    this.#totalHits = response.data.totalHits;

    return response.data;
  }
}
