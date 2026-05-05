import { getPlayersOverview } from "../application/get-players-overview.query";

export async function getPlayersOverviewController(filter: unknown) {
  return getPlayersOverview(filter);
}
