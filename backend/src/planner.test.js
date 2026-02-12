const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateTripCost } = require('./planner');

test('calculates trip totals and per traveler cost', () => {
  const result = calculateTripCost({
    destination: 'Tokyo',
    travelers: 2,
    days: 5,
    transport: 1200,
    accommodationPerNight: 160,
    foodPerDayPerPerson: 45,
    activities: 400,
    misc: 100,
    contingencyPercent: 10
  });

  assert.equal(result.breakdown.accommodation, 800);
  assert.equal(result.breakdown.food, 450);
  assert.equal(result.subtotal, 2950);
  assert.equal(result.breakdown.contingency, 295);
  assert.equal(result.total, 3245);
  assert.equal(result.costPerTraveler, 1622.5);
});

test('handles invalid input with safe minimums', () => {
  const result = calculateTripCost({
    travelers: 0,
    days: -2,
    accommodationPerNight: '80',
    foodPerDayPerPerson: '20'
  });

  assert.equal(result.travelers, 1);
  assert.equal(result.days, 1);
  assert.equal(result.total, 100);
});
