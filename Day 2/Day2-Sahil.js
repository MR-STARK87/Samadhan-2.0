const marks = [100, 92, 98, 76, 88, 91];
let highest = marks[0];

for (const mark of marks) {
  if (mark > highest) {
    highest = mark;
  }
}

console.log("Highest marks:", highest);
