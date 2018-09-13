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

function fn_loop() {
	cnv_Width = canvas.width = parseFloat(div_Canvas.style.width);
	cnv_Height = canvas.height = parseFloat(div_Canvas.style.height);
	
	if (arr_Gas.length < arrGasLength) {
		switch (nameGas){
			case 'Аргон':		
				var weightGas = 39.948;
				var sizeGas = 0.192*coofSizeGas;
				var colorGas = '#D5A5E9';
				break;
			case 'Водород':
				var weightGas = 2.0156;
				var sizeGas = 0.25*coofSizeGas;
				var colorGas = '#C295C8';
				break;
			case 'Гелий':
				var weightGas = 4.003;
				var sizeGas = 0.2*coofSizeGas;
				var colorGas = '#FAF8E1';
				break;
			case 'Кислород':
				var weightGas = 32.00;
				var sizeGas = 0.3*coofSizeGas;
				var colorGas = '#B2B4C9';
				break;
			case 'Неон':
				var weightGas = 20.183;
				var sizeGas = 0.16*coofSizeGas;
				var colorGas = '#E27E29';
				break;
		}
		var speedGas = coofSpeedGas *Math.sqrt((3*8.31*tmprGas*1000)/weightGas);
	}
		
	while (arr_Gas.length < arrGasLength) { //генерируются молекулы газа
	
		// генерируемые частицы должны иметь разное место в пространстве
		var xGas = random(deltaS + sizeGas,cnv_Width - (sizeGas+deltaS));
		var yGas = random(deltaS + sizeGas,cnv_Height - (sizeGas+deltaS));
		for (var i=0; i<arr_Ball.length; i++){
			if (Math.sqrt((xGas-arr_Ball[i].x)*(xGas-arr_Ball[i].x)+(yGas-arr_Ball[i].y)*(yGas-arr_Ball[i].y))-(sizeGas+arr_Ball[i].size+deltaS)<0){
				xGas = random(deltaS + sizeGas,cnv_Width - (sizeGas+deltaS));
				yGas = random(deltaS + sizeGas,cnv_Height - (sizeGas+deltaS));
				i=0;
			}
		}
		
		var vxGas = random(-speedGas,speedGas);
		if (random(-1,1)>=0) {
			var vyGas = Math.sqrt(speedGas*speedGas-vxGas*vxGas);
		} else {
			var vyGas = (-1)*Math.sqrt(speedGas*speedGas-vxGas*vxGas);
		}
				
		var ballGas = new obj_Ball(
			xGas, // координата х
			yGas, // координата y
			0,
			0,
			vxGas, // координата скорости vx
			vyGas, //координата скорости vy
			sizeGas, // размер
			weightGas, // масса
			colorGas, // цвет
			false,
		);
    arr_Gas.push(ballGas);
	arr_Ball.push(ballGas);
	}
	
	while (arr_Br.length < arrBrLength) { //генерируются Броуновские частицы
				
		// генерируемые частицы должны иметь разное место в пространстве
		var xBr = random(deltaS + sizeBr,cnv_Width - (sizeBr+deltaS));
		var yBr = random(deltaS + sizeBr,cnv_Height - (sizeBr+deltaS));
		for (var i=0; i<arr_Ball.length; i++){
			if (Math.sqrt((xBr-arr_Ball[i].x)*(xBr-arr_Ball[i].x)+(yBr-arr_Ball[i].y)*(yBr-arr_Ball[i].y))-(sizeBr+arr_Ball[i].size+deltaS)<0){
				xBr = random(deltaS + sizeBr,cnv_Width - (sizeBr+deltaS));
				yBr = random(deltaS + sizeBr,cnv_Height - (sizeBr+deltaS));
				i=0;
			}
		}
		
		var vxBr = random(-speedBr,speedBr);
		if (random(-1,1)>=0) {
			var vyBr = Math.sqrt(speedBr*speedBr-vxBr*vxBr);
		} else {
			var vyBr = (-1)*Math.sqrt(speedBr*speedBr-vxBr*vxBr);
		}
		
		var ballBr = new obj_Ball(
			xBr, // координата х
			yBr, // координата y
			0,
			0,
			vxBr, // координата скорости vx
			vyBr, //координата скорости vy
			sizeBr, // размер
			weightBr, // масса
			'rgb(255, 255, 255)', // цвет
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
	
	ctx.clearRect(0, 0, cnv_Width, cnv_Height);
	
	for (var i = 0; i < arr_Ball.length; i++) {
		arr_Ball[i].draw();
	}
		
	if (perfAnim) {
		requestId = requestAnimationFrame(fn_loop);
	} else {
		cancelAnimationFrame(requestId);
	}
}

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
	
	btn_Stop.disabled = false;
	btn_Stop.style.background = '#302c2c';
	btn_Continue.disabled = true;
	btn_Continue.style.background = '#afafaf';
	perfAnim = true;
	
	//fn_EvalParam (); //функция будет оценивать входящие параметры и давать советы в строке 'message', доработаю позже, если будет желание.
	
	fn_loop();
});

var btn_Stop = document.getElementById('screen_btn-stop');
btn_Stop.addEventListener('click', function(){
	perfAnim = false;
	
	btn_Stop.disabled = true;
	btn_Stop.style.background = '#afafaf';
	btn_Continue.disabled = false;
	btn_Continue.style.background = '#302c2c';
});

btn_Stop.disabled = true;
btn_Stop.style.background = '#afafaf';

var btn_Continue = document.getElementById('screen_btn-continue');
btn_Continue.addEventListener('click',function() {
	perfAnim = true;
	
	btn_Stop.disabled = false;
	btn_Stop.style.background = '#302c2c';
	btn_Continue.disabled = true;
	btn_Continue.style.background = '#afafaf';
	fn_loop();
});

btn_Continue.disabled = true;
btn_Continue.style.background = '#afafaf';

var btn_Clear = document.getElementById('screen_btn-clear');
btn_Clear.addEventListener('click',function(){
	cancelAnimationFrame(requestId);
	document.getElementById('input-select-gas').value = 'Аргон';
	document.getElementById('input-number-gas').value = '20';
	document.getElementById('input-temperature-gas').value = '30';
	document.getElementById('input-number-br').value = '1';
	document.getElementById('input-size-br').value = '40';
	document.getElementById('input-weight-br').value = '400';
	document.getElementById('input-speed-br').value = '1';
	ctx.clearRect(0, 0, cnv_Width, cnv_Height);
	
	btn_Stop.disabled = true;
	btn_Stop.style.background = '#afafaf';
	btn_Continue.disabled = true;
	btn_Continue.style.background = '#afafaf';
})

var btn_FullScreen = document.getElementById('btn-fullscreen');
btn_FullScreen.addEventListener('click',fnFullScreen);

document.getElementById('input-select-gas').value = 'Аргон';
document.getElementById('input-number-gas').value = '20';
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