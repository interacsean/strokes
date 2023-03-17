import { prevHole } from "./prevHole";

const updateCourseState = jest.fn();

describe("usecases/prevHole", () => {
  test("Increments hole number", () => {
    const originalState = { currentHoleNum: 10 };

    prevHole(updateCourseState);

    const courseStateUpdater = updateCourseState.mock.calls[0][0];
    const newState = courseStateUpdater(originalState);

    expect(newState).toEqual({ currentHoleNum: 9 });
  });

  test("Can't go lower than 1", () => {
    const originalState = { currentHoleNum: 1 };

    prevHole(updateCourseState);

    const courseStateUpdater = updateCourseState.mock.calls[0][0];
    const newState = courseStateUpdater(originalState);

    expect(newState).toEqual({ currentHoleNum: 1 });
  });
});
