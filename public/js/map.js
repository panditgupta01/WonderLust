const lat = listing.geometry.coordinates[1];
const lng = listing.geometry.coordinates[0];

const map = L.map("map").setView([lat, lng], 9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`
        <b>${listing.title}</b><br>
        ${listing.location}<br>
        <small>Exact location provided after booking.</small>
    `)
    .openPopup();