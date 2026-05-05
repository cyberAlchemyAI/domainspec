import { createPlayer } from "../application/create-player.use-case";

export async function postPlayersController(payload: unknown) {
  return createPlayer(payload);
}
