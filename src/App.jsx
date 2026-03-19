import React, { useRef, useState, useEffect } from "react";
import { predict, computeGroupStats } from "../lib/engine";
import "./styles.css";

const initialClasses = {
  red: [],
  blue: [],
};

export default function App() {
  const [classes, setClasses] = useState(initialClasses);
  const [currentClass, setCurrentClass] = useState("red");
  const [stats, setStats] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.entries(classes).forEach(([cls, points]) => {
      ctx.fillStyle = cls;
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  }, [classes]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.shiftKey) {
      const predicted = predict([x, y], classes) || currentClass;
      setClasses((prev) => ({
        ...prev,
        [predicted]: [...prev[predicted], { x, y }],
      }));
    } else {
      setClasses((prev) => ({
        ...prev,
        [currentClass]: [...prev[currentClass], { x, y }],
      }));
    }
  };

  const handleClear = () => {
    setClasses(initialClasses);
    setStats(null);
  };

  const handleUpdateStats = () => {
    setStats(computeGroupStats(classes));
  };

  return (
    <div className="app-root">
      <div className="controls">
        <label htmlFor="classSelector">Select Class:</label>
        <select
          id="classSelector"
          value={currentClass}
          onChange={(e) => setCurrentClass(e.target.value)}
        >
          <option value="red">Red</option>
          <option value="blue">Blue</option>
        </select>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUpdateStats}>Update stats</button>
      </div>
      <span className="hint">(Shift + Click to predict)</span>

      <canvas
        ref={canvasRef}
        id="canvas"
        width={400}
        height={400}
        className="canvas"
        onClick={handleClick}
      />
      {stats && (
        <div className="stats">
          {["red", "blue"].map((cls) => {
            const s = stats[cls];
            if (!s) return null;
            return (
              <div key={cls} className="stats-card">
                <div className="stats-card-header">
                  <span className={`dot dot-${cls}`} />
                  <span className="stats-class-name">{cls}</span>
                  <span className="stats-count">{s.count} pts</span>
                </div>
                {s.count === 0 ? (
                  <div className="stats-empty">No points yet</div>
                ) : (
                  <div className="stats-grid">
                    <div className="axis-col">
                      <div className="axis-label">x</div>
                      <div className="metric-row">
                        <span className="metric-label">mean</span>
                        <span className="metric-value">
                          {s.x.mean.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">var</span>
                        <span className="metric-value">
                          {s.x.variance.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">min</span>
                        <span className="metric-value">
                          {s.x.min.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">max</span>
                        <span className="metric-value">
                          {s.x.max.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="axis-col">
                      <div className="axis-label">y</div>
                      <div className="metric-row">
                        <span className="metric-label">mean</span>
                        <span className="metric-value">
                          {s.y.mean.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">var</span>
                        <span className="metric-value">
                          {s.y.variance.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">min</span>
                        <span className="metric-value">
                          {s.y.min.toFixed(2)}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">max</span>
                        <span className="metric-value">
                          {s.y.max.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
