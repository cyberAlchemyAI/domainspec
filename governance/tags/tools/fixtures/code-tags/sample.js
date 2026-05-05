/**
 * domainspec:
 *   concept:
 *     id: payment.ProcessPayment
 *     type: Operation
 *     concern: biz
 *   edges:
 *     - edge: produces
 *       to: payment.PaymentInitiated
 */
export async function processPayment(payload) {
  return { ok: true, payload };
}
