const studentMarks = {
  math: 85,
  Chemistry: 94,
  english: 91,
  Physics: 96,
  Hindi: 88
};


function calculateMarks(marks) {
  const values = Object.values(marks);
  const total = values.reduce((sum, mark) => sum + mark, 0);
  const average = total / values.length;

  console.log("Total Marks:", total);
  console.log("Average Marks:", average);
}

calculateMarks(studentMarks);