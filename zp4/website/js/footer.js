// Get the #footer-container element
const footerContainer = document.getElementById("footer-container");

// Define the HTML content for the footer
const footerHTML = `
    <footer>
        <section class="about-designer">
            <p><a href="../index.html" target="_blank">About Designer</a></p>
        </section>
        <p id="backToTop" onclick="scrollToTop()" style="cursor: pointer;">Back to Top</p>
    </footer>
`;

// Insert the footer HTML into the #footer-container
footerContainer.innerHTML = footerHTML;

// "Back to Top" functionality: Smoothly scrolls to the top of the page
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show or hide the "Back to Top" button based on scroll position
window.addEventListener("scroll", () => {
    const backToTopButton = document.getElementById("backToTop");
    if (window.scrollY > 300) { // Show button when scrolled down 300px
        backToTopButton.style.display = "block";
    } else { // Hide button when near the top
        backToTopButton.style.display = "none";
    }
});




