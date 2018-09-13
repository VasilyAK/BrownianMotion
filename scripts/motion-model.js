var div_Canvas = document.getElementById('screen__canvas');
var canvas = document.getElementById('main-canvas');
var ctx = canvas.getContext('2d');

var cnv_Width = canvas.width = parseFloat(div_Canvas.style.width);
var cnv_Height = canvas.height = parseFloat(div_Canvas.style.height);

var arr_Ball =[];// массив содержит все объекты типа obj_Ball
function obj_Ball(x, y, X, Y, vx, vy, size, weight, color, mark) { //прототип частиц - шар с набором свойств
	this.x = x; //положение частицы в кадре
	this.y = y;
	this.X = X; // положение частицы в закадровом расчете
	this.Y = Y;
	this.vx = vx; // скорость частицы
	this.vy = vy;
	this.color = color; // цвет частицы
	this.size = size; // размер частицы
	this.weight = weight; // масса частицы
	this.mark = mark;
}

var coofEnlarg = 20; // коэффициент размера вектора скорости;
var heightTriangle = 6; // размер высоты треугольника стрелки в px
var baseTriangle = 8;	// размер основания треугольника стрелки в px


function obj_Br (x, y, X, Y, vx, vy, size, weight, color, mark){ // Броуновские частицы
	obj_Ball.call(x, y, X, Y, vx, vy, size, weight, color, mark);
}
obj_Br.prototype = Object.create(obj_Ball.prototype); 
obj_Br.prototype.contructor = obj_Br;

function obj_Gas (x, y, X, Y, vx, vy, size, weight, color, mark){// молекулы газа
	obj_Ball.call(x, y, X, Y, vx, vy, size, weight, color, mark);
}
obj_Gas.prototype = Object.create(obj_Ball.prototype);
obj_Gas.prototype.contructor = obj_Gas;

var requestId; // переменная для запуска анимацию
var perfAnim = true;// запустить/выключить анимацию


var arr_Br = [];// массив содержит все объекты типа obj_Br
function obj_Br (x, y, X, Y, vx, vy, size, weight, color, mark){ // Броуновские частицы
	obj_Ball.call(x, y, X, Y, vx, vy, size, weight, color, mark);
}
obj_Br.prototype = Object.create(obj_Ball.prototype); 
obj_Br.prototype.contructor = obj_Br;


var arr_Gas = [];// массив содержит все объекты типа obj_Gas
function obj_Gas (x, y, X, Y, vx, vy, size, weight, color, mark){// молекулы газа
	obj_Ball.call(x, y, X, Y, vx, vy, size, weight, color, mark);
}
obj_Gas.prototype = Object.create(obj_Ball.prototype);
obj_Gas.prototype.contructor = obj_Gas;


function random(min,max) {
	var num = Math.floor(Math.random()*(max-min)) + min;
	return num;
}

var T;
var coofSpeedGas;
var coofSizeGas;

var arrGasLength;
var nameGas;
var tmprGas;

var arrBrLength;
var sizeBr;
var weightBr;
var speedBr;

var count;

