let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

var sales = [
  {
    product: "Basketballs",
    units: 150,
  },
  {
    product: "Baseballs",
    units: 125,
  },
  {
    product: "Footballs",
    units: 300,
  },
];

context.save();

const grdOrange = context.createLinearGradient(50,50,200,0);
grdOrange.addColorStop(0, "orange");
grdOrange.addColorStop(1, "white");

context.fillStyle = grdOrange;
context.fillRect(140,150,75,140);

const grdBlue = context.createLinearGradient(90,80,300,0);
grdBlue.addColorStop(0, "blue");
grdBlue.addColorStop(1, "white");

context.fillStyle = grdBlue;
context.fillRect(250,170,75,120);

const grdRed = context.createLinearGradient(400,450,670,300)
grdRed.addColorStop(0,"red");
grdRed.addColorStop(1,"white");

context.fillStyle = grdRed;
context.fillRect(365,20,75,270);

context.beginPath();
context.lineWidth = 2;
context.fillStyle = "black";

context.moveTo(100,10);
context.lineTo(100,292);

// HORITZONTAL ARROW
context.lineTo(530,292);
context.moveTo(529,292);
context.lineTo(523,287);
context.moveTo(531,292);
context.lineTo(523,297)
// context.lineTo(525,286);
// context.moveTo(532,292);
// context.lineTo(525,298);

// VERTICAL ARROW
context.moveTo(101,10);
context.lineTo(96,14);
context.moveTo(99,10);
context.lineTo(104,14);
context.stroke();

context.font = "18px Comic Sans MS";
context.fillStyle = "Black";

context.fillText("Units", 30, 200);
context.fillText("Products", 250, 360);

sales.forEach((sales, index) =>{
  
  context.fillText(sales.product, 130 + (index * 120), 310);

});

// for(i = 0; i < sales.length; i++){
//   context.fillText(sales[i]["product"], 130 + (i * 120), 310);
// }
