import React from "react";
import { holeReducer, initialHoleState } from "app/screens/Hole/reducer";
import { HoleView } from "app/screens/Hole/Hole.View";
import { StrokesModel } from "controllerLayer/usecaseLayer/entityLayer/Strokes/StrokesModel";

export type HoleVmProps = {
  hole: StrokesModel;
};

export function HoleViewModel(props: HoleVmProps) {
  const [state, dispatch] = React.useReducer(holeReducer, initialHoleState);

  const holeViewProps = {
    ...state,
    ...props,
  };

  return <HoleView {...holeViewProps} />;
}
