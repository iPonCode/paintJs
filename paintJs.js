/* PaintJs - A simple way to paint with keyboard in Javascript */

// we will load background image always the first before other items
// we will know when background is loaded with cargaOk
// image fondo only will show if quiere_imagen_fondo its true
var fondo = {
	url: "fondo.png",
	cargaOk: false
};
var imagenFondo = new Image();
imagenFondo.src = fondo.url;
imagenFondo.addEventListener("load", cargarFondo);

// we store the key's keyCodes for check later which key was pressed
var teclas = { UP: 38,	// up
				O: 79,
				T: 84,
				W: 87,	// up-left
				I: 73,
				Q: 81,
				R: 82,
			 LEFT: 37,	// left
			 	K: 75,
			 	A: 65,
			 	F: 70,
			 COMA: 188,	// down-left
			 	Z: 90,
			 	V: 86,
			 DOWN: 40,	// down
			PUNTO: 190,
				X: 88,
				B: 66,
			GUION: 189,	// down-right
				C: 67,
				N: 78,
			RIGHT: 39,	// right
				Ñ: 186,
				D: 68,
				H: 72,
				P: 80,	// up-right
				E: 69,
				Y: 89,
			SPACE: 32,	// special-key
				L: 76,
				S: 83,
				G: 71
		};
// for store the colors
var colores = { GRIS_CLARO: "#c2c2c2",
			   GRIS_OSCURO: "#969696",
			   		 NEGRO: "black",
			          AZUL: "blue",
			   		MARRON: "brown",
			   		  GRIS: "grey",
			   		 VERDE: "green",
			   	   NARANJA: "orange",
			   		  ROSA: "pink",
			   	   PURPURA: "purple",
			   		  ROJO: "red",
			   		BLANCO: "white",
			   	  AMARILLO: "yellow",
			   		  CIAN: "cyan"
			};
// for store some texts for the user interface
var textos = { COORDENADAS: "Coordenadas ",
				COORDS_INI: "iniciales: ",
				COORDS_ACT: "actuales: ",
			};
// for getElementById, this store all html id's items
var elements_by_id = { COORDS: "soy_un_parrafo",
				        OTROS: "otro_id_de_elemento",
				  AREA_DIBUJO: "area_de_dibujo"
					 };
// configure the key pressed behavior to catch
// try keyup for draw carefuly, try keydown to quickly
var evento_tecla = "keydown";
var ultima_tecla_pulsada = teclas.SPACE; // inizilice with some key, like spacebar

// get canvas from html
var area_dibujo = document.getElementById(elements_by_id.AREA_DIBUJO);
var papel = area_dibujo.getContext("2d");

// canvas limits (its recommended that it be the same size as in the html)
var xlimite = 500;
var ylimite = 500;

// configure wants
var quiere_imagen_fondo = true;
var quiere_dibujar_bordes = true;
var quiere_dibujar_rejilla = false; // if wants show the grid
var quiere_dibujar_aspa = false;
var quiere_dibujar_test = false;
var quiere_dibujar_comecocos = true;
var quiere_punto_inicial = true; // paint initial point
var quiere_punto_giro = true; // if you dont like square this will draw beatifull corners

// line for canvas limits
var color_linea_borde = colores.GRIS_OSCURO; // this is the perimeter line
var grosor_linea_borde = 5;

// configure grid
var rejilla = 10; // the number of pixel for grid space
var color_linea_rejilla = colores.GRIS_CLARO; // grid's line color
var grosor_linea_rejilla = 1; // 1 for better results (many lines in grid)

var color_linea_aspa = color_linea_rejilla; // central blade's line color
var grosor_linea_aspa = grosor_linea_rejilla;


// configure Comecocos
var estilo_relleno_comecocos = colores.PURPURA; // ComeCocos fill color
var estilo_relleno_cocos = colores.NARANJA; // Cocos fill color
var color_linea_comecocos_pantalla = colores.GRIS_OSCURO; // ComeCocos's maze's line color
var estilo_relleno_comida = colores.BLANCO; // food's blocks fill color
var grosor_punto_comida = 3; // square size for food's blocks 
var grosor_linea_comecocos_pantalla = 2;

// stroke speed, number of pixels that moves to draw each time the key is pressed
var offset = 15; 

