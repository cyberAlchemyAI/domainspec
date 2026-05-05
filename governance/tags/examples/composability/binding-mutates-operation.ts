import { createPayment } from "../../backend/billing/create-payment.operation";

export function useCreatePaymentBinding() {
  return async function mutate(payload: unknown) {
    return createPayment(payload);
  };
}
