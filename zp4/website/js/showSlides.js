let slideIndex = 1;  // Initial slide index
showSlides(slideIndex);  // Show the initial slide

// Function to control slides with arrow buttons
function moveSlide(n) {
    showSlides(slideIndex += n);  // Adjust slide index and show the new slide
}

// Function to jump directly to a specific slide
function currentSlide(n) {
    showSlides(slideIndex = n);  // Set slideIndex to the selected slide and display it
}

// Function to display the current slide
function showSlides(n) {
    let slides = document.getElementsByClassName("slide");  // Get all slide elements
    let dots = document.getElementsByClassName("dot");  // Get all navigation dots

    // Wrap around if n exceeds the number of slides
    if (n > slides.length) {
        slideIndex = 1;  // Go back to the first slide
    }

    // Wrap around to the last slide if n is less than 1
    if (n < 1) {
        slideIndex = slides.length;  // Go to the last slide
    }

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Remove the active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-dot", "");
    }

    // Display the current slide and activate the corresponding dot
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active-dot";
}

// Function to set up automatic slideshow
function autoSlideShow() {
    setInterval(() => {
        moveSlide(1);  // Automatically move to the next slide every 4 seconds
    }, 4000);
}

// Start the automatic slideshow after the page loads
window.onload = autoSlideShow;


