import { Button, Container, Text } from "@chakra-ui/react";
import { Course, CourseDef } from "model/Course";
import { Hole } from "model/Hole";
import { Stroke } from "model/Stroke";
import { RoutePaths } from "presenters/routes/RoutePaths";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type ChooseCourseViewProps = {
  courses: CourseDef[];
  setCourse: (course: Course) => void;
};

function useChooseCourseViewLogic(props: ChooseCourseViewProps) {
  const navigate = useNavigate();

  const selectCourse = useCallback(
    (courseDef: CourseDef) => {
      const course = {
        ...courseDef,
        currentHoleNum: 1,
        holes: courseDef.holes.map((holeDef) => ({
          // todo: move to Hole model
          ...holeDef,
          strokes: [] as Stroke[],
          teePlayed: undefined,
          pinPlayed: undefined,
          completed: false,
        })),
      };
      props.setCourse(course);
      navigate(RoutePaths.Hole);
    },
    [props.setCourse, navigate]
  );

  return {
    selectCourse,
  };
}

export function ChooseCourseView(props: ChooseCourseViewProps) {
  const viewLogic = useChooseCourseViewLogic(props);

  return (
    <Container>
      <Text variant="heading">Select course</Text>
      {props.courses.map((course) => (
        <Button
          variant="link"
          key={course.courseName}
          onClick={() => viewLogic.selectCourse(course)}
        >
          {course.courseName}
        </Button>
      ))}
    </Container>
  );
}
