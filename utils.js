function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function countNearbySales(lat, lon) {
  try {
    const res = await fetch("data/record.csv");
    const text = await res.text();
    const rows = text.trim().split("\n").slice(1);
    let count = 0;
    rows.forEach(row => {
      const cols = row.split(",");
      const rLat = parseFloat(cols[5]);
      const rLon = parseFloat(cols[6]);
      if (!isNaN(rLat) && !isNaN(rLon)) {
        const dist = haversineDistance(lat, lon, rLat, rLon);
        if (dist <= 0.2) count++;
      }
    });
    return count;
  } catch (e) {
    return 0;
  }
}
