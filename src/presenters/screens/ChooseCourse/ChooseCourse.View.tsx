import { Button, Container, Flex, Text } from "@chakra-ui/react";
import { Course, CourseDef } from "model/Course";
import { Stroke } from "model/Stroke";
import { RoutePaths } from "presenters/routes/RoutePaths";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type ChooseCourseViewProps = {
  courses: CourseDef[];
  setCourse: (course: Course) => void;
  newCourse: () => Course;
  hasIncompleteCourse: boolean;
};

function useChooseCourseViewLogic(props: ChooseCourseViewProps) {
  const navigate = useNavigate();

  const { setCourse } = props;

  const selectCourse = useCallback(
    (courseDef: CourseDef) => {
      const course = {
        ...courseDef,
        currentHoleNum: 1,
        timePlayed: Date.now(),
        holes: courseDef.holes.map((holeDef) => ({
          // todo: move to Hole model
          ...holeDef,
          strokes: [] as Stroke[],
          teePlayed: undefined,
          pinPlayed: undefined,
          completed: false,
        })),
      };
      setCourse(course);
      navigate(RoutePaths.Hole);
    },
    [setCourse, navigate]
  );
  const continueRound = useCallback(() => {
    navigate(RoutePaths.Hole);
  }, [navigate]);

  return {
    selectCourse,
    continueRound,
  };
}

export function ChooseCourseView(props: ChooseCourseViewProps) {
  const viewLogic = useChooseCourseViewLogic(props);

  return (
    <Container>
      <Text variant="heading">Select course</Text>
      <Flex flexDir="column" alignItems="flex-start">
        {props.hasIncompleteCourse && (
          <>
            <Button variant="link" py={3} onClick={viewLogic.continueRound}>
              Continue round...
            </Button>
            <hr />
          </>
        )}
        <Button
          variant="link"
          py={3}
          onClick={() => viewLogic.selectCourse(props.newCourse())}
        >
          New course
        </Button>
        {props.courses.map((course) => (
          <Button
            key={course.courseName}
            variant="link"
            py={3}
            onClick={() => viewLogic.selectCourse(course)}
          >
            {course.courseName}
          </Button>
        ))}
      </Flex>
    </Container>
  );
}
