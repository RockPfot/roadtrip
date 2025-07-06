// Use custom image as map background
const imageUrl = 'map.jpg';
const imageWidth = 1020;
const imageHeight = 1755;

const imageBounds = [[0, 0], [imageHeight, imageWidth]];

const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2
});

L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);

// Define photo markers with image coordinates
const photoLocations = [
  {
    x: 314,
    y: 1299,
    photo: "photos/TireChange3.jpg",
    title: "Stop 1"
  },
  {
    x: 500,
    y: 300,
    photo: "photos/photo2.jpg",
    title: "Stop 2"
  }
];

// Create mobile-friendly modal
const modal = document.createElement('div');
modal.id = 'image-modal';
modal.style.cssText = `
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.85);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 10px;
`;

modal.innerHTML = `
  <img id="modal-img" src="" style="
    max-width: 100%;
    max-height: 100%;
    box-shadow: 0 0 20px rgba(0,0,0,0.6);
    border-radius: 8px;
    transition: transform 0.2s ease-in-out;
  ">
  <div style="
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 28px;
    color: white;
    cursor: pointer;
    z-index: 1001;
  " onclick="closeImageModal()">×</div>
`;

document.body.appendChild(modal);

// Dismiss modal by tapping background or ×
modal.addEventListener('click', (e) => {
  if (e.target.id === 'image-modal') {
    modal.style.display = 'none';
  }
});

// Modal control functions
window.showImageModal = function(url) {
  const modalImg = document.getElementById('modal-img');
  modalImg.src = url;
  modal.style.display = 'flex';
};

window.closeImageModal = function() {
  modal.style.display = 'none';
};

// Load markers from markers.json
fetch('markers.json')
  .then(res => res.json())
  .then(photoLocations => {
    photoLocations.forEach(loc => {
      L.marker([loc.y, loc.x], { icon: circleIcon })
        .addTo(map)
        .bindPopup(`
          <strong>${loc.title}</strong><br>
          <em>${loc.description}</em><br>
          <img src="${loc.photo}" width="100" style="cursor: pointer;" onclick="showImageModal('${loc.photo}')">
        `);
    });
  })
  .catch(err => console.error("Error loading markers:", err));
  

const circleIcon = L.divIcon({
  className: 'custom-circle-icon',
  iconSize: [8, 8],       // Size of the circle
  iconAnchor: [4, 4],       // Centered anchor
  popupAnchor: [0, -8]      // Popup opens just above
});

// Add markers to the map
photoLocations.forEach(loc => {
L.marker([loc.y, loc.x], { icon: circleIcon })
  .addTo(map)
  .bindPopup(`
    <strong>${loc.title}</strong><br>
    <img src="${loc.photo}" width="100" style="cursor: pointer;" onclick="showImageModal('${loc.photo}')">
  `);
});