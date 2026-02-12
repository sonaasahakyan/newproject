const form = document.getElementById('trip-form');
const resultContainer = document.getElementById('result');
const submitButton = form.querySelector('button[type="submit"]');

const formatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD'
});

function asNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readPayload() {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  payload.travelers = asNumber(payload.travelers);
  payload.days = asNumber(payload.days);
  payload.transport = asNumber(payload.transport);
  payload.accommodationPerNight = asNumber(payload.accommodationPerNight);
  payload.foodPerDayPerPerson = asNumber(payload.foodPerDayPerPerson);
  payload.activities = asNumber(payload.activities);
  payload.misc = asNumber(payload.misc);
  payload.contingencyPercent = asNumber(payload.contingencyPercent);

  return payload;
}

function renderResult(data) {
  const rows = [
    ['Transport', data.breakdown.transport],
    ['Accommodation', data.breakdown.accommodation],
    ['Food', data.breakdown.food],
    ['Activities', data.breakdown.activities],
    ['Miscellaneous', data.breakdown.misc],
    ['Contingency', data.breakdown.contingency],
    ['Subtotal', data.subtotal],
    ['Total', data.total],
    ['Cost per traveler', data.costPerTraveler]
  ];

  resultContainer.innerHTML = `
    <h2>Plan Summary ${data.destination ? `for ${data.destination}` : ''}</h2>
    <p><strong>${data.travelers}</strong> traveler(s), <strong>${data.days}</strong> day(s)</p>
    <div class="result-grid">
      ${rows
        .map(([label, value]) => `
        <div class="result-item">
          <div>${label}</div>
          <strong>${formatter.format(value)}</strong>
        </div>
      `)
        .join('')}
    </div>
  `;

  resultContainer.classList.remove('hidden');
}

async function calculateAndRender() {
  const payload = readPayload();

  try {
    const response = await fetch('/api/plan/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Unable to calculate trip cost.');
    }

    const result = await response.json();
    renderResult(result);
  } catch (error) {
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `<p>${error.message}</p>`;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  await calculateAndRender();
});

form.addEventListener('input', async () => {
  submitButton.textContent = 'Recalculate Plan';
  await calculateAndRender();
});
