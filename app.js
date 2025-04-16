document.getElementById('sales-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const product = form.product.value;
  const quantity = parseInt(form.quantity.value);
  const amount = parseInt(form.amount.value);
  const gender = form.gender.value;

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;

    // 気温取得
    let temperature = null;
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`);
      const data = await res.json();
      temperature = data.main?.temp ?? null;
    } catch (e) {
      console.warn("気温取得失敗", e);
    }

    const location_sales_count = await countNearbySales(latitude, longitude);
    const timestamp = new Date().toISOString();
    const row = [timestamp, product, quantity, amount, gender, latitude, longitude, temperature, location_sales_count];

    // CSVとして保存（ローカル用）
    const res = await fetch("data/record.csv");
    let csv = await res.text();
    csv += "\n" + row.join(",");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "record.csv"; a.click();
    URL.revokeObjectURL(url);

    document.getElementById('status').textContent = "✅ 記録完了";
    form.reset();
    loadMap(); // 再描画
  });
});
