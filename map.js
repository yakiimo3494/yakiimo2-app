function initMap(lat, lon) {
  const mapContainer = document.getElementById('map');
  if (mapContainer._leaflet_id) {
    mapContainer._leaflet_id = null;
  }

  const map = L.map('map').setView([lat, lon], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.marker([lat, lon]).addTo(map).bindPopup("現在地").openPopup();

  fetch("data/record.csv")
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").slice(1);
      rows.forEach(row => {
        const cols = row.split(",");
        const [_, product, quantity, amount, gender, latitude, longitude] = cols;
        if (!latitude || !longitude) return;
        const msg = `${product} (${quantity}個) ¥${amount} / ${gender}`;
        L.marker([parseFloat(latitude), parseFloat(longitude)]).addTo(map).bindPopup(msg);
      });
    });
}
