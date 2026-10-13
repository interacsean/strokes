import { setHolePar } from "./setHolePar";

const pos = { lat: -37.758, lng: 144.984, alt: null };

describe("setHolePar", () => {
  it("starts the default tee on a hole set up on the fly", () => {
    const setHoleAttr = jest.fn();
    setHolePar(setHoleAttr, { teePlayed: undefined, tees: {} }, 4);
    expect(setHoleAttr).toHaveBeenCalledWith({ tees: { tee: { par: 4 } } });
  });

  it("sets the par on the tee that already has a position", () => {
    const setHoleAttr = jest.fn();
    setHolePar(
      setHoleAttr,
      {
        teePlayed: undefined,
        tees: { white: { par: undefined, nominalDistance: 0, pos } },
      },
      5
    );
    expect(setHoleAttr).toHaveBeenCalledWith({ tees: { white: { par: 5 } } });
  });

  it("sets the par on the tee being played", () => {
    const setHoleAttr = jest.fn();
    setHolePar(
      setHoleAttr,
      {
        teePlayed: "blue",
        tees: {
          white: { par: 4, nominalDistance: 300, pos },
          blue: { par: 4, nominalDistance: 340, pos },
        },
      },
      3
    );
    expect(setHoleAttr).toHaveBeenCalledWith({ tees: { blue: { par: 3 } } });
  });

  it("keeps the par between 3 and 5", () => {
    const setHoleAttr = jest.fn();
    setHolePar(setHoleAttr, { teePlayed: undefined, tees: {} }, 7);
    expect(setHoleAttr).toHaveBeenCalledWith({ tees: { tee: { par: 5 } } });
  });
});
