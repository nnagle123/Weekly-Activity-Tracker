const habits = [
    "Attempt",
    "Open Houses",
    "Hand Written Cards",
    "Showings",
    "Exercise",
    "Gross Revenue (1=1000)"
  ];
  const weeks = 12;
  
  // Load saved data
  let habitData = JSON.parse(localStorage.getItem("habitData")) || habits.map(h => Array(weeks).fill(0));
  
  function saveData() {
    localStorage.setItem("habitData", JSON.stringify(habitData));
    updateChart();
  }
  
  function renderTable() {
    const container = document.getElementById("table-container");
    container.innerHTML = "";
  
    const table = document.createElement("table");
  
    // Header
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.appendChild(document.createElement("th")).textContent = "Week";
    for (let i = 1; i <= weeks; i++) {
      const th = document.createElement("th");
      th.textContent = i;
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);
  
    // Body
    const tbody = document.createElement("tbody");
    habits.forEach((habit, habitIndex) => {
      const row = document.createElement("tr");
      const label = document.createElement("td");
      label.textContent = habit;
      row.appendChild(label);
  
      for (let i = 0; i < weeks; i++) {
        const cell = document.createElement("td");
        cell.textContent = habitData[habitIndex][i];
        cell.addEventListener("click", (e) => {
          habitData[habitIndex][i] += e.ctrlKey ? -1 : 1;
          cell.textContent = habitData[habitIndex][i];
          saveData();
        });
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
  
    container.appendChild(table);
  }
  
  // Setup Chart.js
let chart;
function updateChart() {
  const labels = Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);
  const datasets = habits.map((habit, i) => {
    // Find the last non-zero entry in the habit's data
    const lastIndex = habitData[i].map((v, idx) => [v, idx])
      .filter(([v]) => v !== 0)
      .map(([, idx]) => idx)
      .pop() ?? -1;
  
    return {
      label: habit,
      data: habitData[i].slice(0, lastIndex + 1),
      borderColor: `hsl(${i * 60}, 70%, 50%)`,
      fill: false,
      tension: 0.2,
    };
  });

  if (chart) chart.destroy();

  const ctx = document.getElementById("habitChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ✅ These go at the end, not inside any function
renderTable();
updateChart();
