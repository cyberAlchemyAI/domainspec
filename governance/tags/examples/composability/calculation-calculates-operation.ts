export function feeCalculation(amount: number): number {
  return Math.round(amount * 0.03 * 100) / 100;
}

export function processPayment(amount: number): { fee: number; total: number } {
  const fee = feeCalculation(amount);
  return {
    fee,
    total: amount + fee,
  };
}
