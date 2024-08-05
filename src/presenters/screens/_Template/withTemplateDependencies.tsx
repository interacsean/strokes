import { FC } from "react";
import { TemplateView, TemplateViewProps } from "./Template.View";

type TemplatePublicProps = {};

export function withTemplateDependencies(HoleView: FC<TemplateViewProps>) {
  return function Hole(_props: TemplatePublicProps) {
    const viewProps: TemplateViewProps = {};

    return (
      <>
        <TemplateView {...viewProps} />
      </>
    );
  };
}
