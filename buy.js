// js/buy.js
const form = document.getElementById('buyForm');
const msgBox = document.getElementById('msgBox');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const supplier = document.getElementById('supplier').value;
  const quantity = parseFloat(document.getElementById('quantity').value);
  const rate = parseFloat(document.getElementById('rate').value);
  const date = document.getElementById('date').value;

  const purchaseData = { supplier, quantity, rate, date };

  fetch('http://localhost:3000/purchases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(purchaseData)
  })
  .then(response => {
    if (response.ok) {
      msgBox.innerHTML = '<div class="alert alert-success">Purchase saved successfully!</div>';
      form.reset();
    } else {
      throw new Error('Failed to save purchase.');
    }
  })
  .catch(error => {
    msgBox.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  });
});
