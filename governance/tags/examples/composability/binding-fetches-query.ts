import { getPaymentStatus } from "../../backend/billing/get-payment-status.query";

export function usePaymentStatusBinding() {
  return async function fetch(filter: unknown) {
    return getPaymentStatus(filter);
  };
}
