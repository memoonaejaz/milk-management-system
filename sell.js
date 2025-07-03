// js/sell.js

const form = document.getElementById('sellForm');
const msgBox = document.getElementById('msgBox');
const currentPriceEl = document.getElementById('currentPrice'); // ✅ Correct ID
const newPriceInput = document.getElementById('newPrice');

let currentSellingPrice = 0;
const SETTINGS_API = 'http://localhost:3000/settings/1';

// Load current selling price from settings
function loadSellingPrice() {
  fetch(SETTINGS_API)
    .then(res => res.json())
    .then(data => {
      currentSellingPrice = data.sellingPrice;
      if (currentPriceEl) {
        currentPriceEl.innerText = `Rs. ${currentSellingPrice}`;
      }
    })
    .catch(err => {
      console.error('Error loading selling price:', err);
      currentSellingPrice = 140; // fallback price
    });
}

// Handle form submission for sale entry
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const customer = document.getElementById('customer').value;
  const quantity = parseFloat(document.getElementById('quantity').value);
  const date = document.getElementById('date').value;

  if (!customer || !quantity || !date) {
    msgBox.innerHTML = '<div class="alert alert-warning">Please fill all fields.</div>';
    return;
  }

  const saleData = {
    customer,
    quantity,
    rate: currentSellingPrice,
    date
  };

  fetch('http://localhost:3000/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saleData)
  })
    .then(response => {
      if (response.ok) {
        msgBox.innerHTML = '<div class="alert alert-success">✅ Sale saved successfully!</div>';
        form.reset();
      } else {
        throw new Error('Failed to save sale.');
      }
    })
    .catch(error => {
      msgBox.innerHTML = `<div class="alert alert-danger">❌ ${error.message}</div>`;
    });
});

// Allow admin to update the selling price
function updateSellingPrice() {
  const newPrice = parseFloat(newPriceInput.value);

  if (!newPrice || isNaN(newPrice)) {
    alert('❗ Please enter a valid number');
    return;
  }

  fetch(SETTINGS_API, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sellingPrice: newPrice })
  })
    .then(res => {
      if (res.ok) {
        alert('✅ Price updated successfully');
        loadSellingPrice(); // reload updated price
        newPriceInput.value = ''; // optional: clear input field
      } else {
        throw new Error('Failed to update price');
      }
    })
    .catch(err => {
      alert('❌ ' + err.message);
    });
}

// Load price on page load
loadSellingPrice();
