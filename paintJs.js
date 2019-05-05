/* PaintJs - A simple way to paint with keyboard in Javascript */

// we will load background image always the first before other items
// we will know when background is loaded with cargaOk
// image fondo only will show if quiere_imagen_fondo its true
var quiere_imagen_fondo = true;
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
			          AZUL: "blue",
			   		  CIAN: "cyan",
			   		  ROJO: "red",
			   		  ROSA: "pink",
			   		 NEGRO: "black"
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

// line for canvas limits
var color_linea_borde = colores.GRIS_OSCURO; // this is the perimeter line
var grosor_linea_borde = 5;
var quiere_dibujar_bordes = true;

// configure grid
var rejilla = 10; // the number of pixel for grid space
var color_linea_rejilla = colores.GRIS_CLARO; // grid's line color
var grosor_linea_rejilla = 1; // 1 for better results (many lines in grid)
var quiere_dibujar_rejilla = true; // if wants show the grid

var color_linea_aspa = color_linea_rejilla; // central blade's line color
var grosor_linea_aspa = grosor_linea_rejilla;
var quiere_dibujar_aspa = true;

// stroke speed, number of pixels that moves to draw each time the key is pressed
var offset = 15; 

// initial point
var color_punto_inicial = colores.ROJO;
var grosor_punto_inicial = 5;
var quiere_punto_inicial = true; // paint initial point

// configure line for draw
var color_linea_dibujo = colores.AZUL;
var grosor_linea_dibujo = 2;
var quiere_punto_giro = true; // if you dont like square this will draw beatifull corners
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
	if (quiere_dibujar_bordes) dibujarBordesPapel(); // want to paint border line at last
	if (quiere_punto_inicial) dibujarPuntoInicial(); // but initial point over
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
					y =  ytopemin;
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
					y =  ytopemax;
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
					y =  ytopemax;
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
					y =  ytopemin;
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
