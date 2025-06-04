const recipes = [ 
  {
    title: "Штрудель з яблуками",
    ingredients: "Інгредієнти: Для тіста: Борошно – 250 г Вода тепла – 100 мл Яйце – 1 шт. Рослинна олія – 2 ст.л. Дрібка солі...",
    image: "images/shtrudel.png",
    link: "shtrudel.html"
  },
  {
    title: "Тірамісу",
    ingredients: "Інгредієнти: Для крему: Яйця – 4 шт. Цукор – 100 г Маскарпоне – 500 г Ванільний екстракт – 1 ч.л....",
    image: "images/tiramisu.png",
    link: "tiramisu.html"
  },
  {
    title: "Панакота з малиновим соусом",
    ingredients: "Інгредієнти: Вершки 33% – 500 мл Молоко – 100 мл Цукор – 80 г Ваніль – 1 ч.л. Желатин – ...",
    image: "images/panakota.png",
    link: "panakota.html"
  },
  {
    title: "Брауні з горіхами",
    ingredients: "Інгредієнти: Чорний шоколад – 200 г Масло – 150 г Цукор – 200 г Яйця – 3 шт. Борошно – 100 г Какао – 2 ст.л....",
    image: "images/brauni.png",
    link: "brauni.html"
  },
  {
    title: "Шоколадний фондан",
    ingredients: "Інгредієнти: Чорний шоколад – 200 г Масло – 100 г Цукор – 100 г Яйця – 4 шт. Борошно – 50 г Сіль, Ваніль...",
    image: "images/fondan.png",
    link: "fondan.html"
  },
  {
    title: "Чізкейк без випічки",
    ingredients: "Інгредієнти: Печиво – 200 г Масло – 100 г Сир – 500 г Вершки – 200 мл Цукор – 100 г Желатин – 10 г...",
    image: "images/chizcake.png",
    link: "chizcake.html"
  }
];

// Якщо ще немає в localStorage рецепти, збережи
if (!localStorage.getItem('recipes')) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

const recipesPerPage = 2;
let currentPage = 1;

// Змінна для ідентифікації користувача (приклад)
let currentUser = null; // null, якщо не залогінений; або рядок з логіном/ID

// Функція для отримання ключа favorites для конкретного користувача
function getFavoritesKey() {
  return currentUser ? `favorites_${currentUser}` : 'favorites_guest';
}

// Отримуємо favorites для поточного користувача або гостя
let favorites = JSON.parse(localStorage.getItem(getFavoritesKey())) || [];

// Оновлення відображення рецептів
function displayRecipes() {
  const container = document.getElementById("recipe-container");
  container.innerHTML = "";

  const start = (currentPage - 1) * recipesPerPage;
  const end = start + recipesPerPage;
  const pageRecipes = recipes.slice(start, end);

  pageRecipes.forEach((recipe) => {
    const recipeHTML = `
      <a href="${recipe.link}" class="recipe-card-link">
        <div class="recipe-card" style="position: relative;">
          <div class="recipe-text">
            <h2>${recipe.title}</h2>
            <p>${recipe.ingredients}</p>
          </div>
          <img class="recipe-image" src="${recipe.image}" alt="${recipe.title}">
        </div>
      </a>
    `;
    container.innerHTML += recipeHTML;
  });

  updatePagination();
}

// Додавання/видалення рецепта з обраних для поточного користувача
function toggleFavorite(title) {
  if (favorites.includes(title)) {
    favorites = favorites.filter(t => t !== title);
  } else {
    favorites.push(title);
  }
  // Зберігаємо favorites саме під ключем для поточного користувача
  localStorage.setItem(getFavoritesKey(), JSON.stringify(favorites));
  displayRecipes();
}

function updatePagination() {
  const pageNumbers = document.getElementById("page-numbers");
  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  pageNumbers.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    pageNumbers.innerHTML += `
      <button onclick="goToPage(${i})"
              style="
                margin: 0 5px;
                background: none;
                border: none;
                color: ${isActive ? 'white' : '#aaa'};
                font-weight: ${isActive ? 'bold' : 'normal'};
                font-size: 18px;
                cursor: pointer;
              ">
        ${i}
      </button>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  displayRecipes();
}

// --- Функції для "входу" та "виходу" користувача

function loginUser(username) {
  currentUser = username;
  favorites = JSON.parse(localStorage.getItem(getFavoritesKey())) || [];
  displayRecipes();
}

function logoutUser() {
  currentUser = null;
  favorites = JSON.parse(localStorage.getItem(getFavoritesKey())) || [];
  displayRecipes();
}

// Пошук рецепта (як у тебе)
function searchRecipe() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const foundIndex = recipes.findIndex(recipe => recipe.title.toLowerCase().includes(input));

  if (foundIndex !== -1) {
    currentPage = Math.floor(foundIndex / recipesPerPage) + 1;
    displayRecipes();
    document.getElementById("recipe-container").scrollIntoView({ behavior: "smooth" });
  } else {
    alert("Рецепт не знайдено.");
  }
}

window.onload = function() {
  displayRecipes();

  // Кнопка "Обрані"
  const favoritesButton = document.getElementById('favoritesButton');
  if (favoritesButton) {
    favoritesButton.addEventListener('click', () => {
      window.location.href = 'favorites.html';
    });
  }
}
