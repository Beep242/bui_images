// List all image IDs in your repo
const images = [
    "9Xg5Q8d",
    "abcd1234",
    "example1",
    "example2"
];

const gallery = document.getElementById('gallery');

images.forEach(id => {
    const img = document.createElement('img');
    img.src = id + ".png"; // if images are in root, or "images/" + id + ".png"
    img.alt = id;
    gallery.appendChild(img);
});