function loop() {
	cnv_Width = canvas.width = parseFloat(div_Canvas.style.width);
	cnv_Height = canvas.height = parseFloat(div_Canvas.style.height);
	
	if (arr_Ball.length<2) {
		var ballGas = new obj_Ball(
			100, // координата х
			100, // координата y
			0,
			0,
			500, // координата скорости vx
			500, //координата скорости vy
			5, // размер
			1, // масса
			'rgb(255, 255, 255)', // цвет
			false,
		);
		arr_Gas.push(ballGas);
		arr_Ball.push(ballGas);
	
		var ballBr = new obj_Ball(
			200, // координата х
			200, // координата y
			0,
			0,
			1, // координата скорости vx
			-1, //координата скорости vy
			40, // размер
			400, // масса
			'rgb(102, 124, 29)', // цвет
			false,
		);
		arr_Br.push(ballBr);
		arr_Ball.push(ballBr);
	}
	
	T = 1;
	if (arr_Collusion[0]>2 && countT == 1) { // если до столкновения больше 1го кадра, то вычисления не повторяются
		arr_Collusion[0] = arr_Collusion[0]-1;
	} else {	
		arr_CollusionPrew = [-1,-1];
		var countT = 0; //счетчик вычислений столкновений в кадре, необходим для правильной работы оптимизации четырмя строками выше
		while (T>0){
			countT++;
			fn_firstCollusionDetect();
			// преобразования ниже позволяют сделать столкновения красивыми, независимо от размеров тел
			if (arr_Collusion[0]<T || arr_Collusion[0]==false ){
				for (var k=0; k < arr_Ball.length; k++){
					if 	(arr_Ball[k].mark) {
						arr_Ball[k].X = arr_Ball[k].X+arr_Collusion[0]*arr_Ball[k].vx;
						arr_Ball[k].Y = arr_Ball[k].Y+arr_Collusion[0]*arr_Ball[k].vy;
					} else {
						arr_Ball[k].x = arr_Ball[k].x+arr_Collusion[0]*arr_Ball[k].vx;
						arr_Ball[k].y = arr_Ball[k].y+arr_Collusion[0]*arr_Ball[k].vy;
						arr_Ball[k].X = arr_Ball[k].x;
						arr_Ball[k].Y = arr_Ball[k].y;
					}
				}
				fn_collisionCalc(arr_Collusion[0],arr_Collusion[1],arr_Collusion[2]);
				arr_Ball[arr_Collusion[1]].mark = true;
				if (Number.isInteger(arr_Collusion[2])){
					arr_Ball[arr_Collusion[2]].mark = true;
				}
			}
			T = T - arr_Collusion[0];
		}
		
		if (!(T + arr_Collusion[0]>=0 && T + arr_Collusion[0]<1)) {
			T =1;
		} else {
			T = T + arr_Collusion[0];
		}
	}
	
	for (var i = 0; i < arr_Ball.length; i++) {
		if (arr_Ball[i].mark){
			arr_Ball[i].x=arr_Ball[i].X+T*arr_Ball[i].vx;
			arr_Ball[i].y=arr_Ball[i].Y+T*arr_Ball[i].vy;
			arr_Ball[i].mark = false;
		} else {
			arr_Ball[i].x=arr_Ball[i].x+T*arr_Ball[i].vx;
			arr_Ball[i].y=arr_Ball[i].y+T*arr_Ball[i].vy;
		}
	}
	
	
// определяет, какой шар вышел за границу canvas	
	count++
	for (var i=0; i<arr_Ball.length; i++) {
		if (arr_Ball[i].x>cnv_Width || arr_Ball[i].x<0 || arr_Ball[i].y>cnv_Height || arr_Ball[i].y<0 ){
			perfAnim = false;
			console.log("Шар № ",i," вышел за границу на ",count," шаге.");
		}
	}
	
	ctx.clearRect(0, 0, cnv_Width, cnv_Height);
	
	for (var i = 0; i < arr_Ball.length; i++) {
		arr_Ball[i].draw();
	}
		
	if (perfAnim && count>0) {
		requestId = requestAnimationFrame(loop);
	} else {
		cancelAnimationFrame(requestId);
	}
}

// МЕТОД draw отрисовка заданного объекта в canvas
obj_Ball.prototype.draw = function() { 
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	ctx.fill();
	
	// вектор скорости (отключить, если не надо)
	/*var x1 = this.x+coofEnlarg*this.vx;
	var y1 = this.y+coofEnlarg*this.vy;
	var dv = Math.sqrt(this.vx*this.vx+this.vy*this.vy);
	
	ctx.beginPath();
	ctx.strokeStyle = 'rgb(239, 247, 22)';;
	ctx.lineWidth = 2;
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(x1, y1);
	ctx.stroke();
	
	ctx.beginPath()
	ctx.fillStyle = 'rgb(239, 247, 22)';
	ctx.lineTo(x1-(heightTriangle*this.vx-(baseTriangle/2)*this.vy)/dv, y1-(heightTriangle*this.vy+(baseTriangle/2)*this.vx)/dv);
	ctx.lineTo(x1-(heightTriangle*this.vx+(baseTriangle/2)*this.vy)/dv, y1-(heightTriangle*this.vy-(baseTriangle/2)*this.vx)/dv);
	ctx.lineTo(x1, y1);
	ctx.fill();*/
}


