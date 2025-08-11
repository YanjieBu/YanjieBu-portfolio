// Define an array of GIF images
const gifs = [
    'url(images/food.gif)',   // First GIF
    'url(images/food2.gif)',
    'url(images/food3.gif)',
    'url(images/food4.gif)',
    'url(images/food5.gif)',
];

// Define the duration for each GIF (in milliseconds), adjust based on actual GIF duration
const gifDurations = [
    5000,  // food5
    4000,  // food1
    4000,  // food2
    4000,  // food3
    5000   // food4
];

// Define the static image for the second GIF
const secondGifStaticImage = 'url(../images/food2_static.png)'; // Assuming this is the static image for the second GIF

let currentGifIndex = 0;
let currentBackground = 1; // Tracks whether background1 or background2 is currently displayed
let loopCount = 0; // Keeps track of the playback loop count
const maxLoops = 2; // Maximum number of times the GIF sequence should play

function changeBackground() {
    const background1 = document.getElementById('background1');
    const background2 = document.getElementById('background2');

    // Toggle background images between the two background divs
    if (currentBackground === 1) {
        background2.style.backgroundImage = gifs[currentGifIndex];
        background2.style.opacity = 1; // Fade in background2
        background1.style.opacity = 0; // Fade out background1
        currentBackground = 2; // Switch to background2
    } else {
        background1.style.backgroundImage = gifs[currentGifIndex];
        background1.style.opacity = 1; // Fade in background1
        background2.style.opacity = 0; // Fade out background2
        currentBackground = 1; // Switch to background1
    }

    // Update to the next GIF index
    currentGifIndex++;

    // Check if the sequence has played twice, and display the static image for the second GIF at the end
    if (loopCount >= maxLoops && currentGifIndex === 1) {
        // Set the static image of the second GIF as the final background
        if (currentBackground === 1) {
            background1.style.backgroundImage = secondGifStaticImage;
            background1.style.opacity = 1; // Ensure the static background is visible
        } else {
            background2.style.backgroundImage = secondGifStaticImage;
            background2.style.opacity = 1;
        }

        console.log('Played twice, displaying static image of the second GIF as the final background');
        return; // Stop further background switching
    }

    // If all GIFs have played, start the sequence over and increment the loop count
    if (currentGifIndex >= gifs.length) {
        currentGifIndex = 0; // Restart from the first GIF
        loopCount++; // Increment loop count
    }

    // Set a timer to switch to the next GIF after the current one finishes
    setTimeout(changeBackground, gifDurations[currentGifIndex]);
}

// Immediately set the first background and start the loop when the page loads
changeBackground();