// initial point
var color_punto_inicial = colores.ROJO;
var grosor_punto_inicial = 5;

// configure line for draw
var color_linea_dibujo = colores.AZUL;
var grosor_linea_dibujo = 2;
var color_punto_giro = color_linea_dibujo; // play with this color for cool results
var grosor_punto_giro = grosor_linea_dibujo; // simmilar to grosor_linea_dibujo to best results

// configure point to mark the actual coordenate, when spacebar key pressed
var color_punto_gordo = color_punto_inicial; // when user tap spacebar draw a punto_gordo X
var grosor_punto_gordo = 10; // more than 5 it starts to look like a cross X, less like a a point

var factor_aprox = 0; // experimental, set to 0 for a normal behaviour
var xtopemax = xlimite - factor_aprox; // is the high limit (by the right and down) of the x and y coordinates
var ytopemax = ylimite - factor_aprox; // taking into account the experimental factor_aprox
var xtopemin = 0 + factor_aprox; // is the low limit (by the left and up) of the x and y coordinates
var ytopemin = 0 + factor_aprox; // aking into account the experimental factor_aprox

// initial random coords, from min topemin, max topemax and fitted to the grid
x = ajustarARejilla(aleatorio(xtopemin, xtopemax), rejilla, xtopemax);
y = ajustarARejilla(aleatorio(ytopemin, ytopemax), rejilla, ytopemax);

// each time user do evento_tecla we call dibujarConTeclas function
document.addEventListener(evento_tecla, dibujarConTeclas);

// we show in html body the initial coordinate using innerHTML elemnt property
var mensaje_coordenadas = document.getElementById(elements_by_id.COORDS);
mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_INI + "[ x: " + x + ", y: " + y + " ]";

function cargarFondo()
{
	fondo.cargaOk = true;
	if (quiere_imagen_fondo) papel.drawImage(imagenFondo, 0, 0);
	if (quiere_dibujar_rejilla) dibujarRejilla();
	if (quiere_dibujar_aspa) dibujarAspa();
	if (quiere_dibujar_test) dibujarTest();				// draw some test function
	if (quiere_dibujar_comecocos) dibujarComeCocos();	// draw figures like comecocos
	if (quiere_dibujar_bordes) dibujarBordesPapel();	// want to paint border line at last
	if (quiere_punto_inicial) dibujarPuntoInicial();	// but initial point over
}

function dibujarLinea(color, xinicial, yinicial, xfinal, yfinal, lienzo, ancho)
{
	// lines will not be drawn if the background is not allready loaded
	if (fondo.cargaOk)
	{
		lienzo.beginPath();
		lienzo.strokeStyle = color;
		lienzo.lineWidth = ancho;
		lienzo.moveTo(xinicial,yinicial);
		lienzo.lineTo(xfinal, yfinal);
		lienzo.stroke();
		lienzo.closePath();		
	}
	else
	{
		console.log("La imágen de fondo no está lista: ");
		console.log("* - " + fondo.url + " fondo.cargaOk = " + fondo.cargaOk);
	}
}

function dibujarPuntoInicial()
{
	dibujarLinea(color_punto_inicial, x + 1, y + 1, x - 1, y - 1, papel, grosor_punto_inicial);
	dibujarLinea(color_punto_inicial, x + 1, y - 1, x - 1, y + 1, papel, grosor_punto_inicial);
}

function dibujarPuntoGordo()
{
	dibujarLinea(color_punto_gordo, x + 1, y + 1, x - 1, y - 1, papel, grosor_punto_gordo);
	dibujarLinea(color_punto_gordo, x + 1, y - 1, x - 1, y + 1, papel, grosor_punto_gordo);
}

function dibujarPuntoGiro()
{
	dibujarLinea(color_punto_giro, x + 1, y + 1, x - 1, y - 1, papel, grosor_punto_giro);
	dibujarLinea(color_punto_giro, x + 1, y - 1, x - 1, y + 1, papel, grosor_punto_giro);
}

function dibujarAspa()
{
	dibujarLinea(color_linea_aspa, 1, 1, xlimite - 1, ylimite - 1, papel, grosor_linea_aspa);
	dibujarLinea(color_linea_aspa, xlimite - 1, 1, 1, ylimite - 1, papel, grosor_linea_aspa);
}

