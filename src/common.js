let paper

function setup_raphael () {
  paper = Raphael('big')
}

function dist (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
}

function clamp (value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export {paper,
        setup_raphael,
        dist,
        clamp}
