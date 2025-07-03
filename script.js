// Updated js/main.js with charts, toasts, and dark mode toggle

const PURCHASE_API = 'http://localhost:3000/purchases';
const SALE_API = 'http://localhost:3000/sales';
const SETTINGS_API = 'http://localhost:3000/settings/1'; // notice `/1`

const SELL_RATE = 140;

let totalPurchased = 0, totalSold = 0, cost = 0;

const toast = (msg, type = 'success') => {
  const toastBox = document.createElement('div');
  toastBox.className = `toast align-items-center text-white bg-${type} border-0 show position-fixed top-0 end-0 m-3`;
  toastBox.setAttribute('role', 'alert');
  toastBox.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${msg}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  document.body.appendChild(toastBox);
  setTimeout(() => toastBox.remove(), 3000);
};



fetch(PURCHASE_API)
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      totalPurchased += item.quantity;
      cost += item.quantity * item.rate;
    });
    document.getElementById('total-purchased').innerText = `${totalPurchased} L`;

    fetch(SALE_API)
      .then(res => res.json())
      .then(sales => {
        sales.forEach(sale => totalSold += sale.quantity);
        document.getElementById('total-sold').innerText = `${totalSold} L`;
        document.getElementById('inventory').innerText = `${totalPurchased - totalSold} L`;
        const income = totalSold * SELL_RATE;
        const profit = income - cost;
        document.getElementById('profit').innerText = `Rs. ${profit}`;

        renderChart(totalPurchased, totalSold);
      });
  });

function renderChart(purchased, sold) {
  const canvas = document.createElement('canvas');
  canvas.id = 'milkChart';
  document.querySelector('.container').appendChild(canvas);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Purchased', 'Sold'],
      datasets: [{
        label: 'Milk (Liters)',
        data: [purchased, sold],
        backgroundColor: ['#0d6efd', '#198754']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Milk Overview'
        }
      }
    }
  });
}
