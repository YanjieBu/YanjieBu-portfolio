document.addEventListener("DOMContentLoaded", function () {
    const loginSection = document.getElementById("login-before");
    const welcomeSection = document.getElementById("login-after");
    const usernameDisplay = document.getElementById("username-display");
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("back-btn");

    // Check if the user is already logged in
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
        showWelcomeSection(storedUser);
    } else {
        loginSection.style.display = "block";
    }

    // Handle login form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username === "" || password === "") {
            alert("Username and password cannot be empty");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || {};

        if (users[username]) {
            if (users[username] === password) {
                localStorage.setItem("loggedInUser", username);
                showWelcomeSection(username);
            } else {
                alert("Incorrect password. Please try again.");
            }
        } else {
            users[username] = password;
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("loggedInUser", username);
            showWelcomeSection(username);
        }
    });

    // Logout functionality
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        welcomeSection.style.display = "none";
        loginSection.style.display = "block";
    });

    // Show the welcome section after login
    function showWelcomeSection(username) {
        loginSection.style.display = "none";
        welcomeSection.style.display = "block";
        usernameDisplay.textContent = username;
    }

    // Display liked items section
    const yourLikesBtn = document.getElementById("your-likes-btn");
    const userLikesContainer = document.getElementById("user-likes");

    yourLikesBtn.addEventListener("click", function () {
        if (userLikesContainer.style.display === "none" || userLikesContainer.style.display === "") {
            userLikesContainer.style.display = "block";
            displayLikedItems();
        } else {
            userLikesContainer.style.display = "none";
        }
    });

    // Display saved recipes section
    const yourRecipesBtn = document.getElementById("your-recipes-btn");
    const userRecipesContainer = document.getElementById("user-recipes");

    yourRecipesBtn.addEventListener("click", function () {
        if (userRecipesContainer.style.display === "none" || userRecipesContainer.style.display === "") {
            userRecipesContainer.style.display = "block";
            displayRecipeItems();
        } else {
            userRecipesContainer.style.display = "none";
        }
    });
});

// Display liked items in the likes section
function displayLikedItems() {
    const userLikesContainer = document.getElementById("user-likes");
    userLikesContainer.innerHTML = '';

    const likes = JSON.parse(localStorage.getItem("userLikes")) || [];
    likes.forEach((like, index) => {
        const likeCard = createLikeCard(like.title, like.imageUrl, index);
        userLikesContainer.appendChild(likeCard);
    });
}

// Create a like card element for each liked item
function createLikeCard(title, imageUrl, index) {
    const likeCard = document.createElement("div");
    likeCard.classList.add("like-card");

    const link = document.createElement("a");
    link.href = "Skill1.html";
    link.target = "_self";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;
    img.classList.add("liked-image");

    link.appendChild(img);

    const titleElem = document.createElement("h3");
    titleElem.innerText = title;

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-btn");
    closeButton.innerText = "×";

    closeButton.addEventListener("click", function () {
        removeLike(index);
    });

    likeCard.appendChild(closeButton);
    likeCard.appendChild(link);
    likeCard.appendChild(titleElem);

    return likeCard;
}

// Add a new item to the likes collection
function addToLikes(title, imageUrl) {
    const likes = JSON.parse(localStorage.getItem("userLikes")) || [];
    if (!likes.some(item => item.title === title)) {
        likes.push({ title, imageUrl });
        localStorage.setItem("userLikes", JSON.stringify(likes));
        alert(`${title} has been added to your likes!`);
    } else {
        alert(`${title} is already in your likes!`);
    }
}

// Remove an item from the likes collection
function removeLike(index) {
    const likes = JSON.parse(localStorage.getItem("userLikes")) || [];
    likes.splice(index, 1);
    localStorage.setItem("userLikes", JSON.stringify(likes));
    displayLikedItems();
}

// Display saved recipes in the recipes section
function displayRecipeItems() {
    const userRecipesContainer = document.getElementById("user-recipes");
    userRecipesContainer.innerHTML = '';

    const recipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    recipes.forEach((recipe, index) => {
        const recipeCard = createRecipeCard(recipe.title, recipe.imageUrl, index);
        userRecipesContainer.appendChild(recipeCard);
    });
}

// Create a recipe card element for each saved recipe
function createRecipeCard(title, imageUrl, index) {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    // Create link containing the recipe image
    const link = document.createElement("a");
    link.href = "Recipe1.html";
    link.target = "_self";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;
    img.classList.add("recipe-image");

    link.appendChild(img);

    const titleElem = document.createElement("h3");
    titleElem.innerText = title;

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-btn");
    closeButton.innerText = "×";

    closeButton.addEventListener("click", function (event) {
        event.stopPropagation();
        removeRecipe(index);
    });

    recipeCard.appendChild(closeButton);
    recipeCard.appendChild(link);
    recipeCard.appendChild(titleElem);

    return recipeCard;
}

// Add a new recipe to the collection
function addToRecipes(title, imageUrl) {
    const recipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    if (!recipes.some(item => item.title === title)) {
        recipes.push({ title, imageUrl });
        localStorage.setItem("userRecipes", JSON.stringify(recipes));
        alert(`${title} has been added to your collection!`);
    } else {
        alert(`${title} is already in your collection!`);
    }
}

// Remove a recipe from the collection
function removeRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    recipes.splice(index, 1);
    localStorage.setItem("userRecipes", JSON.stringify(recipes));
    displayRecipeItems();
}


