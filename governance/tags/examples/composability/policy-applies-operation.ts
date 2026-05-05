export function retryPolicy(attempt: number): "retry" | "stop" {
  return attempt < 3 ? "retry" : "stop";
}

export function retryPayment(attempt: number): { decision: "retry" | "stop" } {
  const decision = retryPolicy(attempt);
  return { decision };
}
