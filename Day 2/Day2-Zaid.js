const marks = [88, 92, 79, 95, 85, 91];
let highest = marks[0];

for (let i = 1; i < marks.length; i++) {
  if (marks[i] > highest) {
    highest = marks[i];
  }
}

console.log("Highest marks:", highest);