function dibujarBordesPapel()
{
	dibujarLinea(color_linea_borde, 0, 0, xlimite, 0, papel, grosor_linea_borde);
	dibujarLinea(color_linea_borde, xlimite, 0, xlimite, ylimite, papel, grosor_linea_borde);
	dibujarLinea(color_linea_borde, xlimite, ylimite, 0, ylimite, papel, grosor_linea_borde);
	dibujarLinea(color_linea_borde, 0, ylimite, 0, 0, papel, grosor_linea_borde);
}

function dibujarRejilla()
{
	for (var i = 0; i < ylimite; i = i + rejilla)
	{ // paint horizontal lines
		dibujarLinea(color_linea_rejilla, 0, i, xlimite, i, papel, grosor_linea_rejilla);
		// console.log("linea rejilla desde [ 0, " + i +"] hasta [ " + xlimite + ", " + i + "] ");
	}

	for (var i = 0; i < xlimite; i = i + rejilla)
	{ // paint vertical lines
		dibujarLinea(color_linea_rejilla, i, 0, i, ylimite, papel, grosor_linea_rejilla);
		// console.log("linea rejilla desde [ " + i +", 0 ] hasta [ " + i + ", " + ylimite + "] ");
	}
}

function dibujarTest()
{
	// save values
	var guardar_strokeStype = papel.strokeStyle;
	var guardar_lineWidth = papel.lineWidth;
	var guardar_fillStyle = papel.fillStyle;

	// set values
	papel.strokeStyle = colores.NEGRO;
	papel.lineWidth = 2;
	papel.fillStyle = colores.AZUL;


	// Triángulo rellenado
	papel.beginPath();
	papel.moveTo(25+(xlimite/300),25+(xlimite/2));
	papel.lineTo(105+(xlimite/2),25+(xlimite/2));
	papel.lineTo(25+(xlimite/2),105+(xlimite/2));
	papel.fill();

	// Triángulo contorneado
	papel.beginPath();
	papel.strokeStyle = color_linea_borde;
	papel.lineWidth = grosor_linea_borde;
	papel.moveTo(465,465);
	papel.lineTo(465,365);
	papel.lineTo(365,465);
	papel.closePath();
	papel.stroke()

	// circulitos
	for(var i=0;i<4;i++){
		for(var j=0;j<3;j++){
			papel.beginPath();
			var x				= 250+j*50;					// Coordenada x
			var y				= 250+i*50;					// Coordenada y
			var radius			= 20;						// Radio del arco
			var startAngle		= 0;						// Punto inicial del círculo
			var endAngle		= Math.PI+(Math.PI*j)/2		// Punto final del círculo
			var anticlockwise	= i%2==0 ? false : true;	// Sentido de las manecillas del reloj y contrario a ellas

			papel.arc(x, y, radius, startAngle, endAngle, anticlockwise);

			if (i>1)
			{
				papel.fill();
			}
			else
			{
				papel.stroke();
			}
		}
	}

	// borde rojo gordo
	papel.beginPath();
	papel.strokeStyle = colores.ROJO;
	papel.lineWidth = 8;
	papel.moveTo(0, 0);
	papel.lineTo(xlimite, 0);
	papel.lineTo(xlimite, ylimite);
	papel.lineTo(0, ylimite);
	papel.lineTo(0, 0);
	papel.fillStyle = colores.GRIS_CLARO;
	// papel.fill(); // rellena el contorno del color definido en .fillStyle
	papel.stroke();
	papel.closePath();

	// CORAZÓN (Quadratric curves)
	papel.beginPath();
	papel.moveTo(75,40);
	papel.bezierCurveTo(75,37,70,25,50,25);
	papel.bezierCurveTo(20,25,20,62.5,20,62.5);
	papel.bezierCurveTo(20,80,40,102,75,120);
	papel.bezierCurveTo(110,102,130,80,130,62.5);
	papel.bezierCurveTo(130,62.5,130,25,100,25);
	papel.bezierCurveTo(85,25,75,37,75,40);
	papel.fillStyle = colores.ROSA;
	papel.fill();

	console.log("* - He terminado de dibujarTest();");

	// retrieve saved values
	papel.strokeStyle = guardar_strokeStype;
	papel.lineWidth = guardar_lineWidth;
	papel.fillStyle = guardar_fillStyle;
}

