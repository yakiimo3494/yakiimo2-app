function initMap(lat, lon) {
  const mapContainer = document.getElementById('map');

  // 🔧 地図初期化済みならいったんリセット（Leafletの仕様対策）
  if (mapContainer._leaflet_id != null) {
    mapContainer.innerHTML = "";  // DOMクリア
  }

  const map = L.map('map').setView([lat, lon], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map).bindPopup("現在地").openPopup();

  // 販売履歴マッピング（record.csvから）
  fetch("data/record.csv")
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\\n").slice(1);
      rows.forEach(row => {
        const cols = row.split(",");
        const [_, product, quantity, amount, gender, latitude, longitude] = cols;
        if (!latitude || !longitude) return;
        const msg = `${product} (${quantity}個) ¥${amount} / ${gender}`;
        L.marker([parseFloat(latitude), parseFloat(longitude)]).addTo(map).bindPopup(msg);
      });
    });
}
