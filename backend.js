const accessKey = "cAt37sMv0V0yck7Uxo9SLbhx6O5Jv_ycUA7Tpy1_ytk";
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const showMoreBtn = document.createElement('button');
showMoreBtn.textContent = "Show More";
showMoreBtn.style.display = "none"; 
showMoreBtn.classList.add('show-more-btn');
showMoreBtn.style.margin = "20px auto 40px auto";
showMoreBtn.style.padding = "10px 20px";
showMoreBtn.style.fontSize = "16px";
showMoreBtn.style.border = "none";
showMoreBtn.style.borderRadius = "8px";
showMoreBtn.style.background = "#333";
showMoreBtn.style.color = "#fff";
showMoreBtn.style.cursor = "pointer";
showMoreBtn.style.transition = "background 0.3s";
showMoreBtn.onmouseover = () => showMoreBtn.style.background = "#555";
showMoreBtn.onmouseout = () => showMoreBtn.style.background = "#333";
gallery.insertAdjacentElement('afterend', showMoreBtn);

let currentQuery = "mars";
let currentPage = 1;

// --- LIGHTBOX ELEMENT ---
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.style.position = 'fixed';
lightbox.style.top = 0;
lightbox.style.left = 0;
lightbox.style.width = '100%';
lightbox.style.height = '100%';
lightbox.style.background = 'rgba(0,0,0,0.9)';
lightbox.style.display = 'none';
lightbox.style.justifyContent = 'center';
lightbox.style.alignItems = 'center';
lightbox.style.zIndex = 1000;
lightbox.style.cursor = 'pointer';
lightbox.innerHTML = `<img style="max-width:90%; max-height:90%; border-radius:8px;">`;
document.body.appendChild(lightbox);

lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

async function fetchImages(query = currentQuery, page = 1) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=16&client_id=${accessKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (page === 1) {
            gallery.innerHTML = ''; 
        }
        displayImages(data.results);
        showMoreBtn.style.display = data.results.length > 0 ? "block" : "none";
    } catch (error) {
        console.error("Error fetching images:", error);
        gallery.innerHTML = "<p style='color:red;'>Failed to load images. Try again later.</p>";
        showMoreBtn.style.display = "none";
    }
}

function displayImages(images) {
    images.forEach(img => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.innerHTML = `
            <a href="#">
                <img src="${img.urls.regular}" alt="${img.alt_description || 'Image'}">
            </a>
            <div class="caption">${img.alt_description || 'Untitled'}</div>
        `;
        gallery.appendChild(item);
        const imageElement = item.querySelector('img');
        imageElement.addEventListener('click', (e) => {
            e.preventDefault(); 
            const lbImg = lightbox.querySelector('img');
            lbImg.src = imageElement.src;
            lightbox.style.display = 'flex';
        });
    });
}

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1;
        fetchImages(currentQuery, currentPage);
    }
});

showMoreBtn.addEventListener('click', () => {
    currentPage++;
    fetchImages(currentQuery, currentPage);
});

fetchImages(currentQuery, currentPage);