function dibujarComeCocos()
{
	// save values
	var guardar_strokeStype = papel.strokeStyle;
	var guardar_lineWidth = papel.lineWidth;
	var guardar_fillStyle = papel.fillStyle;

	// Configure maze
	papel.strokeStyle = color_linea_comecocos_pantalla;
	papel.lineWidth = grosor_linea_comecocos_pantalla;

	// borders
	dibujarRectEsqRed(papel, (xtopemin + offset), (ytopemin + offset), (xtopemax - offset * 2), (ytopemax - offset * 2),15);
	dibujarRectEsqRed(papel, (xtopemin + offset + 7), (ytopemin + offset + 7), (xtopemax - offset * 2 - 14), (ytopemax - offset * 2 - 14),9);
	// obstacles
    dibujarRectEsqRed(papel,48,48,48,32,10);
    dibujarRectEsqRed(papel,48,128,48,16,6);
    dibujarRectEsqRed(papel,128,48,48,32,10);
    dibujarRectEsqRed(papel,128,112,32,48,10);

	// Configure dots
    papel.fillStyle = estilo_relleno_comida;

    // horizontal dot's line from 2 to 26 in first row (35px)
    for(var i=0;i<26;i++){
      papel.fillRect(51+i*16,35,grosor_punto_comida,grosor_punto_comida);
    }

    // vertical dot's line from 3 to 26 in sixth column (115px)
    for(i=0;i<26;i++){
      papel.fillRect(115,67+i*16,grosor_punto_comida,grosor_punto_comida);
    }

    // horizontal dot's line from 1 to 27 in forth row (99px)
    for(i=0;i<27;i++){
      papel.fillRect(35+i*16,99,grosor_punto_comida,grosor_punto_comida);
    }

	// Config ComeCocos
	papel.fillStyle = estilo_relleno_comecocos;

    // This is the ComeCocos
    papel.beginPath();
    papel.arc(37,37,13,Math.PI/7,-Math.PI/7,false);
    papel.lineTo(31,37);
    papel.fill();

    // Config Cocos
    papel.fillStyle = estilo_relleno_cocos;

    // This is a coco
    papel.beginPath();
    papel.moveTo(83,116);
    papel.lineTo(83,102);
    papel.bezierCurveTo(83,94,89,88,97,88);
    papel.bezierCurveTo(105,88,111,94,111,102);
    papel.lineTo(111,116);
    papel.lineTo(106.333,111.333);
    papel.lineTo(101.666,116);
    papel.lineTo(97,111.333);
    papel.lineTo(92.333,116);
    papel.lineTo(87.666,111.333);
    papel.lineTo(83,116);
    papel.fill();

    // Coco's eyes (white)
    papel.fillStyle = colores.BLANCO;
    papel.beginPath();
    papel.moveTo(91,96);
    papel.bezierCurveTo(88,96,87,99,87,101);
    papel.bezierCurveTo(87,103,88,106,91,106);
    papel.bezierCurveTo(94,106,95,103,95,101);
    papel.bezierCurveTo(95,99,94,96,91,96);
    papel.moveTo(103,96);
    papel.bezierCurveTo(100,96,99,99,99,101);
    papel.bezierCurveTo(99,103,100,106,103,106);
    papel.bezierCurveTo(106,106,107,103,107,101);
    papel.bezierCurveTo(107,99,106,96,103,96);
    papel.fill();

    // the eye's pupils (black)
    papel.fillStyle = colores.NEGRO;
    papel.beginPath();
    papel.arc(101,102,2,0,Math.PI*2,true);
    papel.fill();

    papel.beginPath();
    papel.arc(89,102,2,0,Math.PI*2,true);
    papel.fill();

	console.log("* - He terminado de dibujarComeCocos();");

	// retrieve saved values
	papel.strokeStyle = guardar_strokeStype;
	papel.lineWidth = guardar_lineWidth;
	papel.fillStyle = guardar_fillStyle;
}

