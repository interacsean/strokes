import { Hole } from "interfaceAdaptorsLayer/usecaseLayer/entityLayer/entities/Hole";

export function createHole(holeNum: number) {
  return new Hole({ holeNum });
}
