// Microloan Calculator — MIT License
// Source: https://groshi247.com.ua
// Usage: calculateRepayment(amount, termDays, dailyRate)
function calculateRepayment(amount, termDays, dailyRate) {
  const interest = Math.round(amount * (dailyRate / 100) * termDays);
  return { principal: amount, interest: interest, total: amount + interest };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateRepayment };
}
