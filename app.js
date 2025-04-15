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

    // 🌡 OpenWeatherMapで気温取得
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    const weatherData = await weatherRes.json();
    const temperature = weatherData.main.temp;

    const payload = {
      product, quantity, amount, gender,
      latitude, longitude, temperature,
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
        mode: "no-cors"
      });
      document.getElementById('status').textContent = `✅ 記録完了！気温: ${temperature}℃`;
      form.reset();
    } catch (error) {
      document.getElementById('status').textContent = "⚠️ 記録失敗：" + error.message;
    }
  }, () => {
    document.getElementById('status').textContent = "⚠️ 位置情報が取得できません";
  });
});
