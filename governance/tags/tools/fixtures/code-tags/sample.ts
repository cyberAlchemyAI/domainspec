/**
 * domainspec:
 *   concept:
 *     id: payment.MaxAmountRule
 *     type: Rule
 *     concern: biz
 *     spec_ref:
 *       path: docs/features/payments/SPEC.md
 *       line: 7
 *       section: Concept Registry
 *   edges:
 *     - edge: enforces
 *       to: payment.ProcessPayment
 */
export function maxAmountRule(amount: number, limit: number): boolean {
  return amount <= limit;
}

/**
 * domainspec:
 *   concept:
 *     id: ui.payment.useCreatePayment
 *     type: Binding
 *     concern: sys
 *     spec_ref:
 *       path: docs/features/payments/SPEC.md
 *       line: 10
 *       section: Concept Registry
 *   edges:
 *     - edge: mutates
 *       to: payment.ProcessPayment
 */
export async function useCreatePayment(
  apiClient: { post: (path: string, body: unknown) => Promise<unknown> },
  payload: unknown,
) {
  return apiClient.post("/payments", payload);
}
