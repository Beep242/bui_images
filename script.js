const gallery = document.getElementById('gallery');

// Add your image IDs here
const images = [
    "9Xg5Q8d",
    "0cjxwbc",
    "8clv24q",
    "mkp8lur",
    "5z7y1t2",
    "dn7hyob",
    "o0avlmr",
    "yef7fdb",
    "lwsyijq",
    "yef7fdb"
];

// Populate gallery
images.forEach(id => {
    const img = document.createElement('img');
    img.src = "images/" + id + ".png";
    img.alt = id;
    gallery.appendChild(img);

    // Lightbox click
    img.addEventListener('click', () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
    });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.lightbox .close');

closeBtn.addEventListener('click', () => {
    lightbox.style.display = "none";
});

// Close on click outside image
lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.style.display = "none";
});
