let canvas = document.createElement('canvas')
canvas.setAttribute('id', 'canvas')
canvas.width = 900
canvas.height = 600
document.body.appendChild(canvas)
const ctx = canvas.getContext("2d")

const gravity = 0.5
let velocity = 0
let isPlaying = false
let animationId = null
let pipeIntervalId = null

const bird = {
  x: 25,
  y: canvas.height / 2,
  w: 30,
  h: 30,
  color: "#ebe834"
}

function drawBird(x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

function drawPipe(x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

let points = 0

function collision() {
  for (let pipe of pipes) {
    if (pipe.type == "up" && !pipe.passed) {
      if ((bird.y < pipe.h && (bird.x + bird.w > pipe.x)) && (bird.y < pipe.h && (bird.x < pipe.x + pipe.w))) {
        return true
      }
    } else if (pipe.type == "down" && !pipe.passed) {
      if ((bird.y + bird.h > pipe.y && (bird.x + bird.w > pipe.x)) && (bird.y + bird.h > pipe.y && (bird.x < pipe.x + pipe.w))) {
        return true
      }
    }
    if (!pipe.passed && bird.x > pipe.x + pipe.w) {
      pipe.passed = true
      if (pipe.type == "up") points++ // Just add a point one time, and not 2 times (_for the up / bottom pipe)
    }
  }
    return false
}

// Set jump bind on [SPACE] key
document.addEventListener("keydown", function(e) {
  if (e.code == "Space") {
    velocity = -10
    if (!isPlaying) {
      isPlaying = true
      startGame()
    }
  }
})

const pipeSpace = 200
let pipesCreated = 0
let pipes = []

function update() {
  velocity += gravity
  bird.y += velocity

  if (bird.y >= canvas.height - bird.h || collision()) {
    bird.y = canvas.height / 2
    velocity = 0
    stopGame()
    return
  }

  for (let pipe of pipes) {
    pipe.x -= 2
  }

  pipes = pipes.filter(pipe => pipe.x + pipe.w > 0)
}

function createPipe() {
  let pipeTop = {
    id: "up_" + pipesCreated,
    type: "up",
    x: canvas.width - 40,
    y: 0,
    w: 40,
    h: Math.abs(Math.floor(Math.random() * canvas.height - pipeSpace)),
    color: "#4feb3b",
    passed: false
  }

  let pipeBottom = {
    id: "down_" + pipesCreated,
    type: "down",
    x: canvas.width - 40,
    y: pipeTop.h + pipeSpace,
    w: 40,
    h: canvas.height - (pipeTop.h + pipeSpace),
    color: "#4feb3b",
    passed: false
  }

  pipes.push(pipeTop, pipeBottom)
}


function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawBird(bird.x, bird.y, bird.w, bird.h, bird.color)

  for (let pipe of pipes) {
    drawPipe(pipe.x, pipe.y, pipe.w, pipe.h, pipe.color)
  }

  ctx.font = '50px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(`${points}`, canvas.width / 2, 50);
}

function gameLoop() {
  if (!isPlaying) return

  render()
  update()
  animationId = requestAnimationFrame(gameLoop)
}

function startGame() {
  points = 0
  pipes = []
  pipeIntervalId = setInterval(createPipe, 2000)
  gameLoop()
}

function stopGame() {
  isPlaying = false
  clearInterval(pipeIntervalId)
  cancelAnimationFrame(animationId)
}

render()