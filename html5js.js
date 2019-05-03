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

// store the key's keyCode for check later with key was pressed
var teclas = { UP: 38,
				O: 79,
				W: 87,
				I: 73,
				Q: 81,
			 LEFT: 37,
			 	K: 75,
			 	A: 65,
			 COMA: 188,
			 	Z: 90,
			 DOWN: 40,
			PUNTO: 190,
				X: 88,
			GUION: 189,
				C: 67,
			RIGHT: 39,
				Ñ: 186,
				D: 68,
				P: 80,
				E: 69,
			SPACE: 32,
				L: 76,
				S: 83
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

// configure the key pressed behavior to catch
// try keyup for draw carefuly, try keydown to quickly
var evento_tecla = "keydown";
var ultima_tecla_pulsada = teclas.SPACE; // inizilice with some key, like spacebar

// get canvas from html
var area_dibujo = document.getElementById("area_de_dibujo");
var papel = area_dibujo.getContext("2d");

// canvas limits (its recommended that it be the same size as in the html)
var xlimite = 500;
var ylimite = 500;

// line for canvas limits
var color_linea_borde = colores.GRIS_OSCURO; // this is the perimeter line
var grosor_linea_borde = 5;
var quiere_dibujar_bordes = true;

// configure grid
var rejilla = 20; // the number of pixel for grid space
var color_linea_rejilla = colores.GRIS_CLARO; // grid's line color
var grosor_linea_rejilla = 1; // 1 for better results (many lines in grid)
var quiere_dibujar_rejilla = true; // if wants show the grid

var color_linea_aspa = color_linea_rejilla; // central blade's line color
var grosor_linea_aspa = grosor_linea_rejilla;
var quiere_dibujar_aspa = true;

// stroke speed, number of pixels that moves to draw each time the key is pressed
var offset = 10; 

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
var color_punto_gordo = color_punto_inicial; // when user tap spacebar draw a "punto_gordo" X
var grosor_punto_gordo = 10; // more than 5 it starts to look like a cross X, less like a a point

var factor_aprox = 0; // experimental, set to 0 for a normal behaviour

// initial random coords, from min 1 and max limit - 1 and fitted to the grid
x = ajustarARejilla(aleatorio(1, (xlimite - 1)), rejilla, xlimite);
y = ajustarARejilla(aleatorio(1, (ylimite - 1)), rejilla, ylimite);

// each time user do evento_tecla we call dibujarConTeclas function
document.addEventListener(evento_tecla, dibujarConTeclas);

// we show in html body the initial coordinate
document.write("Coordenada inicial - [ X: " + x + ", Y: " + y + " ]");

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
		console.log("linea rejilla desde [ 0, " + i +"] hasta [ " + xlimite + ", " + i + "] ");
	}

	for (var i = 0; i < xlimite; i = i + rejilla)
	{ // paint vertical lines
		dibujarLinea(color_linea_rejilla, i, 0, i, ylimite, papel, grosor_linea_rejilla);
		console.log("linea rejilla desde [ " + i +", 0 ] hasta [ " + i + ", " + ylimite + "] ");
	}
}

function dibujarConTeclas(evento)
{
	switch (evento.keyCode)
	{
		// go UP
		case teclas.UP:
		case teclas.O:
		case teclas.W:
			if (y - offset > factor_aprox) // when the end point does not exceed canva's limits
			{
				if (ultima_tecla_pulsada != teclas.UP && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, x, y - offset, papel, grosor_linea_dibujo);
				y = y - offset;
				ultima_tecla_pulsada = teclas.UP;
			}
			else if (y > 0) // when the end point exceed canva's limits we draw up to the limits
			{
				if (ultima_tecla_pulsada != teclas.UP && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, x, 0, papel, grosor_linea_dibujo);
				y = 0;
				ultima_tecla_pulsada = teclas.UP;
			}
			else // when user allready are on the limit and tap again the key 
			{
				console.log("	* - Límite SUPERIOR superado");
			}		
		break;
		// go left
		case teclas.LEFT:
		case teclas.K:
		case teclas.A:
			if (x - offset > factor_aprox)
			{
				if (ultima_tecla_pulsada != teclas.LEFT && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, x - offset, y, papel, grosor_linea_dibujo);
				x = x - offset;
				ultima_tecla_pulsada = teclas.LEFT;
			}
			else if (x > 0)
			{
				if (ultima_tecla_pulsada != teclas.LEFT && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, 0, y, papel, grosor_linea_dibujo);
				x = 0;
				ultima_tecla_pulsada = teclas.LEFT;
			}
			else
			{
				console.log("	* - Límite IZQUIERDO superado");
			}
		break;
		// go down
		case teclas.DOWN:
		case teclas.PUNTO:
		case teclas.X:
			if (y + offset < ylimite - factor_aprox)
			{
				if (ultima_tecla_pulsada != teclas.DOWN && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, x, y + offset, papel, grosor_linea_dibujo);
				y = y + offset;
				ultima_tecla_pulsada = teclas.DOWN;
			}
			else if (y < ylimite)
			{
				if (ultima_tecla_pulsada != teclas.DOWN && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, x, ylimite, papel, grosor_linea_dibujo);
				y = ylimite;
				ultima_tecla_pulsada = teclas.DOWN;
			}
			else
			{
				console.log("	* - Límite INFERIOR superado");
			}		
		break;
		// go right
		case teclas.RIGHT:
		case teclas.Ñ:
		case teclas.D:
			if (x + offset < xlimite - factor_aprox)
			{
				if (ultima_tecla_pulsada != teclas.RIGHT && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, x + offset, y, papel, grosor_linea_dibujo);
				x = x + offset;
				ultima_tecla_pulsada = teclas.RIGHT;
			}
			else if (x < xlimite)
			{
				if (ultima_tecla_pulsada != teclas.RIGHT && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, xlimite, y, papel, grosor_linea_dibujo);
				x = xlimite;
				ultima_tecla_pulsada = teclas.RIGHT;
			}
			else
			{
				console.log("	* - Límite DERECHO superado");
			}
		break;
		// do something special 
		case teclas.SPACE:
		case teclas.L:
		case teclas.S:
			dibujarPuntoGordo(); // when press spacebar we do something special
			break;
		default: // always print by console the keyCode pressed by user 
			console.log("Tecla pulsada: " + evento.keyCode);
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
	// rejilla must be maximun half of limite

	if (numero % rejilla == 0)
	{ // if numero already is multiple of rejilla its ok
		return numero;
	}
	else
	{	
		var multiplo_siguiente = numero;
		do { // find the next rejilla's multiple 
			multiplo_siguiente += 1;
		} while (multiplo_siguiente % rejilla != 0);

		var multiplo_anterior = numero;
		do { // find de previous rejilla's multiple
			multiplo_anterior -= 1;
		} while (multiplo_anterior % rejilla != 0);

		if ( (multiplo_siguiente - numero) <= (numero - multiplo_anterior) )
		{ // numero is closet than multiplo_siguiente (or same distance)
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
		{ // numero is closet than multiplo_anterior
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
