var teclas = { UP: 38,
			 LEFT: 37,
			 DOWN: 40,
			RIGHT: 39,
			SPACE: 32
		};
var evento_tecla = "keydown";
var ultima_tecla_pulsada = teclas.SPACE; // inizilice with some key, like spacebar

var area_dibujo = document.getElementById("area_de_dibujo");
var papel = area_dibujo.getContext("2d");

// canvas limits
var xlimite = 500;
var ylimite = 500;

// initial random coords, from min 1 and max limit - 1
var x = aleatorio(1, (xlimite - 1) );
var y = aleatorio(1, (ylimite - 1) );

var offset = 100; // stroke speed, number of pixels that moves to draw each time the key is pressed
var color_punto_inicial = "red";
var grosor_punto_inicial = 5;

var color_linea_dibujo = "blue";
var grosor_linea_dibujo = 5;
var quiere_punto_giro = true; // if you don`t like square this will draw beatifull corners`
var color_punto_giro = color_linea_dibujo;
var grosor_punto_giro = grosor_linea_dibujo; // simmilar to grosor_linea_dibujo to best results

var color_punto_gordo = "red"; // when user tap spacebar draw a "punto_gordo" X
var grosor_punto_gordo = 15;

var color_linea_borde = "grey"; // this is the perimeter line
var grosor_linea_borde = 1;

var color_linea_aspa = color_linea_borde; // line of the central blade
var grosor_linea_aspa = grosor_linea_borde;

var factor_aprox = 0; // experimental, set to 0 for a normal behaviour

// we will load background image always the first before other items
// we will know when background is loaded with cargaOk
var fondo = {
	url: "fondo.png",
	cargaOk: false
};

var imagenFondo = new Image();
imagenFondo.src = fondo.url;
imagenFondo.addEventListener("load", cargarFondo);

// each time user do evento_tecla we call dibujarConTeclas function
document.addEventListener(evento_tecla, dibujarConTeclas);

// we show in body the initial coordinate
document.write("Coordenada inicial - [ X: " + x + ", Y: " + y + " ]");

function cargarFondo()
{
	fondo.cargaOk = true;
	papel.drawImage(imagenFondo, 0, 0);
	dibujarBordesPapel();
	dibujarAspa();
	dibujarPuntoInicial();
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
		console.log("Las imágenes de fondo no están listas: ");
		console.log("* - " + fondo.url + " ha cargado? " + fondo.cargaOk);
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

function dibujarConTeclas(evento)
{
	switch (evento.keyCode)
	{
		case teclas.UP:
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
		case teclas.LEFT:
			if (x - offset > factor_aprox)
			{
				if (ultima_tecla_pulsada != teclas.K && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, x - offset, y, papel, grosor_linea_dibujo);
				x = x - offset;
				ultima_tecla_pulsada = teclas.LEFT;
			}
			else if (x > 0)
			{
				if (ultima_tecla_pulsada != teclas.K && quiere_punto_giro) dibujarPuntoGiro();
				dibujarLinea(color_linea_dibujo, x, y, 0, y, papel, grosor_linea_dibujo);
				x = 0;
				ultima_tecla_pulsada = teclas.LEFT;
			}
			else
			{
				console.log("	* - Límite IZQUIERDO superado");
			}
		break;
		case teclas.DOWN:
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
		case teclas.RIGHT:
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
		case teclas.SPACE:
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