// ФУНКЦИЯ fn_drawNewXOY отрисовывает новую систему координат относительно двух столкнувшихся шаров
// i,j - номера шаров для новой системы координат
function fn_drawNewXOY(i,j) {
	
	var vx = (arr_Ball[i].x-arr_Ball[j].x);
	var vy = (arr_Ball[i].y-arr_Ball[j].y);
	var dv = Math.sqrt(vx*vx+vy*vy);
	var x1 = -vy+arr_Ball[j].x;
	var y1 = vx+arr_Ball[j].y;
	
	ctx.beginPath();
	ctx.strokeStyle = 'rgb(89, 255, 130)';
	ctx.moveTo(arr_Ball[j].x,arr_Ball[j].y);
	ctx.lineTo(arr_Ball[i].x,arr_Ball[i].y);
	ctx.stroke();
		
	ctx.beginPath()
	ctx.fillStyle = 'rgb(89, 255, 130)';
	ctx.lineTo (arr_Ball[i].x-(heightTriangle*vx-(baseTriangle/2)*vy)/dv,arr_Ball[i].y-(heightTriangle*vy+(baseTriangle/2)*vx)/dv);
	ctx.lineTo (arr_Ball[i].x-(heightTriangle*vx+(baseTriangle/2)*vy)/dv,arr_Ball[i].y-(heightTriangle*vy-(baseTriangle/2)*vx)/dv);
	ctx.lineTo(arr_Ball[i].x,arr_Ball[i].y);
	ctx.fill();
	
	ctx.beginPath();
	ctx.strokeStyle = 'rgb(89, 255, 130)';
	ctx.moveTo(arr_Ball[j].x,arr_Ball[j].y);
	ctx.lineTo(x1,y1);
	ctx.stroke();
		
	ctx.beginPath()
	ctx.fillStyle = 'rgb(89, 255, 130)';
	ctx.lineTo (x1-(heightTriangle*(-vy)-(baseTriangle/2)*vx)/dv,y1-(heightTriangle*vx+(baseTriangle/2)*(-vy))/dv);
	ctx.lineTo (x1-(heightTriangle*(-vy)+(baseTriangle/2)*vx)/dv,y1-(heightTriangle*vx-(baseTriangle/2)*(-vy))/dv);
	ctx.lineTo(x1,y1);
	ctx.fill();
}


// ФУНКЦИЯ fn_TimeToCollisionBalls вычисляет время столкновения двух шаров
// (x1;y1), (x2;y2) координаты цетров шаров  
// (vx1;vy1), (vx2;vy2) координаты векторов скорости шаров
// r1, r2 радиусы шаров
var deltaS; // погрешность вычисления, чтобы шары не оказывались друг внутри друга
function fn_TimeToCollisionBalls(x1,y1,vx1,vy1,r1,x2,y2,vx2,vy2,r2){
	var t;
		
	var Sx = x1-x2;
	var Sy = y1-y2;
	var dS = Math.sqrt(Sx*Sx+Sy*Sy);
	var ds = r1+r2+deltaS;
	var A = (vx1-vx2)*(vx1-vx2)+(vy1-vy2)*(vy1-vy2);
	var B = 2*(Sx*(vx1-vx2)+Sy*(vy1-vy2));
	var C = dS*dS-ds*ds;
	
	var t1 = (-B+Math.sqrt(B*B-4*A*C))/(2*A);
	var t2 = (-B-Math.sqrt(B*B-4*A*C))/(2*A);
	
	if (t1<t2) {
		if (t1>0) {
			t = t1;
		} else if (t2>0) {
			t = t2;
		} else {
			return false;
		}
	} else {
		if (t2>0) {
			t = t2;
		} else if (t1>0) {
			t = t1;
		} else {
			return false;
		}
	}
	// проверка вычисления с учетом погрешности (отключить, если не надо)
	var d1 =  Math.sqrt(Sx*Sx+Sy*Sy)-(ds-deltaS);
	var d2 =  Math.sqrt(((x1+t*vx1)-(x2+t*vx2))*((x1+t*vx1)-(x2+t*vx2))+((y1+t*vy1)-(y2+t*vy2))*((y1+t*vy1)-(y2+t*vy2)))-(ds-deltaS);
		
	if (d1<0) {	
		console.log('Пересечение на расстояние d1 = ', d1);
		console.log('S = ',  Math.sqrt(Sx*Sx+Sy*Sy), '/', 'ds = ',ds-deltaS);
	}
	if (d2<0) {
		console.log('Пересечение на расстояние d2 = ', d2);
		console.log('S = ',  Math.sqrt(((x1+t*vx1)-(x2+t*vx2))*((x1+t*vx1)-(x2+t*vx2))+((y1+t*vy1)-(y2+t*vy2))*((y1+t*vy1)-(y2+t*vy2))), '/', 'ds = ',ds-deltaS);
	}
	return t;	
}

