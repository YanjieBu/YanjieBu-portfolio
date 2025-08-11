// Highlight the current sidebar link and enlarge the active link on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');  // Select all sections on the page
    const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');  // Select all sidebar links

    let currentSection = '';  // Variable to store the ID of the current section

    // Loop through each section to determine which section is currently in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;  // Get the top position of each section
        // Check if the scroll position has passed the section's top offset minus an offset (100px)
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');  // Set currentSection to the section's ID
        }
    });

    // Loop through each sidebar link
    sidebarLinks.forEach(link => {
        link.classList.remove('active');  // Remove the active class from all links
        // Add the active class to the link corresponding to the current section
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});







