const marks = [88, 92, 79, 95, 85, 91];
let highest = marks[0];

for (const mark of marks) {
  if (mark > highest) {
    highest = mark;
  }
}

console.log("Highest marks:", highest);
