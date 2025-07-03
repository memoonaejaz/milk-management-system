// Updated report.js with working edit/delete buttons and correct "Today" default filter

const PURCHASE_API = 'http://localhost:3000/purchases';
const SALE_API = 'http://localhost:3000/sales';

const purchaseTable = document.getElementById('purchaseTable');
const saleTable = document.getElementById('saleTable');
const totalCostEl = document.getElementById('totalCost');
const totalIncomeEl = document.getElementById('totalIncome');
const profitEl = document.getElementById('profit');
const purchasedLitersEl = document.getElementById('purchasedLiters');
const soldLitersEl = document.getElementById('soldLiters');

let allPurchases = [], allSales = [];
let milkChart = null;

function loadReports() {
  Promise.all([
    fetch(PURCHASE_API).then(res => res.json()),
    fetch(SALE_API).then(res => res.json())
  ]).then(([purchases, sales]) => {
    allPurchases = purchases;
    allSales = sales;
    applyDefaultTodayFilter();
  });
}

function applyDefaultTodayFilter() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  document.getElementById('reportType').value = 'daily';
  document.getElementById('startDate').valueAsDate = today;
  document.getElementById('endDate').valueAsDate = today;
  filterRecords();
}

function renderTables(purchases, sales) {
  let totalCost = 0, totalIncome = 0, totalPurchased = 0, totalSold = 0;

  purchaseTable.innerHTML = '';
  purchases.forEach(item => {
    const totalPrice = item.quantity * item.rate;
    totalPurchased += item.quantity;
    totalCost += totalPrice;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.supplier}</td>
      <td>${item.quantity}</td>
      <td>${item.rate}</td>
      <td>${totalPrice}</td>
      <td>${item.date}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn" data-type="purchases" data-id="${item.id}">✏️</button>
        <button class="btn btn-sm btn-danger delete-btn" data-type="purchases" data-id="${item.id}">🗑️</button>
        <button class="btn btn-sm btn-secondary" onclick="printSingleRecord('Purchase', '${item.supplier}', ${item.quantity}, ${item.rate}, '${item.date}')">🖨️</button>
      </td>`;
    purchaseTable.appendChild(row);
  });

  saleTable.innerHTML = '';
  sales.forEach(item => {
    const totalPrice = item.quantity * item.rate;
    totalSold += item.quantity;
    totalIncome += totalPrice;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.customer}</td>
      <td>${item.quantity}</td>
      <td>${item.rate}</td>
      <td>${totalPrice}</td>
      <td>${item.date}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn" data-type="sales" data-id="${item.id}">✏️</button>
        <button class="btn btn-sm btn-danger delete-btn" data-type="sales" data-id="${item.id}">🗑️</button>
        <button class="btn btn-sm btn-secondary" onclick="printSingleRecord('Sale', '${item.customer}', ${item.quantity}, ${item.rate}, '${item.date}')">🖨️</button>
      </td>`;
    saleTable.appendChild(row);
  });

  totalCostEl.innerText = totalCost;
  totalIncomeEl.innerText = totalIncome;
  profitEl.innerText = totalIncome - totalCost;
  purchasedLitersEl.innerText = totalPurchased;
  soldLitersEl.innerText = totalSold;

  // Attach listeners after rendering
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => editRecord(btn.dataset.type, btn.dataset.id));
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteRecord(btn.dataset.type, btn.dataset.id));
  });
}

function editRecord(type, id) {
  const quantity = prompt('Enter new quantity:');
  const rate = prompt('Enter new rate:');
  if (quantity && rate) {
    fetch(`http://localhost:3000/${type}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: parseFloat(quantity), rate: parseFloat(rate) })
    }).then(() => loadReports());
  }
}

function deleteRecord(type, id) {
  if (confirm('Are you sure you want to delete this record?')) {
    fetch(`http://localhost:3000/${type}/${id}`, { method: 'DELETE' })
      .then(() => loadReports());
  }
}

function exportTableToCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  let csv = [];
  const headers = Array.from(table.rows[0].cells).slice(0, 5).map(cell => cell.innerText);
  csv.push(headers.join(","));

  for (let i = 1; i < table.rows.length; i++) {
    let row = Array.from(table.rows[i].cells).slice(0, 5).map(cell => '"' + cell.innerText + '"');
    csv.push(row.join(","));
  }

  const blob = new Blob([csv.join("\n")], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function filterRecords() {
  const reportType = document.getElementById('reportType').value;
  const searchName = document.getElementById('searchName').value.toLowerCase();
  const startInput = document.getElementById('startDate');
  const endInput = document.getElementById('endDate');

  let startDate = new Date();
  let endDate = new Date();

  if (reportType === 'daily') {
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
  } else if (reportType === 'weekly') {
    const today = new Date();
    const first = today.getDate() - today.getDay();
    startDate = new Date(today.setDate(first));
    endDate = new Date();
  } else if (reportType === 'monthly') {
    const today = new Date();
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else if (reportType === 'custom') {
    startDate = new Date(startInput.value);
    endDate = new Date(endInput.value);
    endDate.setHours(23, 59, 59, 999);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Please select valid custom date range");
      return;
    }
  }

  const filteredPurchases = allPurchases.filter(p => {
    const d = new Date(p.date);
    return d >= startDate && d <= endDate && (!searchName || p.supplier.toLowerCase().includes(searchName));
  });

  const filteredSales = allSales.filter(s => {
    const d = new Date(s.date);
    return d >= startDate && d <= endDate && (!searchName || s.customer.toLowerCase().includes(searchName));
  });

  renderTables(filteredPurchases, filteredSales);
  renderChart(filteredPurchases, filteredSales);
}

function renderChart(purchases, sales) {
  const totalPurchase = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const totalSale = sales.reduce((sum, s) => sum + s.quantity, 0);

  const ctx = document.getElementById('milkChart').getContext('2d');
  if (milkChart) milkChart.destroy();

  milkChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Purchased', 'Sold'],
      datasets: [{
        label: 'Milk Quantity (L)',
        data: [totalPurchase, totalSale],
        backgroundColor: ['#0d6efd', '#198754']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Milk Activity Overview' }
      }
    }
  });
}

function handleReportTypeChange() {
  const type = document.getElementById('reportType').value;
  const showRange = type === 'custom';
  document.getElementById('startDate').disabled = !showRange;
  document.getElementById('endDate').disabled = !showRange;
  filterRecords();
}

function printSingleRecord(type, name, qty, rate, date) {
  const win = window.open('', '', 'width=800,height=600');
  const total = qty * rate;
  win.document.write(`<h2>${type} Record</h2>`);
  win.document.write(`<p><strong>Name:</strong> ${name}</p>`);
  win.document.write(`<p><strong>Quantity:</strong> ${qty} L</p>`);
  win.document.write(`<p><strong>Rate:</strong> Rs. ${rate}</p>`);
  win.document.write(`<p><strong>Total:</strong> Rs. ${total}</p>`);
  win.document.write(`<p><strong>Date:</strong> ${date}</p>`);
  win.document.close();
  win.print();
}

loadReports();
