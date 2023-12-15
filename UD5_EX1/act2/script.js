let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function paintTable() {
  context.fillStyle = "#108acc";
  context.fillRect(0, 0, 850, 400);

  context.beginPath();
  context.lineWidth = 3;
  context.moveTo(425, 0);
  context.lineTo(425, 400);
  context.stroke();
}

function drawCircle(x, y) {
  context.beginPath();
  context.fillStyle = "white";
  context.arc(x, y, 10, 0, 2 * Math.PI);
  context.fill();
}

function clearCanvas() {
  canvas.width = canvas.width;
  paintTable();
}

function startAndStop() {
  let runAndStop = document.getElementById("runStop");

  runAndStop.addEventListener("click", (e) => {
    if (e.target.id == "run") {
      if (started == false) {
        started = true;
        let run = setInterval(function () {
          if (ballX > 840 || ballX < 10) {
            directionX *= -1;
          }

          if(ballY > 390 || ballY < 10){
            directionY *= -1;
          }

          ballX += directionX;
          ballY += directionY;
          clearCanvas();
          drawCircle(ballX, ballY);
        }, 35);
      }
    } else if(e.target.id == "stop"){
    }
  });
}

// Variables
var ballX = 60;
var ballY = 60;
var directionX = 2;
var directionY = 2;
var started = false;

paintTable();
drawCircle(ballX, ballY);
startAndStop();

// function run() {
//   let runAndStop = document.getElementById("runStop");

//   runAndStop.addEventListener('click', (e) => {
//     if (e.target.id == "run") {
//       console.log("Run");
//     }
//   });
// }
