import { predict } from "./engine.js";

const classes = {
  red: [],
  blue: [],
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const classSelector = document.getElementById("classSelector");
const clearBtn = document.getElementById("clearBtn");

function drawPoint(p, cls) {
  ctx.fillStyle = cls;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
  ctx.fill();
}

canvas.addEventListener("click", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (e.shiftKey) {
    // predict if shift key is held
    const predicted = predict([x, y], classes);
    drawPoint({ x, y }, predicted);
  } else {
    const cls = classSelector.value;
    classes[cls].push({ x, y });
    drawPoint({ x, y }, cls);
  }
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const cls in classes) classes[cls] = [];
});
