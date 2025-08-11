function addToRecipes(title, imageUrl) {
    // Retrieve the saved recipes from local storage, or initialize as an empty array if none exist
    const recipes = JSON.parse(localStorage.getItem("userRecipes")) || [];

    // Check if the recipe already exists in the collection to avoid duplicates
    if (!recipes.some(item => item.title === title)) {
        // If it doesn't exist, add the new recipe to the collection
        recipes.push({ title, imageUrl });
        // Save the updated collection back to local storage
        localStorage.setItem("userRecipes", JSON.stringify(recipes));
        // Notify the user that the recipe was successfully added
        alert(`${title} has been added to your collection!`);
    } else {
        // Notify the user if the recipe is already in the collection
        alert(`${title} is already in your collection!`);
    }
}