// ФУНКЦИЯ fn_TimeToCollisionBallWithWall вычисляет время столкновения шара и стены
// (x;y) координаты цетра шара  
// (vx;vy) координаты вектора скорости шара
// width, height размер прямоугольной рабочей области
var wall; // глобальная переменная, указывает с какой стеной произошло столкновение
function fn_TimeToCollisionBallWithWall(x, y, vx, vy, r, width,height, mark) {
	var dxR = x+(r+deltaS);
	var dxL = x-(r+deltaS);
	var dyT = y-(r+deltaS);
	var dyB = y+(r+deltaS);
	
	if (dxR>width || dyT<0 || dxL<0 || dyB>height){
		console.log(dxR,dxL,dyT,dyB);
	}
	
	var t = 0;
	
	if ((width <= dxR) && mark == true){
	} else if ((width-dxR)/vx>0){
		t = (width-dxR)/vx;
	}
	wall = 'right';
	
	if (t <-0) {
		t = -(dyT)/vy;
		wall = 'top';
	} else if ((dyT == 0) && mark == false){
		t = 0;
	} else if ((dyT <= 0) && mark == true){
	} else if (-(dyT)/vy>0 && (t>-(dyT)/vy || t == 0)){
		t = -(dyT)/vy;
		wall = 'top';
	}
	
	if (t <-0) {
		t = -(dxL)/vx;
		wall = 'left';
	} else if ((dxL == 0) && mark == false){
		t = 0;
	} else if ((dxL <= 0) && mark == true){
	} else if (-(dxL)/vx>0 && (t>-(dxL)/vx || t == 0)){
		t = -(dxL)/vx;
		wall = 'left';
	}

	if (t <-0) {
		t = (height-dyB)/vy;
		wall = 'bottom';
	} else if ((height <= dyB) && mark == false){
		t = 0;
	} else if ((height <= dyB) && mark == true){
	} else if ((height-dyB)/vy>0 && (t>(height-dyB)/vy || t == 0)){
		t = (height-dyB)/vy;
		wall = 'bottom';
	}
	
	if (t>=0) {
		return t
	} else {
		return false;
	}
}

