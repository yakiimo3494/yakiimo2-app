async function drawChart() {
  const res = await fetch("data/record.csv");
  const text = await res.text();
  const rows = text.trim().split("\n").slice(1);
  
  const salesByWeekday = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

  rows.forEach(row => {
    const [timestamp, , quantity] = row.split(",");
    const date = new Date(timestamp);
    const weekday = date.toLocaleDateString("en-US", { weekday: 'short' });
    salesByWeekday[weekday] += parseInt(quantity);
  });

  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(salesByWeekday),
      datasets: [{
        label: "売上個数",
        data: Object.values(salesByWeekday),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "曜日別 売上個数" }
      }
    }
  });
}
drawChart();