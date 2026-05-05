import { applyMakeup } from "../application/apply-makeup.operation";
import { generateSettlement } from "../application/generate-settlement.operation";

export async function settlementWorkflow(input: unknown) {
  const settlement = await generateSettlement(input);
  await applyMakeup(settlement);
  return settlement;
}
