/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : home.js
 * Created      : 2017-01-30
 * Author       : lee
 * *******************************************/

console.log(
`uid: ${sessionStorage.uid}
token: ${sessionStorage.token}
`);

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let x = 100, y = 300, sx = 0.2, sy = -0.4;
setInterval(function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(10,120);
    context.lineTo(10,180);
    context.lineTo(110,150);
    context.fill();
    context.beginPath();
    context.arc(x, y, 20, 0, 2*Math.PI, true);
    context.fill();
    x += sx;
    y += sy;
}, 1000/24);