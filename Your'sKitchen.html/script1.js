const searchButton = document.getElementById('searchButton');
const resetButton = document.getElementById('resetButton');
const ingredientInput = document.getElementById('ingredientInput');
const recipesContainer = document.getElementById('recipes');
const historyList = document.getElementById('historyList');
const API_URL = 'https://api.spoonacular.com/recipes/findByIngredients?';
const API_KEY = '03356722181f4db798a95f945e5a0fa8'; // Get your free API key from Spoonacular

// Fetch recipes based on the ingredients
const getRecipes = async (ingredients) => {
  const response = await fetch(`${API_URL}ingredients=${ingredients}&number=6&apiKey=${API_KEY}`);
  const data = await response.json();
  displayRecipes(data);
};

// Display the fetched recipes
const displayRecipes = (recipes) => {
  recipesContainer.innerHTML = ''; // Clear previous results

  if (recipes.length === 0) {
    recipesContainer.innerHTML = '<p>No recipes found. Please try different ingredients.</p>';
    return;
  }

  recipes.forEach(recipe => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    
    const recipeImage = recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}">` : '';
    const recipeTitle = `<h3>${recipe.title}</h3>`;
    const recipeInstructions = `<p>${recipe.instructions ? recipe.instructions.slice(0, 150) : 'No instructions available.'}...</p>`;
    const recipeLink = `<button onclick="window.open('https://spoonacular.com/recipes/${recipe.title}-${recipe.id}', '_blank')">View Full Recipe</button>`;
    
    recipeDiv.innerHTML = `${recipeImage}${recipeTitle}${recipeInstructions}${recipeLink}`;
    recipesContainer.appendChild(recipeDiv);
  });
};

// Add a new search query to the history
const addToSearchHistory = (query) => {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Prevent duplicates
  if (!searchHistory.includes(query)) {
    searchHistory.push(query);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }

  displaySearchHistory();
};

// Display the search history
const displaySearchHistory = () => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Clear current history list
  historyList.innerHTML = '';

  searchHistory.forEach(query => {
    const historyItem = document.createElement('li');
    historyItem.textContent = query;
    historyItem.addEventListener('click', () => {
      ingredientInput.value = query;
      getRecipes(query);
    });
    historyList.appendChild(historyItem);
  });
};

// Event listener for the search button
searchButton.addEventListener('click', () => {
  const ingredients = ingredientInput.value.trim();
  if (ingredients) {
    getRecipes(ingredients);
    addToSearchHistory(ingredients); // Add the search query to the history
  } else {
    alert('Please enter some ingredients.');
  }
});

// Optional: Enable pressing "Enter" to trigger the search button
ingredientInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchButton.click();
  }
});

// Event listener for the reset button
resetButton.addEventListener('click', () => {
  // Clear search input
  ingredientInput.value = '';

  // Clear recipes
  recipesContainer.innerHTML = '';

  // Clear search history
  localStorage.removeItem('searchHistory');
  displaySearchHistory(); // Update the UI after clearing the history
});

// Display the search history when the page loads
window.addEventListener('load', displaySearchHistory);
