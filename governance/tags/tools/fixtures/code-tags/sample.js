/**
 * domainspec:
 *   concept:
 *     id: payment.ProcessPayment
 *     type: Operation
 *     concern: biz
 *     spec_ref:
 *       path: docs/features/payments/SPEC.md
 *       line: 8
 *       section: Concept Registry
 *   edges:
 *     - edge: produces
 *       to: payment.PaymentInitiated
 */
export async function processPayment(payload) {
  return { ok: true, payload };
}
