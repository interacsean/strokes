import { LatLng } from "model/LatLng";
import { selectApproachPosFromHole } from "./approachPos";
import { offsetPosition } from "usecases/hole/offsetPosition";

const pin: LatLng = { lat: -37.84617, lng: 144.85943, alt: null };
const tee = offsetPosition(pin, 0, 400);
/** The apex of the dogleg, and a marker further back down the fairway. */
const apex = offsetPosition(pin, 20, 220);
const fairway = offsetPosition(pin, 10, 330);

const hole = {
  teePlayed: undefined,
  tees: { tee: { par: 5, nominalDistance: 438, pos: tee } },
  pinPlayed: undefined,
  pins: { pin },
  waypoints: [fairway, apex],
};

describe("selectApproachPosFromHole", () => {
  it("takes the last waypoint before the green", () => {
    expect(selectApproachPosFromHole(hole)).toEqual(apex);
  });

  it("finds it wherever it sits in the list", () => {
    expect(
      selectApproachPosFromHole({ ...hole, waypoints: [apex, fairway] })
    ).toEqual(apex);
  });

  it("approaches a hole with no waypoints from its tee", () => {
    expect(selectApproachPosFromHole({ ...hole, waypoints: [] })).toEqual(tee);
    expect(
      selectApproachPosFromHole({ ...hole, waypoints: undefined })
    ).toEqual(tee);
  });

  it("ignores a waypoint sitting on the pin, which says nothing about the line in", () => {
    expect(
      selectApproachPosFromHole({ ...hole, waypoints: [{ ...pin }] })
    ).toEqual(tee);
  });

  it("ignores waypoints missing a coordinate", () => {
    expect(
      selectApproachPosFromHole({
        ...hole,
        waypoints: [{ lat: apex.lat }, fairway],
      })
    ).toEqual(fairway);
  });

  it("has nothing to go on without a hole", () => {
    expect(selectApproachPosFromHole(null)).toBeNull();
  });
});
