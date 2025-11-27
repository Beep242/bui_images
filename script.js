const gallery = document.getElementById('gallery');

// Add your image IDs here
const images = [
    "0cjxwbc",
    "1fisdnx",
    "3gydznu",
    "4td3oxu",
    "7qmsuo2",
    "8clv24q",
    "9rur4ef",
    "9tsninv",
    "9xg5q8d",
    "40nynz6",
    "bimvada",
    "dn7hyob",
    "dy4zhm7",
    "ecackha",
    "eoqeadk",
    "gmycoos",
    "gqag3jm",
    "hx2vcku",
    "i3ryxml",
    "janp7ye",
    "krogzpn",
    "lgqluxe",
    "lwsyijq",
    "mgbtebf",
    "mkp8lur",
    "qtvh0qr",
    "srl54gk",
    "tamuwie",
    "ttfaqsv",
    "vgzrpd1",
    "xoyqidq",
    "xp1texq",
    "y3zh7d6",
    "yef7fdb",
    "check-mark",
    "price-tag",
    "sell-card",
    "skeleton-inside",
    "pencil-ruler",
    "door_cancel",
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
