function addToLikes(title, imageUrl) {
    // Retrieve existing likes from localStorage or initialize an empty array
    let likes = JSON.parse(localStorage.getItem('userLikes')) || [];

    // Check if the item is already liked to prevent duplicates
    if (!likes.some(item => item.title === title)) {
        // Add the new liked item
        likes.push({ title, imageUrl });
        // Update localStorage
        localStorage.setItem('userLikes', JSON.stringify(likes));
        alert(`${title} has been added to your likes!`);
    } else {
        alert(`${title} is already in your likes!`);
    }
}


