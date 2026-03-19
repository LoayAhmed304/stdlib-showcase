import mean from "@stdlib/stats/base/mean";
import variance from "@stdlib/stats/base/variance";
import min from "@stdlib/stats/base/min";
import max from "@stdlib/stats/base/max";
import sqrt from "@stdlib/math/base/special/sqrt";
import exp from "@stdlib/math/base/special/exp";
import empty from "@stdlib/ndarray/base/empty";
import numel from "@stdlib/ndarray/base/numel";

// Gaussian probability density function
function gaussianProb(x, meanVal, varVal) {
  // to avoid division by zero
  const safeVar = varVal === 0 ? 1e-6 : varVal;
  const denom = sqrt(2 * Math.PI * safeVar);
  const num = exp(-((x - meanVal) ** 2) / (2 * safeVar));
  return num / denom;
}

/**
 * predict
 * @param {[number, number]} point  [x, y]
 * @param {{ [cls: string]: Array<{x:number,y:number}> }} classData
 * @returns {string} best class label
 */
function predict(point, classData) {
  const [px, py] = point;

  let bestClass = "";
  let bestProb = -Infinity;

  let totalPoints = 0; // for priors
  for (const cls in classData) {
    totalPoints += classData[cls].length;
  }
  if (totalPoints === 0) {
    return "";
  }

  for (const cls in classData) {
    const points = classData[cls]; // Array<{x,y}>
    if (!points || points.length === 0) continue;

    const xs = empty("float64", [points.length], "row-major");
    const ys = empty("float64", [points.length], "row-major");
    for (let i = 0; i < points.length; i++) {
      xs.set(i, points[i].x);
      ys.set(i, points[i].y);
    }

    const meanX = mean(numel(xs.shape), xs.data, 1);
    const varX = variance(numel(xs.shape), 1, xs.data, 1);
    const meanY = mean(numel(ys.shape), ys.data, 1);
    const varY = variance(numel(ys.shape), 1, ys.data, 1);

    // P(x,y|class) = P(x|class) * P(y|class)
    const probX = gaussianProb(px, meanX, varX);
    const probY = gaussianProb(py, meanY, varY);

    // prior P(class) = points in class / total points
    const prior = points.length / totalPoints;
    const prob = probX * probY * prior;

    if (prob > bestProb) {
      bestProb = prob;
      bestClass = cls;
    }
  }

  return bestClass;
}

function computeGroupStats(classData) {
  const result = {};

  for (const cls in classData) {
    const points = classData[cls] || [];
    if (!points.length) {
      result[cls] = {
        count: 0,
        x: { mean: null, variance: null, min: null, max: null },
        y: { mean: null, variance: null, min: null, max: null },
      };
      continue;
    }

    const xs = empty("float64", [points.length], "row-major");
    const ys = empty("float64", [points.length], "row-major");
    for (let i = 0; i < points.length; i++) {
      xs.set(i, points[i].x);
      ys.set(i, points[i].y);
    }

    const xMean = mean(numel(xs.shape), xs.data, 1);
    const xVar = variance(numel(xs.shape), 1, xs.data, 1);
    const xMin = min(numel(xs.shape), xs.data, 1);
    const xMax = max(numel(xs.shape), xs.data, 1);

    const yMean = mean(numel(ys.shape), ys.data, 1);
    const yVar = variance(numel(ys.shape), 1, ys.data, 1);
    const yMin = min(numel(ys.shape), ys.data, 1);
    const yMax = max(numel(ys.shape), ys.data, 1);

    result[cls] = {
      count: points.length,
      x: {
        mean: xMean,
        variance: xVar,
        min: xMin,
        max: xMax,
      },
      y: {
        mean: yMean,
        variance: yVar,
        min: yMin,
        max: yMax,
      },
    };
  }

  return result;
}

export { predict, computeGroupStats };
