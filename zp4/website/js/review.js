// Add a 'submit' event listener to the review form
document.getElementById('review-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent default form submission behavior

    // Set up headers for API authentication
    const myHeaders = new Headers();
    myHeaders.append("student_number", "s4826065");  // Replace with actual student number
    myHeaders.append("uqcloud_zone_id", "8d9a1f2d");  // Replace with actual UQCloud zone ID

    // Access the review form element
    const form = document.getElementById('review-form');

    // Create FormData from the form to capture all input values
    const formData = new FormData(form);

    // Automatically generate the current date and time in ISO format for chat_date_time
    const currentDateTime = new Date().toISOString();
    formData.append('chat_date_time', currentDateTime);

    // Set a unique website code (replace with the actual 8-character code)
    formData.append('website_code', '8d9a1f2d');  // Replace with actual website code

    // Configure the request options for the POST request
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow"
    };

    // Send the POST request to the API to submit the review
    fetch("https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericchat/", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);  // Log the response for debugging

            // Optionally, reset the form after successful submission
            form.reset();

            // Refresh the reviews section to include the new review
            displayReviews();
        })
        .catch(error => console.error('Error:', error));  // Handle any errors
});

// Function to retrieve and display reviews from the API
function displayReviews() {
    // Set up headers for API authentication
    const myHeaders = new Headers();
    myHeaders.append("student_number", "s4826065");  // Replace with actual student number
    myHeaders.append("uqcloud_zone_id", "8d9a1f2d");  // Replace with actual UQCloud zone ID

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    // Fetch reviews from the API
    fetch("https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericchat/", requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Log fetched data for debugging

            let output = "";  // Variable to hold HTML structure for reviews

            // Loop through each review to create HTML structure
            data.forEach(review => {
                output += `
                    <div class="review-item">
                        <h3>${review.person_name}</h3>
                        <h4>${review.chat_post_title}</h4>
                        <p>${review.chat_post_content}</p>
                        <p><small>Posted on: ${review.chat_date_time}</small></p>
                    </div>
                `;
            });

            // Inject generated reviews HTML into the 'user-reviews' section
            document.querySelector('.user-reviews').innerHTML = output;
        })
        .catch(error => console.error('Error:', error));  // Handle any errors
}

// Load and display existing reviews when the page loads
window.onload = displayReviews;

