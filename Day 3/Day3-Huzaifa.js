const scores = {
  maths: 85,
  chemistry: 94,
  english: 91,
  physics: 96,
  hindi: 88,
};

function evaluateScores(subjects) {
  let sum = 0;
  let count = 0;

  for (const score of Object.values(subjects)) {
    sum += score;
    count++;
  }

  const mean = sum / count;

  console.log("Total Score:", sum);
  console.log("Average Score:", mean);
}

evaluateScores(scores);
