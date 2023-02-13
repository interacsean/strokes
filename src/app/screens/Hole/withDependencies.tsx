import { FC } from "react";
import { HoleVmProps } from "app/screens/Hole/Hole.View-Model";
import { StrokesModel } from "controllerLayer/usecaseLayer/entityLayer/Strokes/StrokesModel";

type HolePublicProps = {};

export function withDependencies(Component: FC<HoleVmProps>) {
  return (props: HolePublicProps) => <Component {...props} />;
}