function dibujarRectEsqRed(papel,x,y,width,height,radius){
  papel.beginPath();
  papel.moveTo(x,y+radius);
  papel.lineTo(x,y+height-radius);
  papel.quadraticCurveTo(x,y+height,x+radius,y+height);
  papel.lineTo(x+width-radius,y+height);
  papel.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  papel.lineTo(x+width,y+radius);
  papel.quadraticCurveTo(x+width,y,x+width-radius,y);
  papel.lineTo(x+radius,y);
  papel.quadraticCurveTo(x,y,x,y+radius);
  papel.stroke();
}

function dibujarConTeclas(evento)
{
	var xobjetivo, yobjetivo;
	switch (evento.keyCode)
	{
		// go UP
		case teclas.UP:
		case teclas.O:
		case teclas.W:
		case teclas.T:
			yobjetivo = y - offset; 	// this whould be the y end point coord before apply move
			if (yobjetivo >= ytopemin)
			{ // when the end point does not exceed or is iqual to the min ytopemin, we draw to the end point
				if (ultima_tecla_pulsada != teclas.UP && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, x, yobjetivo, papel, grosor_linea_dibujo);
				y = yobjetivo;
				ultima_tecla_pulsada = teclas.UP;
				console.log("Avance NORMAL");
			}
			else
			{ // when the end point exceed the min ytopemin limit, we draw up to the limit
				if (y != ytopemin)
				{
					if (ultima_tecla_pulsada != teclas.UP && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, x, ytopemin, papel, grosor_linea_dibujo);
					y = ytopemin;
					ultima_tecla_pulsada = teclas.UP;
					console.log("Avance RECORTANDO EN Y");
				}
				else
				{ // finally, if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE SUPERIOR");
				}
			}
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
		break;

		// go up-left
		case teclas.I:
		case teclas.Q:
		case teclas.R:
			xobjetivo = x - offset; // estas serían las coordenadas x e y finales
			yobjetivo = y - offset; // después de aplicar el desplazamiento
			x_avanza_recortando_y = y - ytopemin; // lo que debe avanzar en coorderada x o y cuando
			y_avanza_recortando_x = xtopemin + x; // xobjetivo o yobjetivo están fuera de limites

			if ((xobjetivo >= xtopemin) && (yobjetivo >= ytopemin)) 
			{ // ojetivo dentro de limites o justo en el limite entonces avance normal
				if (ultima_tecla_pulsada != teclas.I && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, xobjetivo, yobjetivo, papel, grosor_linea_dibujo);
				x = xobjetivo;
				y = yobjetivo;
				ultima_tecla_pulsada = teclas.I;
				console.log("Avance DIAGONAL NORMAL");
			}
			else if ((xobjetivo >= xtopemin) && (yobjetivo < ytopemin))
			{ // ojetivo x dentro de limites y objetivo y fuera de limites entonces avance recortando y
				if (y != ytopemin)
				{
					if (ultima_tecla_pulsada != teclas.I && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, x - x_avanza_recortando_y, ytopemin, papel, grosor_linea_dibujo);
					x = x - x_avanza_recortando_y;
					y = ytopemin;
					ultima_tecla_pulsada = teclas.I;
					console.log("Anvance DIAGONAL hasta el LÍMITE en Y");
				}
				else
				{ // if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE SUPERIOR en Y (DIAGONAL)");
				}
			}
			else if ((xobjetivo < xtopemin) && (yobjetivo >= ytopemin))
			{ // ojetivo x fuera de limites y objetivo y dentro de limites entonces avance recortando x
				if (x != xtopemin)
				{
					if (ultima_tecla_pulsada != teclas.I && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, xtopemin, y - y_avanza_recortando_x, papel, grosor_linea_dibujo);
					y = y - y_avanza_recortando_x;
					x = xtopemin;
					ultima_tecla_pulsada = teclas.I;
					console.log("Anvance DIAGONAL hasta EL LÍMITE en X");
				}
				else
				{ // if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE IZQUIERDO en X (DIAGONAL)");
				}
			}
			else
			{
				console.log("	* - Caso SUPERIOR-IZQUIERDO no controlado");
			}
			console.log("xobjetivo: " + xobjetivo + " * yobjetivo: " + yobjetivo);
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
		break;

		// go left
		case teclas.LEFT:
		case teclas.K:
		case teclas.A:
		case teclas.F:
			xobjetivo = x - offset; 	// this whould be the x end point coord before apply move
			if (xobjetivo >= xtopemin)
			{ // when the end point does not exceed or is iqual to the min xtopemin, we draw to the end point
				if (ultima_tecla_pulsada != teclas.LEFT && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, xobjetivo, y, papel, grosor_linea_dibujo);
				x = xobjetivo;
				ultima_tecla_pulsada = teclas.LEFT;
				console.log("Avance NORMAL");
			}
			else
			{ // when the end point exceed the min xtopemin limit, we draw up to the limit
				if (x != xtopemin)
				{
					if (ultima_tecla_pulsada != teclas.LEFT && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, xtopemin, y, papel, grosor_linea_dibujo);
					x = xtopemin;
					ultima_tecla_pulsada = teclas.LEFT;
					console.log("Avance RECORTANDO EN X");
				}
				else
				{ // finally, if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE IZQUIERDO");
				}
			}
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
		break;

		// go down-left
		case teclas.COMA:
		case teclas.Z:
		case teclas.V:
			xobjetivo = x - offset; // estas serían las coordenadas x e y finales
			yobjetivo = y + offset; // después de aplicar el desplazamiento
			x_avanza_recortando_y = ytopemax - y;	// lo que debe avanzar en coorderada x o y cuando
			y_avanza_recortando_x = x - xtopemin;		// xobjetivo o yobjetivo están fuera de limites

			if ((xobjetivo >= xtopemin) && (yobjetivo <= ytopemax)) 
			{ // ojetivo dentro de limites o justo en el limite entonces avance normal
				if (ultima_tecla_pulsada != teclas.COMA && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, xobjetivo, yobjetivo, papel, grosor_linea_dibujo);
				x = xobjetivo;
				y = yobjetivo;
				ultima_tecla_pulsada = teclas.COMA;
				console.log("Avance DIAGONAL NORMAL");
			}
			else if ((xobjetivo >= xtopemin) && (yobjetivo > ytopemax))
			{ // ojetivo x dentro de limites y objetivo y fuera de limites entonces avance recortando y
				if (y != ytopemax)
				{
					if (ultima_tecla_pulsada != teclas.COMA && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, x - x_avanza_recortando_y, ytopemax, papel, grosor_linea_dibujo);
					x = x - x_avanza_recortando_y;
					y = ytopemax;
					ultima_tecla_pulsada = teclas.COMA;
					console.log("Anvance DIAGONAL hasta el LÍMITE en Y");
				}
				else
				{ // if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE INFERIOR en Y (DIAGONAL)");
				}
			}
			else if ((xobjetivo < xtopemin) && (yobjetivo <= ytopemax))
			{ // ojetivo x fuera de limites y objetivo y dentro de limites entonces avance recortando x
				if (x != xtopemin)
				{
					if (ultima_tecla_pulsada != teclas.COMA && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, xtopemin, y + y_avanza_recortando_x, papel, grosor_linea_dibujo);
					y = y + y_avanza_recortando_x;
					x = xtopemin;
					ultima_tecla_pulsada = teclas.COMA;
					console.log("Anvance DIAGONAL hasta el LÍMITE en X");
				}
				else
				{ // if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE INFERIOR en X (DIAGONAL)");
				}
			}
			else
			{
				console.log("	* - Caso INFERIOR-IZQUIERDO no controlado");
			}
			console.log("xobjetivo: " + xobjetivo + " * yobjetivo: " + yobjetivo);
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
		break;

		// go down
		case teclas.DOWN:
		case teclas.PUNTO:
		case teclas.X:
		case teclas.B:
			yobjetivo = y + offset; 	// this whould be the y end point coord before apply move
			if (yobjetivo <= ytopemax)
			{ // when the end point does not exceed or is iqual to the max ytopemax, we draw to the end point
				if (ultima_tecla_pulsada != teclas.DOWN && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, x, yobjetivo, papel, grosor_linea_dibujo);
				y = yobjetivo;
				ultima_tecla_pulsada = teclas.DOWN;
				console.log("Avance NORMAL");
			}
			else
			{ // when the end point exceed the max ytopemax limit, we draw up to the limit
				if (y != ytopemax)
				{
					if (ultima_tecla_pulsada != teclas.DOWN && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, x, ytopemax, papel, grosor_linea_dibujo);
					y = ytopemax;
					ultima_tecla_pulsada = teclas.DOWN;
					console.log("Avance RECORTANDO EN Y");
				}
				else
				{ // finally, if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE INFERIOR");
				}
			}
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
		break;

		// go down-right
		case teclas.GUION:
		case teclas.C:
		case teclas.N:
			xobjetivo = x + offset; // estas serían las coordenadas x e y finales
			yobjetivo = y + offset; // después de aplicar el desplazamiento
			x_avanza_recortando_y = ytopemax - y; // lo que debe avanzar en coorderada x o y cuando
			y_avanza_recortando_x = xtopemax - x; // xobjetivo o yobjetivo están fuera de limites

			if ((xobjetivo <= xtopemax) && (yobjetivo <= ytopemax)) 
			{ // ojetivo dentro de limites o justo en el limite entonces avance normal
				if (ultima_tecla_pulsada != teclas.GUION && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, xobjetivo, yobjetivo, papel, grosor_linea_dibujo);
				x = xobjetivo;
				y = yobjetivo;
				ultima_tecla_pulsada = teclas.GUION;
				console.log("Avance DIAGONAL NORMAL");
			}
			else if ((xobjetivo <= xtopemax) && (yobjetivo > ytopemax))
			{ // ojetivo x dentro de limites y objetivo y fuera de limites entonces avance recortando y
				if (y != ytopemax)
				{
					if (ultima_tecla_pulsada != teclas.I && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, x + x_avanza_recortando_y, ytopemax, papel, grosor_linea_dibujo);
					x = x + x_avanza_recortando_y;
					y = ytopemax;
					ultima_tecla_pulsada = teclas.GUION;
					console.log("Anvance DIAGONAL hasta el LÍMITE en Y");
				}
				else
				{ // if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE INFERIOR en Y (DIAGONAL)");
				}
			}
			else if ((xobjetivo > xtopemax) && (yobjetivo <= ytopemax))
			{ // ojetivo x fuera de limites y objetivo y dentro de limites entonces avance recortando x
				if (x != xtopemax)
				{
					if (ultima_tecla_pulsada != teclas.I && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, xtopemax, y + y_avanza_recortando_x, papel, grosor_linea_dibujo);
					y = y + y_avanza_recortando_x;
					x = xtopemax;
					ultima_tecla_pulsada = teclas.GUION;
					console.log("Anvance DIAGONAL hasta el LÍMITE en X");
				}
				else
				{ // if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE DERECHO en X (DIAGONAL)");
				}
			}
			else
			{
				console.log("	* - Caso INFERIOR-DERECHO no controlado");
			}
			console.log("xobjetivo: " + xobjetivo + " * yobjetivo: " + yobjetivo);
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
		break;

		// go right
		case teclas.RIGHT:
		case teclas.Ñ:
		case teclas.D:
		case teclas.H:
			xobjetivo = x + offset; 	// this whould be the x end point coord before apply move
			if (xobjetivo <= xtopemax)
			{ // when the end point does not exceed or is iqual to the max xtopemax, we draw to the end point
				if (ultima_tecla_pulsada != teclas.RIGHT && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, xobjetivo, y, papel, grosor_linea_dibujo);
				x = xobjetivo;
				ultima_tecla_pulsada = teclas.RIGHT;
				console.log("Avance NORMAL");
			}
			else
			{ // when the end point exceed the max xtopemax limit, we draw up to the limit
				if (x != xtopemax)
				{
					if (ultima_tecla_pulsada != teclas.RIGHT && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, xtopemax, y, papel, grosor_linea_dibujo);
					x = xtopemax;
					ultima_tecla_pulsada = teclas.RIGHT;
					console.log("Avance RECORTANDO EN X");
				}
				else
				{ // finally, if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE DERECHO");
				}
			}
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
		break;

		// go up-right
		case teclas.P:
		case teclas.E:
		case teclas.Y:
			xobjetivo = x + offset; // estas serían las coordenadas x e y finales
			yobjetivo = y - offset; // después de aplicar el desplazamiento
			x_avanza_recortando_y = y - ytopemin; // lo que debe avanzar en coorderada x o y cuando
			y_avanza_recortando_x = xtopemax - x; // xobjetivo o yobjetivo están fuera de limites

			if ((xobjetivo <= xtopemax) && (yobjetivo >= ytopemin)) 
			{ // ojetivo dentro de limites o justo en el limite entonces avance normal
				if (ultima_tecla_pulsada != teclas.P && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, xobjetivo, yobjetivo, papel, grosor_linea_dibujo);
				x = xobjetivo;
				y = yobjetivo;
				ultima_tecla_pulsada = teclas.P;
				console.log("Avance DIAGONAL NORMAL");
			}
			else if ((xobjetivo <= xtopemax) && (yobjetivo < ytopemin))
			{ // ojetivo x dentro de limites y objetivo y fuera de limites entonces avance recortando y
				if (y != ytopemin)
				{
					if (ultima_tecla_pulsada != teclas.P && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, x + x_avanza_recortando_y, ytopemin, papel, grosor_linea_dibujo);
					x = x + x_avanza_recortando_y;
					y = ytopemin;
					ultima_tecla_pulsada = teclas.P;
					console.log("Anvance DIAGONAL hasta el LÍMITE en Y");
				}
				else
				{ // if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE INFERIOR en Y (DIAGONAL)");
				}
			}
			else if ((xobjetivo > xtopemax) && (yobjetivo >= ytopemin))
			{ // ojetivo x fuera de limites y objetivo y dentro de limites entonces avance recortando x
				if (x != xtopemax)
				{
					if (ultima_tecla_pulsada != teclas.P && quiere_punto_giro) dibujarPuntoGiro();
					dibujarLinea(color_linea_dibujo, x, y, xtopemax, y - y_avanza_recortando_x, papel, grosor_linea_dibujo);
					y = y - y_avanza_recortando_x;
					x = xtopemax;
					ultima_tecla_pulsada = teclas.P;
					console.log("Anvance DIAGONAL hasta el LÍMITE en X");
				}
				else
				{ // if we are already in the limit, nothing to do, don't move
					console.log("Se ha ALCANZADO LIMITE DERECHO en X (DIAGONAL)");
				}
			}
			else
			{
				console.log("	* - Límite SUPERIOR-DERECHO superado");
			}
			console.log("xobjetivo: " + xobjetivo + " * yobjetivo: " + yobjetivo);
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
		break;

		// do something special 
		case teclas.SPACE:
		case teclas.L:
		case teclas.S:
		case teclas.G:
			dibujarPuntoGordo(); // when press spacebar we do something special
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
			break;
		default: // always print by console the keyCode pressed by user 
			// console.log("Tecla pulsada: " + evento.keyCode);
			mensaje_coordenadas.innerHTML = textos.COORDENADAS + textos.COORDS_ACT + "[ x: " + x + ", y: " + y + " ]";
			break;
	}
	// also print by console the coordinate where we are
	console.log("Coordenada - [ " + x + ", " + y + " ]");
}

