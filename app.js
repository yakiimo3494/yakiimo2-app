document.getElementById('sales-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const product = form.product.value;
  const quantity = parseInt(form.quantity.value);
  const amount = parseInt(form.amount.value);
  const gender = form.gender.value;

  // 位置情報取得
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;

    // 気温取得
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    const weatherData = await weatherRes.json();
    const temperature = weatherData.main.temp;

    // ダミー販売回数カウント（本来は履歴照合）
    const location_sales_count = Math.floor(Math.random() * 10);

    const payload = {
      product, quantity, amount, gender,
      latitude, longitude, temperature, location_sales_count
    };

    // Google Sheetsへ送信
    const res = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      document.getElementById('status').textContent = "✅ 記録完了！";
    } else {
      document.getElementById('status').textContent = "⚠️ 記録に失敗しました";
    }
  }, () => {
    document.getElementById('status').textContent = "⚠️ 位置情報が取得できません";
  });
});
