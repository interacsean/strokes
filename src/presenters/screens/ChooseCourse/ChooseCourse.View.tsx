import { Button, Container, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { Course, CourseDef } from "model/Course";
import { Stroke } from "model/Stroke";
import { RoutePaths } from "presenters/routes/RoutePaths";
import { JsonPasteModal } from "presenters/components/JsonPasteModal";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type ChooseCourseViewProps = {
  courses: CourseDef[];
  setCourse: (course: Course) => void;
  newCourse: () => Course;
  hasIncompleteCourse: boolean;
  loadCourseFromJson: (jsonString: string) => Course;
};

function useChooseCourseViewLogic(props: ChooseCourseViewProps) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setCourse, loadCourseFromJson } = props;

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

  const handleJsonSubmit = useCallback((jsonString: string) => {
    try {
      const course = loadCourseFromJson(jsonString);
      setCourse(course);
      navigate(RoutePaths.Hole);
    } catch (error) {
      console.error("Error loading course from JSON:", error);
    }
  }, [loadCourseFromJson, setCourse, navigate]);

  return {
    selectCourse,
    continueRound,
    handleJsonSubmit,
    isOpen,
    onOpen,
    onClose,
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
        <Button
          variant="link"
          py={3}
          onClick={viewLogic.onOpen}
        >
          Load from JSON...
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
      
      <JsonPasteModal
        isOpen={viewLogic.isOpen}
        onClose={viewLogic.onClose}
        onSubmit={viewLogic.handleJsonSubmit}
        title="Load Course from JSON"
        placeholder="Paste course JSON data here..."
      />
    </Container>
  );
}
