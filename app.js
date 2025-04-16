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
    initMap(latitude, longitude);

    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    const weatherData = await weatherRes.json();
    const temperature = weatherData.main.temp;

    const hour = new Date().getHours();
    const weekday = new Date().getDay();
    const location_sales_count = Math.floor(Math.random() * 10);

    // 売上予測
    const input = [temperature, hour, weekday];
    const predicted = await predictSales(input);
    document.getElementById('prediction').textContent = `📈 予測売上数：${predicted}個`;

    const payload = {
      product, quantity, amount, gender,
      latitude, longitude, temperature, location_sales_count
    };

    const res = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify(payload),
    mode: "no-cors"
    });

    if (res.ok) {
      document.getElementById('status').textContent = "✅ 記録完了！";
      form.reset();
    } else {
      document.getElementById('status').textContent = "⚠️ 記録に失敗しました";
    }
  }, () => {
    document.getElementById('status').textContent = "⚠️ 位置情報が取得できません";
  });
});