//ФУНКЦИЯ fn_firstCollusionDetect вычисляет ближайшее столкновение двух шаров, или шара и стены
var arr_Collusion = []; //[t,i,j] t - время ближайшего столкновения, i,j - номера столкнувшихся тел, 
var arr_CollusionPrew = []; //[ipr,jpr] ipr,jpr - номера столкнувшихся тел на предыдущем этапе 
function fn_firstCollusionDetect () {
	arr_Collusion = [false,-1,-1]; // [t,i,j,ipr,jpr] t - время ближайшего столкновения, i,j - номера столкнувшихся тел, ipr,jpr - номера столкнувшихся тел на предыдущем этапе 
	for (var i=0; i < arr_Ball.length; i++){
		for (var j=i+1; j < arr_Ball.length; j++) {
			if (arr_Ball[i].mark){
				if (arr_Ball[j].mark){
					var t1 = fn_TimeToCollisionBalls(arr_Ball[i].X, arr_Ball[i].Y, arr_Ball[i].vx, arr_Ball[i].vy, arr_Ball[i].size, arr_Ball[j].X, arr_Ball[j].Y, arr_Ball[j].vx, arr_Ball[j].vy, arr_Ball[j].size);
				} else {
					var t1 = fn_TimeToCollisionBalls(arr_Ball[i].X, arr_Ball[i].Y, arr_Ball[i].vx, arr_Ball[i].vy, arr_Ball[i].size, arr_Ball[j].x, arr_Ball[j].y, arr_Ball[j].vx, arr_Ball[j].vy, arr_Ball[j].size);
				}
			} else if (arr_Ball[j].mark){
				var t1 = fn_TimeToCollisionBalls(arr_Ball[i].x, arr_Ball[i].y, arr_Ball[i].vx, arr_Ball[i].vy, arr_Ball[i].size, arr_Ball[j].X, arr_Ball[j].Y, arr_Ball[j].vx, arr_Ball[j].vy, arr_Ball[j].size);
			} else {
				var t1 = fn_TimeToCollisionBalls(arr_Ball[i].x, arr_Ball[i].y, arr_Ball[i].vx, arr_Ball[i].vy, arr_Ball[i].size, arr_Ball[j].x, arr_Ball[j].y, arr_Ball[j].vx, arr_Ball[j].vy, arr_Ball[j].size);
			}
			
			if ((t1 != false && t1<arr_Collusion[0])||(t1 != false && arr_Collusion[0] == false)){
				if (!(i == arr_CollusionPrew[0] && j == arr_CollusionPrew[1]) && t1>0){
					arr_Collusion[0] = t1;
					arr_Collusion[1] = i;
					arr_Collusion[2] = j;
				}
			}
		}
		if (arr_Ball[i].mark){
			var t2 = fn_TimeToCollisionBallWithWall(arr_Ball[i].X, arr_Ball[i].Y, arr_Ball[i].vx, arr_Ball[i].vy, arr_Ball[i].size, cnv_Width, cnv_Height, arr_Ball[i].mark);
		} else {
			var t2 = fn_TimeToCollisionBallWithWall(arr_Ball[i].x, arr_Ball[i].y, arr_Ball[i].vx, arr_Ball[i].vy, arr_Ball[i].size, cnv_Width, cnv_Height, arr_Ball[i].mark);
		}
		
		if (arr_Collusion[0] == false || arr_Collusion[0]>t2) {
			if (!(i == arr_CollusionPrew[0] && wall == arr_CollusionPrew[1]) && t2>0){
				arr_Collusion[0] = t2;
				arr_Collusion[1] = i;
				arr_Collusion[2] = wall;
			}
		}
	}
	arr_CollusionPrew[0]=arr_Collusion[1];
	arr_CollusionPrew[1]=arr_Collusion[2];
}

// ФУНКЦИЯ fn_collisionCalc вычисляет новые координаты векторов скорости после столкновения двух тел / тела и стены
function fn_collisionCalc(t,i,j) {
		
	switch (j) {
		case 'top':
		case 'bottom':
			arr_Ball[i].vy=-arr_Ball[i].vy;
			break;
		
		case 'left':
		case 'right':
			arr_Ball[i].vx = -arr_Ball[i].vx;
			break;
		
		default:
			var x1 = arr_Ball[i].X;
			var y1 = arr_Ball[i].Y;
			var x2 = arr_Ball[j].X;
			var y2 = arr_Ball[j].Y;
			
			var vx1 = arr_Ball[i].vx;
			var vx2 = arr_Ball[j].vx;
			var vy1 = arr_Ball[i].vy;
			var vy2 = arr_Ball[j].vy;
			var m1 = arr_Ball[i].weight;
			var m2 = arr_Ball[j].weight;
		
			var cosa=(x1-x2)/Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
			var sina=(y1-y2)/Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
		
			var Vx=vx1*cosa+vy1*sina;
			vy1=(-vx1*sina)+vy1*cosa;
			vx1=Vx;
			Vx=vx2*cosa+vy2*sina;
			vy2=(-vx2*sina)+vy2*cosa;
			vx2=Vx;
			
			Vx = ((m1-m2)*vx1+2*m2*vx2)/(m1+m2);
			vx2 =((m2-m1)*vx2+2*m1*vx1)/(m1+m2);;
			vx1=Vx;
			
			Vx=vx1*cosa-vy1*sina;
			vy1=vx1*sina+vy1*cosa;
			vx1=Vx;
			Vx=vx2*cosa-vy2*sina;
			vy2=vx2*sina+vy2*cosa;
			vx2=Vx;
		
			arr_Ball[i].vx = vx1;
			arr_Ball[i].vy = vy1;
			arr_Ball[j].vx = vx2;
			arr_Ball[j].vy = vy2;
			break;
	}
};

