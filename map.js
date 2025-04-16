async function loadMap() {
  const map = L.map('map').setView([33.7641, 130.5214], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const res = await fetch("data/record.csv");
  const text = await res.text();
  const rows = text.trim().split("\n").slice(1);

  rows.forEach(row => {
    const cols = row.split(",");
    const lat = parseFloat(cols[5]);
    const lon = parseFloat(cols[6]);
    const product = cols[1];
    const quantity = cols[2];
    const temp = cols[7];
    const count = cols[8];
    if (!isNaN(lat) && !isNaN(lon)) {
      const popup = `<b>商品:</b> ${product}<br><b>個数:</b> ${quantity}<br><b>気温:</b> ${temp ?? "?"} ℃<br><b>販売回数:</b> ${count ?? "?"}`;
      L.marker([lat, lon]).addTo(map).bindPopup(popup);
    }
  });
}
loadMap();
