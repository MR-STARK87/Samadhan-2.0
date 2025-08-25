const studentMarks = {
  math: 85,
  science: 90,
  english: 78,
  history: 88,
  computer: 95
};


function calculateMarks(marks) {
  const values = Object.values(marks);
  const total = values.reduce((sum, mark) => sum + mark, 0);
  const average = total / values.length;

  console.log("Total Marks:", total);
  console.log("Average Marks:", average);
}

calculateMarks(studentMarks);