var btn_Begin = document.getElementById('screen_btn-begin');
btn_Begin.addEventListener('click', function(){
	cancelAnimationFrame(requestId);
	while (arr_Ball.length>0){
		arr_Ball.pop();
	}
	while (arr_Gas.length>0){
		arr_Gas.pop();
	}
	while (arr_Br.length>0){
		arr_Br.pop();
	}
	nameGas = document.getElementById('input-select-gas').value;
	arrGasLength = parseFloat(document.getElementById('input-number-gas').value);
	tmprGas = parseFloat(document.getElementById('input-temperature-gas').value)+273.25;
	arrBrLength = parseFloat(document.getElementById('input-number-br').value);
	sizeBr = parseFloat(document.getElementById('input-size-br').value);
	weightBr = parseFloat(document.getElementById('input-weight-br').value);
	speedBr = parseFloat(document.getElementById('input-speed-br').value);
	coofSpeedGas = Math.pow(parseInt(document.getElementById('input-coofSpeedGas').value),parseInt(document.getElementById('input-coofSpeedGasDeg').value));
	coofSizeGas = Math.pow(parseInt(document.getElementById('input-coofSizeGas').value),parseInt(document.getElementById('input-coofSizeGasDeg').value));
	deltaS = Math.pow(parseInt(document.getElementById('input-deltaS').value),parseInt(document.getElementById('input-deltaSDeg').value));
	

	perfAnim = true;
	count = 0
	loop();
});

var btn_Stop = document.getElementById('screen_btn-stop');
btn_Stop.addEventListener('click', function(){
	perfAnim = false;
});

btn_Stop.style.background = '#afafaf';

var btn_Continue = document.getElementById('screen_btn-continue');
btn_Continue.addEventListener('click',function() {
	perfAnim = true;
	loop();
});

btn_Continue.style.background = '#afafaf';

var btn_Clear = document.getElementById('screen_btn-clear');
btn_Clear.addEventListener('click',function(){
	cancelAnimationFrame(requestId);
	count = 0
	/*document.getElementById('input-select-gas').value = 'Аргон';
	document.getElementById('input-number-gas').value = '20';
	document.getElementById('input-temperature-gas').value = '30';
	document.getElementById('input-number-br').value = '1';
	document.getElementById('input-size-br').value = '40';
	document.getElementById('input-weight-br').value = '400';
	document.getElementById('input-speed-br').value = '1';*/
	ctx.clearRect(0, 0, cnv_Width, cnv_Height);
	

})

var btn_FullScreen = document.getElementById('btn-fullscreen');
btn_FullScreen.addEventListener('click',fnFullScreen);

document.getElementById('input-select-gas').value = 'Аргон';
document.getElementById('input-number-gas').value = '1';
document.getElementById('input-temperature-gas').value = '30';
document.getElementById('input-number-br').value = '1';
document.getElementById('input-size-br').value = '40';
document.getElementById('input-weight-br').value = '400';
document.getElementById('input-speed-br').value = '1';
document.getElementById('input-coofSpeedGas').value = '10';
document.getElementById('input-coofSpeedGasDeg').value = '-2';
document.getElementById('input-coofSizeGas').value = '10';
document.getElementById('input-coofSizeGasDeg').value = '1';
document.getElementById('input-deltaS').value = '10';
document.getElementById('input-deltaSDeg').value = '-8';