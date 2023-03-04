import { nextHole } from "./nextHole"

const updateCourseState = jest.fn();

describe('usecases/nextHole', () => {
  test('Increments hole number', () => {
    const originalState = { currentHoleNum: 1 };

    nextHole(updateCourseState);
    
    const courseStateUpdater = updateCourseState.mock.calls[0][0];
    const newState = courseStateUpdater(originalState);

    expect(newState).toEqual({ currentHoleNum: 2 });  
  });

  test('Can\'t go higher than 18', () => {
    const originalState = { currentHoleNum: 18 };

    nextHole(updateCourseState);
    
    const courseStateUpdater = updateCourseState.mock.calls[0][0];
    const newState = courseStateUpdater(originalState);

    expect(newState).toEqual({ currentHoleNum: 18 });  
  });
})