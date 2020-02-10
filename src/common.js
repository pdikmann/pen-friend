let paper,
    button = { // keep track of buttons (for styling)
      erase: null,
      download: null,
      clear: null,
      guides: null
    }

function setup_raphael () {
  paper = Raphael('big')
}

function setup_button () {
  button.download = document.getElementById('download')
  button.clear = document.getElementById('clear')
  button.erase = document.getElementById('erase')
  button.guides = document.getElementById('guides')
}

function dist (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
}

function clamp (value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export {paper,
        setup_raphael,
        button,
        setup_button,
        dist,
        clamp}
