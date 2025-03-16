const accessKey = 'Jj5EfoDiv7Q6NoitjLQ3GI1yjRWOvrRQpAXtc7l6jSQ';    

let page = 1;
let currentQuery = 'nature';

// Function to fetch images from Unsplash
function fetchImages(query = '', isLoadMore = false) {
    if (!isLoadMore) {
        // New search or category selection
        currentQuery = query || document.getElementById('searchQuery').value || 'nature';
        page = 1;
        document.getElementById('gallery').innerHTML = ''; // Clear existing images
    } else {
        page++; // Increment page for "Load More"
    }

    const url = `https://api.unsplash.com/search/photos?query=${currentQuery}&per_page=9&page=${page}&client_id=${accessKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results.length === 0) {
                alert("No images found!");
                return;
            }
            displayImages(data.results);
        })
        .catch(error => console.error("Error fetching images:", error));
}

// Function to display images in the gallery
function displayImages(images) {
    const gallery = document.getElementById('gallery');

    images.forEach((image, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 image-container';
        col.style.opacity = 0;

        col.innerHTML = `
            <div class="image-card">
                <img src="${image.urls.small}" alt="${image.alt_description}" class="gallery-img" onclick="openLightbox('${image.urls.full}')">
                <button class="download-btn" onclick="downloadImage('${image.urls.full}')">Download</button>
            </div>
        `;

        gallery.appendChild(col);

        setTimeout(() => {
            col.style.opacity = 1;
        }, index * 100);
    });

    document.getElementById('loadMoreBtn').style.display = 'block'; // Show Load More button
}



// Open Lightbox function
function openLightbox(imageUrl) {
    document.getElementById('lightboxImage').src = imageUrl;
    document.getElementById('lightbox').style.display = 'flex';

    // Set correct image URL for download button
    document.getElementById('downloadLightbox').setAttribute('onclick', `downloadImage('${imageUrl}')`);
}


// Close Lightbox function
document.getElementById("closeLightbox").addEventListener("click", function () {
    document.getElementById("lightbox").style.display = "none";
});


// Image Download function inside Lightbox
function downloadImage(imageUrl) {
    fetch(imageUrl)
        .then(response => response.blob()) // Convert to Blob
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "downloaded_image.jpg"; // Set filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => console.error("Download failed:", error));
}



// Load More button event listener
document.getElementById('loadMoreBtn').addEventListener('click', function () {
    fetchImages(currentQuery, true);
});

// Load default images on page load
window.onload = () => fetchImages();
