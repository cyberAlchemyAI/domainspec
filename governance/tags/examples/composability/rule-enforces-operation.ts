export function maxAmountRule(amount: number, max: number): boolean {
  return amount <= max;
}

export function processPayment(amount: number): { ok: true } {
  if (!maxAmountRule(amount, 10000)) {
    throw new Error("MAX_AMOUNT_EXCEEDED");
  }

  return { ok: true };
}
