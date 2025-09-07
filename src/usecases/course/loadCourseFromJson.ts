import { Course } from "model/Course";

export const loadCourseFromJson = (jsonString: string): Course => {
  try {
    const parsedData = JSON.parse(jsonString);
    
    // Validate required fields
    if (!parsedData.courseName || !Array.isArray(parsedData.holes)) {
      throw new Error("Invalid course format: missing courseName or holes");
    }

    // Create a course with current timestamps and default values
    const course: Course = {
      courseName: parsedData.courseName,
      currentHoleNum: parsedData.currentHoleNum || 1,
      timePlayed: Date.now(),
      holes: parsedData.holes,
      ...(parsedData.historical !== undefined && { historical: parsedData.historical })
    };

    return course;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
    throw new Error("Failed to parse JSON: Unknown error");
  }
};

export default loadCourseFromJson;