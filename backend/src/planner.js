function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function calculateTripCost(plan) {
  const travelers = Math.max(1, Math.floor(toNumber(plan.travelers, 1)));
  const days = Math.max(1, Math.floor(toNumber(plan.days, 1)));

  const transport = toNumber(plan.transport);
  const accommodationPerNight = toNumber(plan.accommodationPerNight);
  const foodPerDayPerPerson = toNumber(plan.foodPerDayPerPerson);
  const activities = toNumber(plan.activities);
  const misc = toNumber(plan.misc);
  const contingencyPercent = Math.max(0, toNumber(plan.contingencyPercent));

  const accommodation = accommodationPerNight * days;
  const food = foodPerDayPerPerson * travelers * days;

  const subtotal = transport + accommodation + food + activities + misc;
  const contingency = subtotal * (contingencyPercent / 100);
  const total = subtotal + contingency;

  return {
    destination: plan.destination || "",
    travelers,
    days,
    breakdown: {
      transport,
      accommodation,
      food,
      activities,
      misc,
      contingency
    },
    subtotal,
    total,
    costPerTraveler: total / travelers
  };
}

module.exports = {
  calculateTripCost
};
