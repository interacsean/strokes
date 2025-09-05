export function downloadAsFile(content: string, filename: string, mimeType = 'application/json'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCourseAsJSON(courseData: any, courseName = 'course'): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${courseName}-${timestamp}.json`;
  const content = JSON.stringify(courseData, null, 2);
  
  downloadAsFile(content, filename);
}