function aleatorio(min, max)
{
	var resultado;
	resultado = Math.floor(Math.random() * (max - min + 1)) + min;
	return resultado;
}

function ajustarARejilla(numero, rejilla, limite)
{
	// returns the number closest to the grid size
	// numero must be between 0 and limite
	// the grid should be as high as half the limit

	if (numero % rejilla == 0)
	{ // if numero already is multiple of rejilla it's ok
		return numero;
	}
	else
	{	
		var multiplo_siguiente = numero;
		do { // find the next rejilla's multiple 
			multiplo_siguiente += 1;
		} while (multiplo_siguiente % rejilla != 0);

		var multiplo_anterior = numero;
		do { // find the previous rejilla's multiple
			multiplo_anterior -= 1;
		} while (multiplo_anterior % rejilla != 0);

		if ( (multiplo_siguiente - numero) <= (numero - multiplo_anterior) )
		{ // numero is closest than multiplo_siguiente (or same distance)
			if (multiplo_siguiente > limite)
			{ // but exceed limit
				return multiplo_anterior;
			}
			else
			{ // but don't exceed limit
				return multiplo_siguiente;
			}
		}
		else
		{ // numero is closest than multiplo_anterior
			if (multiplo_anterior < 0)
			{ // but exeed limit 0
				return multiplo_siguiente;
			}
			else
			{ // but don't exceed limit 0
				return multiplo_anterior;
			}
		}
	}
}
