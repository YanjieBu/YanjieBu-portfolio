// Fetch the navbar content from 'navbar.html' and add sticky functionality after loading
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;

        // Enable sticky functionality only on desktop view
        if (window.innerWidth > 768) {
            // Once the navbar is loaded, get the navbar element and its offset position
            let navbar = document.querySelector('.navbar');
            let stickyOffset = navbar.offsetTop;

            // Listen for scroll events and trigger sticky functionality
            window.onscroll = function() {
                stickyNavbar(navbar, stickyOffset);
            };

            // Add or remove the "sticky" class based on scroll position
            function stickyNavbar(navbar, stickyOffset) {
                if (window.pageYOffset >= stickyOffset) {
                    navbar.classList.add("sticky"); // Make navbar sticky
                } else {
                    navbar.classList.remove("sticky"); // Remove sticky when not needed
                }
            }
        }
    });



