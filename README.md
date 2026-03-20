# stdlib-showcase

Interactive canvas demo using the [`@stdlib`](https://github.com/stdlib-js/stdlib) statistics utilities.

## Prerequisites

- Node.js 18+ (recommended)
- npm (comes with Node)

You can check your versions with:

```bash
node -v
npm -v
```

## Install dependencies

From the project root:

```bash
npm install
```

## Run the app locally

Start the Vite dev server:

```bash
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173/`).

### How to use the UI

- Use the **select box** to pick a class: `red` or `blue`.
- **Click** on the canvas to add a point for the selected class.
- **Shift+Click** to let the Gaussian Naive Bayes model predict the class and plot the point in that color.
- Press **Clear** to reset all points.
- Press **Update stats** to recompute and display, for each class:
  - mean, variance, min, and max of the `x` and `y` coordinates.
