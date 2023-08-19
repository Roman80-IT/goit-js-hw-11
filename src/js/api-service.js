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
    //* Ініціалізація пошукового запиту, сторінки та загальної кількості результатів
    this.#searchQuery = '';
    this.#page = 1;
    this.#totalHits = 0;
  }
}
