# Пошук зображень

Створено фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом. Додано оформлення елементів інтерфейсу. Демо-відео роботи застосунку [за цим посиланням](https://drive.google.com/file/d/1H8r6veuLFtayF07QtIyrSq9ia4X10pmM/view?usp=sharing).

## Критерії

- Проект зібраний за допомогою [`parcel-project-template`](https://github.com/goitacademy/parcel-project-template)
- Для HTTP-запитів використана бібліотека [`axios`](https://axios-http.com/)
- Використовується синтаксис `async/await`.
- Для повідомлень використана бібліотека [`notiflix`](https://github.com/notiflix/Notiflix#readme)
- Код відформатований за допомогою `Prettier`.

### Форма пошуку

Форма спочатку міститься в HTML документі. Користувач буде вводити рядок для
пошуку у текстове поле, а по сабміту форми необхідно виконувати HTTP-запит.

```html
<form class="search-form" id="search-form">
  <input
    type="text"
    name="searchQuery"
    autocomplete="off"
    placeholder="Search images..."
  />
  <button type="submit">Search</button>
</form>
```

# HTTP-запити

Для бекенду використовуй публічний API сервісу Pixabay. Зареєструйся, отримай свій унікальний ключ доступу і ознайомся з [документацією Pixabay](https://pixabay.com/api/docs/).

Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

- `key` - твій унікальний ключ доступу до API.
- `q` - термін для пошуку. Те, що буде вводити користувач.
- `image_type` - тип зображення. Нам потрібні тільки фотографії, тому встанови значення `photo`.
- `orientation` - орієнтація фотографії. Встанови значення `horizontal`.
- `safesearch` - фільтр за віком. Встанови значення `true`.

У відповіді буде масив зображень, що задовольнили критерії параметрів запиту. Кожне зображення описується об'єктом, з якого тобі цікаві лише наступні властивості:

- `webformatURL` - посилання на маленьке зображення для списку карток.
- `largeImageURL` - посилання на велике зображення.
- `tags` - рядок з описом зображення. Підійде для атрибуту `alt`.
- `likes` - кількість лайків.
- `views` - кількість переглядів.
- `comments` - кількість коментарів.
- `downloads` - кількість завантажень.

Якщо бекенд повертає порожній масив, це означає, що нічого підходящого не знайдено. У такому випадку виведи повідомлення з текстом "Sorry, there are no images matching your search query. Please try again.". Для повідомлень використовуй бібліотеку [Notiflix](https://www.notiflix.com/).

## Галерея і картка зображення

Елемент `div.gallery` спочатку міститься в HTML документі, і в нього необхідно рендерити розмітку карток зображень. Під час пошуку за новим ключовим словом необхідно повністю очищати вміст галереї, щоб не змішувати результати.

```html
<div class="gallery">
  <!-- Картки зображень -->
</div>
```

Шаблон розмітки картки одного зображення для галереї:

```<div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>
```

## Пагінація

Pixabay API підтримує пагінацію і надає параметри `page` і `per_page`. Зроби так, щоб в кожній відповіді приходило 40 об'єктів (за замовчуванням 20).

1. Початкове значення параметра `page` повинно бути 1.
2. З кожним наступним запитом, його необхідно збільшити на 1.
3. У разі пошуку за новим ключовим словом, значення `page` потрібно повернути до початкового, оскільки буде пагінація по новій колекції зображень.

HTML документ вже містить розмітку кнопки, по кліку на яку, необхідно виконувати запит за наступною групою зображень і додавати розмітку до вже існуючих елементів галереї.

```html
<button type="button" class="load-more">Завантажити ще</button>
```

- В початковому стані кнопка повинна бути прихована.
- Після першого запиту кнопка з'являється в інтерфейсі під галереєю.
- При повторному сабміті форми кнопка спочатку ховається, а після запиту знову відображається.

У відповіді бекенд повертає властивість `totalHits` - загальна кількість зображень, які відповідають критерію пошуку (для безкоштовного акаунту). Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results."

### Додатково виконано:

**Повідомлення**

Після першого запиту з кожним новим пошуком отримайте повідомлення, в якому буде написано, скільки всього знайшли зображень (властивість `totalHits`). Текст повідомлення - "Hooray! We found {totalHits} images."

```javascript
// Після отримання відповіді від сервера
const totalHits = data.totalHits;
const message = `Hooray! We found ${totalHits} images.`;
Notiflix.Notify.success(message);

## Бібліотека `SimpleLightbox`

Додано можливість відображення великої версії зображення з використанням бібліотеки [SimpleLightbox](https://simplelightbox.com/) для повноцінної галереї.

- У розмітці необхідно обгорнути кожну картку зображення у посилання, як зазначено в [документації](https://simplelightbox.com/#usage).

```html
<a href="ПОСИЛАННЯ_НА_ВЕЛИКЕ_ЗОБРАЖЕННЯ" data-lightbox="gallery-item">
  <!-- Картка зображення -->
</a>

- Бібліотека містить метод 'refresh()', який обов'язково потрібно викликати щоразу після додавання нової групи карток зображень.



### Статус деплоя

- **Жовтий колір** - виконується збірка та деплой проекту.
- **Зелений колір** - деплой завершився успішно.
- **Червоний колір** - під час лінтингу, збірки або деплою виникла помилка.

Докладнішу інформацію про статус можна переглянути, клікнувши на іконку, та у
випадаючому вікні перейти за посиланням `Details`.

![Deployment status](./assets/status.png)
