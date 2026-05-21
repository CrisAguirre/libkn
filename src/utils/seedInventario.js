/**
 * SEED DE INVENTARIO FICTICIO — DEMOSTORE
 * Ejecutar: node src/utils/seedInventario.js
 * 
 * Para inventario real: editar los arrays de productos con
 * los datos de tu toma física, luego ejecutar.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');


// ─── Arreglo de Productos para Inyección ─────────────────────────
// Formato: ['Nombre del Producto', 'COD_CATEGORIA', 'COD_PROVEEDOR', precioCompra, precioVenta, stock, minStock]
// Ejemplo: ['Coca Cola 350ml', 'BEB', '07', 1500, 2000, 48, 12]
const PRODUCTOS = [
    ['Coca-Cola 400 ml', 'BEB', '07', 3000, 2500, 24, 5],
    ['Quatro 400 ml', 'BEB', '07', 2500, 2091, 24, 5],
    ['Coca-Cola 250 ml', 'BEB', '07', 1500, 1200, 24, 5],
    ['Quatro 250 ml', 'BEB', '07', 1500, 1200, 24, 5],
    ['Powerade 500 ml', 'BEB', '07', 3500, 3166, 24, 5],
    ['Schweeps 400 ml', 'BEB', '07', 2500, 2091, 24, 5],
    ['Jugo del Valle 400 ml', 'BEB', '07', 2200, 1666, 24, 5],
    ['*Sprite 400 ml', 'BEB', '07', 2500, 2091, 24, 5],*
    ['Quatro 1.5L', 'BEB', '07', 4500, 3750, 24, 5],
    ['Quatro 2.5L', 'BEB', '07', 6000, 5000, 24, 5],
    ['Coca-Cola 1.5L', 'BEB', '07', 6000, 5000, 24, 5],
    ['Coca-Cola 3L', 'BEB', '07', 11000, 9553, 24, 5],
    ['Coca-Cola 1L', 'BEB', '07', 4500, 3750, 24, 5],
    ['Jugo del Valle 1.5L', 'BEB', '07', 4500, 3750, 24, 5],
    ['Jugo del Valle frutos rojos 1.5L', 'BEB', '07', 4500, 2866, 24, 5],
    ['Coca-Cola 2.5L', 'BEB', '07', 7500, 6675, 24, 5],
    ['Coca Cola 250 ml', 'BEB', '07', 2000, 1600, 24, 5],
    ['Coca Cola 400 ml cero azúcar', 'BEB', '07', 3000, 2400, 24, 5],

    ['Speedlata 310 ml', 'BEB', '05', 2000, , 24, 5],
    ['Speed Botella plástico 250 ml', 'BEB', '05', 1500, , 24, 5],
    ['Postobon sabores 1 L', 'BEB', '05', 3500, , 24, 5],
    ['Postobón sabores 1.5 L', 'BEB', '05', 4500, , 24, 5],
    ['Postobón sabores 2 L', 'BEB', '05', 6000, , 24, 5],
    ['H2O 1.5L', 'BEB', '05', 4000, , 24, 5],
    ['H2O 600 ml', 'BEB', '05', 2500, , 24, 5],
    ['Postobón sabores 3 L', 'BEB', '05', 7000, , 24, 5],
    ['Postobón sabores 250 ml', 'BEB', '05', 1000, , 24, 5],
    ['Jugo hit caja 1 L', 'BEB', '05', 4500, , 24, 5],
    ['Jugo hit botella 1 L', 'BEB', '05', 5000, , 24, 5],
    ['Gatorade 500 ml', 'BEB', '05', 4000, , 24, 5],
    ['H2O 250 ml', 'BEB', '05', 1200, , 24, 5],
    ['Bretaña 250 ml', 'BEB', '05', 2500, , 24, 5],
    ['Bretaña 1.5 L', 'BEB', '05', 4500, , 24, 5],
    [' Agua cristal 600 ml', 'BEB', '05', 1500, , 24, 5],
    [' Agua cristal 1 L', 'BEB', '05', 2000, 2000, 24, 5],

    [' Poker litrazo Botella vidrio', 'BEB', '08', 6000, 4607, 24, 5],
    [' Poker lata 330 ml', 'BEB', '08', 3500, , 24, 5],
    [' Poker lata 473 ml', 'BEB', '08', 4500, 3333, 24, 5],
    [' Budweiser Lata 269 ml', 'BEB', '08', 3000, , 24, 5],
    [' Kauffman Lata 310 ml', 'BEB', '08', 2000, 1416, 24, 5],
    [' Club Colombia 330 ml', 'BEB', '08', 4000, , 24, 5],
    [' Corona 330 ml botella', 'BEB', '08', 5000, 3364, 24, 5],
    [' Corona Sixpack 330 ml', 'BEB', '08', 25000, 20186, 24, 5],
    [' Poker sixPack', 'BEB', '08', 20000, , 24, 5],
    [' Poker latón Six Pack 473 ml', 'BEB', '08', 23000, , 24, 5],
    [' Coronita 210 ml', 'BEB', '08', 3500, 2937, 24, 5],

    [' Coronita SixPack', 'BEB', '09', 20000, 17625, 24, 5],
    [' Pony 2 L', 'BEB', '09', 7000, , 24, 5],
    [' pony 1.5 L', 'BEB', '09', 6500, , 24, 5],
    [' Pony 1 L', 'BEB', '09', 4500, , 24, 5],
    [' Kauffmann Six Pack 310 ml', 'BEB', '09', 12000, 8500, 24, 5],
    [' Pony personal 330 ml', 'BEB', '09', 2700, , 24, 5],
    [' Pony mini 250 ml', 'BEB', '09', 1800, 1569, 24, 5],
    [' Electrolit 625 ml', 'BEB', '09', 8500, 7352, 24, 5],
    [' Cola y pola 269 ml', 'BEB', '09', 2000, , 24, 5],
    [' Cola y pola 1.5 L', 'BEB', '09', 4500, , 24, 5],

    [' Sporade 1.1 L', 'BEB', '06', 4500, 3750, 24, 5],
    [' Big cola Sabores 400 ml', 'BEB', '06', 1500, , 24, 5],
    [' Cifruit 400 ml', 'BEB', '06', 1500, 1112, 24, 5],
    [' Sporade 500 ml', 'BEB', '06', 2500, , 24, 5],
    [' Cifruit sabores 1.7 L', 'BEB', '06', 3500, 2981, 24, 5],
    [' Cifruit 250 ml', 'BEB', '06', 1000, 800, 24, 5],
    [' Agua Cielo 1 L', 'BEB', '06', 2000, 1620, 24, 5],
    [' Bigcola sabores 1 L', 'BEB', '06', 2600, , 24, 5],
    [' Big Cola sabores 1.8 L', 'BEB', '06', 3800, , 24, 5],
    [' Big Cola Sabores 3 L', 'BEB', '06', 6500, 5250, 24, 5],
    [' Agua cielo sabores 1 L', 'BEB', '06', 2000, , 24, 5],
    [' Soda big cola 2100 ml', 'BEB', '06', 1500, , 24, 5],
    [' Volt lata 473 ml', 'BEB', '06', 3000, , 24, 5],
    [' Bolt botella 250 ml', 'BEB', '06', 1000, , 24, 5],
    [' Agua Cielo 600 ml', 'BEB', '06', 1000, , 24, 5],

    [' Cigarra 400 ml', 'BEB', '12', 1500, , 24, 5],
    [' Cigarra 1.5 L', 'BEB', '12', 4000, , 24, 5],
    [' Agua cigarra 6 L', 'BEB', '12', 3500, , 24, 5],

    [' Agua mía 600 ml', 'BEB', '13', 1000, , 24, 5],
    [' Agua mia 1 L', 'BEB', '13', 2000, , 24, 5],
    [' Agua mía gas 600 ml', 'BEB', '13', 1500, , 24, 5],
    [' *Agua mía gas 1.5 L', 'BEB', '13', 3000, , 24, 5],

    [' Vive 100 380 ml', 'BEB', '35', 2500, , 24, 5],
    [' Vive 100 240 ml', 'BEB', '35', 2000, , 24, 5],
    [' Hidralite 640 ml', 'BEB', '35', 4000, 3450, 24, 5],
    [' Sabiloe de 320 ml', 'BEB', '35', 2500, 2083, 24, 5],
    [' Cuates 269 ml', 'BEB', '35', 6000, 4666, 24, 5],
    [' Frutiño 10 gr', 'BEB', '35', 1000, , 24, 5],
    [' Voca 10 gr', 'BEB', '35', 800, , 24, 5],
    [' Panelada caja de 29 unidades', 'BEB', '35', 1500, , 24, 5],
    [' Gelatina Frutiño 14 Gr', 'BEB', '35', 1800, , 24, 5],
    [' Gelatina sin sabor 15 gr', 'BEB', '35', 2000, , 24, 5],
    [' Suntea 12 Gr', 'BEB', '35', 1500, , 24, 5],
    [' Kipitos 8 Gr', 'BEB', '35', 600, 499, 24, 5],
    [' Amper 473 ml', 'BEB', '35', 3000, , 24, 5],
    [' Ricostilla Completísimo doña gallina Polvo', 'BEB', '35', 500, 334, 24, 5],
    [' Cubo ricostilla', 'BEB', '35', 500, 334, 24, 5],
    [' Trizasón 20 Gr', 'BEB', '35', 1000, 741, 24, 5],

    [' Cerveza Heineken Sixpack 310 ml', 'BEB', '5', 18000, , 24, 5],
    [' Cerveza Heineken 310 ml', 'BEB', '5', 3000, , 24, 5],
    [' Cerveza Tecate 473 ml', 'BEB', '5', 3500, 2833, 24, 5],
    [' Cerveza Tecate 330 ml', 'BEB', '5', 3000, , 24, 5],
    [' Cerveza Andina 473 ml', 'BEB', '5', 3500, 2833, 24, 5],
    [' Chocolatada Bilac 180 ml', 'LAC', '5', 2000, , 24, 5],
    [' Avena Bilac', 'LAC', '5', 2000, , 24, 5],

    [' Yogurt Victoria paquete x8', 'LAC', '9', 8500, , 24, 5],
    [' Yogurt Victoria unidad 150 ml', 'LAC', '9', 1200, , 24, 5],
    [' Kumis 150 ml', 'LAC', '9', 1200, , 24, 5],
    [' Yogurt light 150 ml ', 'LAC', '9', 1200, , 24, 5],

    [' Yogo premio 150 ml', 'LAC', '10', 4000, , 24, 5],
    [' Yogo yogo bolsa', 'LAC', '10', 1600, , 24, 5],
    [' Avena bolsa', 'LAC', '10', 2500, , 24, 5],
    [' Arequipe 220 ml', 'LAC', '10', 8500, , 24, 5],
    [' Arequipe 50 ml', 'LAC', '10', 2500, , 24, 5],
    [' Queso esparcible 200 ml', 'LAC', '10', 7500, , 24, 5],
    [' Queso parmesano 40 ml', 'LAC', '10', 5800, , 24, 5],
    [' Leche alpín caja', 'LAC', '10', 3800, , 24, 5],
    [' Avena vaso 250 ml', 'LAC', '10', 4000, , 24, 5],

    [' Leche 1100 ml', 'LAC', '28', 4800, , 24, 5],
    [' Leche 400 ml', 'LAC', '28', 2200, , 24, 5],
    [' Leche 200 ml', 'LAC', '28', 1200, , 24, 5],
    [' Leche deslactosada 1100 ml', 'LAC', '28', 5000, , 24, 5],

    [' Leche 1100 ml', 'LAC', '27', 5000, 4620, 24, 5],
    [' Leche 400 ml', 'LAC', '27', 2200, 1700, 24, 5],
    [' Leche 200 ml', 'LAC', '27', 1200, 950, 24, 5],
    [' Leche deslactosada 1100 ml', 'LAC', '27', 5000, 4590, 24, 5],
    [' Crema De leche 125 ml', 'LAC', '27', 3000, 2550, 24, 5],
    [' Crema De leche 170 ml', 'LAC', '27', 4500, 3850, 24, 5],

    ['Doritos 285 gr', 'SNA', '17', 8000, , 24, 3],
    ['DeTodito Familiar 765 gr', 'SNA', '17', 8000, , 24, 3],
    ['Choclitos 210 gr', 'SNA', '17', 7000, , 24, 3],
    ['Papa Margarita 105 gr', 'SNA', '17', 7000, , 24, 3],
    ['Cheetos 160 gr', 'SNA', '17', 6500, , 24, 3],
    ['Choclitos Bolsaza 125 gr', 'SNA', '17', 4000, , 24, 3],
    ['Cheese Trese 120 gr', 'SNA', '17', 4000, , 24, 3],
    ['De Todito Bolsaza 80 gr', 'SNA', '17', 4000, , 24, 3],
    ['Doritos Bolsaza 80 gr', 'SNA', '17', 4000, , 24, 3],
    ['Margarita Bolsaza 75 gr', 'SNA', '17', 4000, , 24, 3],
    ['DeTodito 50 gr', 'SNA', '17', 2800, , 24, 3],
    ['Doritos Limon 50 gr', 'SNA', '17', 2800, , 24, 3],
    ['Doritos BBQ 41 gr', 'SNA', '17', 2500, , 24, 3],
    ['Doritos 41 gr', 'SNA', '17', 2500, , 24, 3],
    ['Papa Margarita 35 gr', 'SNA', '17', 2300, 1990, 24, 3],
    ['Papa Margarita Normal 31 gr', 'SNA', '17', 2300, 1990, 24, 3],
    ['Cheese Trese pequeño 48 gr', 'SNA', '17', 2000, , 24, 3],
    ['Cheetos Flamming Hot', 'SNA', '17', 2000, , 24, 3],
    ['Cheetos 40 gr', 'SNA', '17', 2000, , 24, 3],
    ['Cheetos Horneaditos 34 gr', 'SNA', '17', 2000, , 24, 3],
    ['Cheetos Boliqueso', 'SNA', '17', 2000, , 24, 3],
    ['Choclitos miel y picante 45 gr', 'SNA', '17', 2000, , 24, 3],
    ['Galletas Chokis 37 gr', 'SNA', '17', 1600, , 24, 3],
    ['Chokis Bolitas', 'SNA', '17', 1500, , 24, 3],
    ['Choclitos Mini 27 gr', 'SNA', '17', 1200, , 24, 3],
    ['Doritos Jalapeñ1 41 gr', 'SNA', '17', 2500, , 24, 3],
    ['Manimoto', 'SNA', '17', 1700, 1400, 24, 3],

    ['Rizadas 205 gr', 'SNA', '34', 6200, , 24, 3],
    ['Golpe con Todo 140 gr', 'SNA', '34', 7200, , 24, 3],
    ['Palomitas grande 170 gr', 'SNA', '34', 5000, , 24, 3],
    ['Tocineta 100 gr', 'SNA', '34', 6000, , 24, 3],
    ['Tocineta 25 gr', 'SNA', '34', 2000, 1766, 24, 3],
    ['Rizadas Sabores 45 gr', 'SNA', '34', 3000, , 24, 3],
    ['Rizadas Sabores 35 gr', 'SNA', '34', 2100, , 24, 3],
    ['Palomitas 68 gr', 'SNA', '34', 2000, 1766, 24, 3],
    ['Golpe Contodo 50 gr sabores', 'SNA', '34', 2500, , 24, 3],
    ['Tostinaños 28 gr', 'SNA', '34', 1300, , 24, 3],
    ['Tostiempanada 28 gr', 'SNA', '34', 1300, , 24, 3],
    ['Supertatos 30 gr', 'SNA', '34', 1700, , 24, 3],
    ['Ticos 38 gr', 'SNA', '34', 1000, , 24, 3],

    ['Maicitos sabores 215 gr', 'SNA', '23', 7000, , 24, 3],
    ['Maicitos sabores 45 gr', 'SNA', '23', 2000, , 24, 3],
    ['Maicitos arepita 35 gr', 'SNA', '23', 1600, , 24, 3],
    ['Chicharrones 15 gr', 'SNA', '23', 2500, , 24, 3],
    ['Picmix 45 gr', 'SNA', '23', 2500, , 24, 3],
    ['Chocoramo 65 gr', 'SNA', '23', 2700, 2248, 24, 3],
    ['Barra Chocoramo 40 gr', 'SNA', '23', 2300, , 24, 3],
    ['Gala tajada 60 gr', 'SNA', '23', 2200, 1712, 24, 3],
    ['Chocoramo Miti 40 gr', 'SNA', '23', 2000, , 24, 3],
    ['Gancito 37 gr', 'SNA', '23', 2000, , 24, 3],
    ['Torta 230 gr', 'SNA', '23', 6500, , 24, 3],
    ['Browni Chocoramo 60 gr', 'SNA', '23', 3500, , 24, 3],
    ['Tostacos 38 gr', 'SNA', '23', 2200, , 24, 3],
    ['Tostacos 200 gr', 'SNA', '23', 8000, , 24, 3],


    ['Chocoso 65 gr', 'SNA', '22', 2500, , 24, 3],
    ['Browni 65 gr', 'SNA', '22', , , 24, 3],
    ['Subamrino sabores 35 gr', 'SNA', '22', 1800, , 24, 3],
    ['Torta Maricella 230 gr', 'SNA', '22', 6500, , 24, 3],
    ['Takis sabores 50 gr', 'SNA', '22', 3700, , 24, 3],
    ['Takis sabores 35 gr', 'SNA', '22', 2000, , 24, 3],
    ['Takis sabores grande', 'SNA', '22', 7000, , 24, 3],


    ['Papa combinada BBQ 50 gr', 'SNA', '42', 2500, , 24, 3],
    ['Papa Gloria sabores 60 gr', 'SNA', '42', 1800, , 24, 3],
    ['Yenny fosforito 30 gr', 'SNA', '42', 1300, , 24, 3],
    ['Yenny fosforito 170 gr', 'SNA', '42', 4500, , 24, 3],
    ['Yenny fosforito 100 gr', 'SNA', '42', 3500, , 24, 3],
    ['Papa paquete', 'SNA', '42', 2000, , 24, 3],
    ['Patacón paquete', 'SNA', '42', 1800, , 24, 3],
    ['Papa mexicana 30 gr', 'SNA', '42', 1000, , 24, 3],
    ['Maicitos Limón 50 gr', 'SNA', '42', 2000, , 24, 3],
    ['Rosquitas Limón 18 gr', 'SNA', '42', 1000, , 24, 3],

    //Dulces y Dulces
    ['Bicabonto Osa 25gr', 'SNA', '39', 497, 700, 24, 5],
    ['Bicabonto Osa 500gr', 'SNA', '39', 3629, 4500, 24, 5],
    ['Trocipollo 30gr', 'SNA', '39', 1380, 1600, 24, 5],
    ['Chao pastilla sabores x16', 'SNA', '39', 800, 1000, 24, 5],
    ['Barra bianchi mini', 'SNA', '39', 877, 1000, 24, 5],
    ['Rey Chapetta 55gr', 'SNA', '39', 1383, 1800, 24, 5],
    ['Riopaila azucar morena 1 Kg', 'SNA', '39', 3982, 4800, 24, 5],
    ['Jabon adulto surtidso', 'SNA', '39', 1500, 2000, 24, 5],
    ['Jojo Fruna Zombie surtido', 'SNA', '39', 2465, 500, 24, 5],
    ['Zucaritas', 'SNA', '39', 1110, 1500, 24, 5],
    ['Mantequilla Rama Tradicional 170gr', 'SNA', '39', 3792, 4800, 24, 5],
    ['Mermelada 80 gr sabores', 'SNA', '39', 1994, 2500, 24, 5],
    ['Barrilete surtido ', 'SNA', '39', 242, 400, 24, 5],
    ['Lokiño Surtido pack x100', 'SNA', '39-16', 7951, 9000, 24, 5],
    ['Lokiño Surtido unidad', 'SNA', '39', 79, 100, 24, 5],
    ['Trululu Surtido 35gr', 'SNA', '39-16', 1498, 2000, 24, 5],
    ['Trululu Lenguas Blex', 'SNA', '39', 1805, 2500, 24, 5],
    ['OKA Nano Grageada', 'SNA', '39', 1858, 2500, 24, 5],
    ['Tiktak fruit', 'SNA', '39', 2127, 2500, 24, 5],
    ['Oka Loka Fusion', 'SNA', '39', 935, 1200, 24, 5],
    ['Galleta Glasita Surtida', 'SNA', '39', 934, 1200, 24, 5],
    ['Tajin Clásico 45 gr', 'SNA', '39', 6887, 8000, 24, 5],
    ['Cereal Kellowgs 115gr', 'SNA', '39', 4725, 5500, 24, 5],
    ['Guantes Tallas varias', 'ASH', '39', 4607, 5500, 24, 5],
    ['Talco Yodora 60gr', 'SNA', '39', 4800, 6000, 24, 5],
    ['Sobres comida humeda 85gr', 'MAS', '39', 2400, 3000, 24, 5],

    //Puyo
    ['Guante Bicolor c25 tallas varias', 'ASH', '15', 4277, 5500, 24, 5],
    ['Copa blanca', 'VAR', '15', 1595, 2000, 24, 5],
    ['Vaso 7 Onzas colores', 'VAR', '15', 1801, 2500, 24, 5],
    ['Gragante Jabon Barra', 'ASP', '15', 1972, 2500, 24, 5],
    ['Tucol 10ml', 'MED', '15', 1550, 2000, 24, 5],
    ['BombonBum Sabores paquete', 'SNA', '15', 8696, 10000, 24, 5],
    ['BombonBum Sabores unidad', 'SNA', '15', 362, 500, 24, 5],
    ['Pirulito surtido paquete', 'SNA', '15', 3678, 4500, 24, 5],
    ['Pirulito surtido unidad', 'SNA', '15', 153, 200, 24, 5],
    ['Maxcombi surtido paquete', 'SNA', '15', 7305, 8500, 24, 5],
    ['Maxcombi surtido paquete', 'SNA', '15', 73, 100, 24, 5],
    ['Chocodisk sobre', 'SNA', '15', 883, 1200, 24, 5],
    ['Millows Mini', 'SNA', '15', 684, 1000, 24, 5],
    ['Chicle Xplode Acido Linea', 'SNA', '15', 466, 600, 24, 5],
    ['Aji Picante La constancia', 'VAR', '15', 3209, 3800, 24, 5],
    ['Vinagre 230ml', 'VAR', '15', 1452, 2000, 24, 5],
    ['Raid 285 ml', 'VAR', '15', 10698, 13000, 24, 5],
    ['Salsa Soya 100 ml', 'VAR', '15', 1768, 2200, 24, 5],
    ['Fruticas Acidas Sobre', 'SNA', '15', 929, 1200, 24, 5],
    ['Pirulito Neon Polvo acido 14 gr', 'SNA', '15', 609, 1000, 24, 5],
    ['Galleta Wafer Capri Paquete x24', 'SNA', '15', 6314, 8000, 24, 5],
    ['Galleta Wafer Capri Unidad', 'SNA', '15', 263, 400, 24, 5],
    ['Goma Trululu Nanos 100 gr', 'SNA', '16', 2343, 2700, 24, 5],
    ['Goma Trululu Nanos 70 gr', 'SNA', '16', 1735, 2200, 24, 5],
    ['Mermelada San Jorge 80 gr', 'VAR', '16', 1931, 2500, 24, 5],
    ['Pim Pop x24', 'SNA', '16', 7596, 8500, 24, 5],
    ['Pim Pop unidad x24', 'SNA', '16', 316, 500, 24, 5],
    ['Arroz FlorHuila arroba', 'GRA', '16', 42329, 47000, 24, 5],
    ['Arroz FlorHuila unidad 500 gr', 'GRA', '16', 1693, 2000, 24, 5],
    ['Dulce Tamarindo', 'SNA', '16', 8235, 9500, 24, 5],
    ['Revolcon x50', 'SNA', '16', 6838, 8000, 24, 5],
    ['Revolcon unidad', 'SNA', '16', 132, 200, 24, 5],
    ['Blanqueador Mi dia Pet 1800 ml', 'SNA', '16', 3182, 3800, 24, 5],
    ['Sopa Ajinomen 80gr', 'VAR', '16', 2460, 2900, 24, 5],
    ['Suero Pedialite 500 ml', 'BEB', '16', 8728, 10000, 24, 5],
    ['Loza Cream 3000 gr', 'ASH', '16', 14029, 16000, 24, 5],
    ['Ariel regular 100 gr', 'ASH', '16', 1260, 1500, 24, 5],
    ['Sanpic Vainilla 200ml', 'ASH', '16', 1600, 2000, 24, 5],
    ['Vanish Rosa 130 ml', 'ASH', '16', 2000, 2700, 24, 5],
    ['Blanqueador Blancox 500 ml', 'ASH', '16', 1457, 1800, 24, 5],
    ['Lavaloza Cream MI dia 1000 gr', 'SNA', '16', 4800, 5500, 24, 5],

    //Alpina
    ['Gelatina Boggy sabores 108 gr', 'LAC', '10', 2200, 1856, 24, 5],
    ['Gelatina Boggy premio', 'LAC', '10', 3500, 2992, 24, 5],
    ['Alpin Chocolate sabores bolsa 180', 'LAC', '10', 2700, 2251, 24, 5],
    ['Alpin botella sabores', 'LAC', '10', 5000, 4205, 24, 5],
    ['Alpin Sabores caja', 'LAC', '10', 3800, 3154, 24, 5],
    ['Bon Yurt sabores', 'LAC', '10', 4800, 4030, 24, 5],
    ['Mini Bonyurt sabores', 'LAC', '10', 3500, 2978, 24, 5],
    ['Yogo cereal vaso sabores 130 gr', 'LAC', '10', 3200, 2452, 24, 5],
    ['Yogurt original vaso sabores', 'LAC', '10', 3000, 2541, 24, 5],
    ['Alpinette sabores 140 gr', 'LAC', '10', 4500, 3766, 24, 5],
    ['Alpinito sabores 45 gr', 'LAC', '10', 1700, 1401, 24, 5],
    ['Jox multialpin 100 gr', 'LAC', '10', 2800, 2299, 24, 5],
    ['Kumis original 150 gr', 'LAC', '10', 3200, 2692, 24, 5],
    ['Arepa Paisa 350 gr pack x5', 'LAC', '10', 3100, 2676, 24, 5],
    ['Crema de leche 200 ml', 'LAC', '10', 6300, 5344, 24, 5],
    ['Avena original botella', 'LAC', '10', 4800, 3894, 24, 5],
    ['Avena original 250 gr', 'LAC', '10', 4000, 3362, 24, 5],
    ['Arequipe 220 gr', 'LAC', '10', 8500, 7009, 24, 5],
    ['Alpinito sabores 90 gr', 'LAC', '10', 2700, , 24, 5],
    ['Yogo vaso sabores 150 gr', 'LAC', '10', 2200, 1839, 24, 5],
    ['Queso cremosito vaso 200 gr', 'LAC', '10', 7500, 6395, 24, 5],
    ['Yogurt griego sabores 150 gr', 'LAC', '10', 6500, 5167, 24, 5],
    ['Arequipito 50 gr', 'LAC', '10', 2500, , 24, 5],
    ['Avena original 200 gr bolsa', 'LAC', '10', 2500, , 24, 5],

    //La victoria
    ['Yogurt bolsa x8 sabores 150 gr', 'LAC', '10', 8500, 7500, 24, 5],
    ['Yogurt bolsa unidad sabores 150 gr', 'LAC', '10', 1200, 937, 24, 5],

    //Coltabacos
    ['', 'LAC', '32', 3800, , 24, 5],
    ['Malboro Fusion Sandia x10', 'CIG', '32', 8500, 7000, 24, 5],
    ['Malboro Fusion Sandia x20', 'CIG', '32', 17000, 14000, 24, 5],
    ['Malboro Rojo Gold x10', 'CIG', '32', 8000, 6700, 24, 5],
    ['Malboro Rojo Gold x20', 'CIG', '32', 16000, 13400, 24, 5],
    ['Malboro Blue x10', 'CIG', '32', 6500, 5500, 24, 5],
    ['Malboro Blue x20', 'CIG', '32', 13000, 11000, 24, 5],
    ['Malboro Rosa x10', 'CIG', '32', 6500, 5500, 24, 5],
    ['LyM x20', 'CIG', '32', 10500, 8700, 24, 5],
    ['LyM x10', 'CIG', '32', 5500, 4350, 24, 5],
    ['Pielroja sin filtro x18', 'CIG', '32', 12000, 10180, 24, 5],
    ['Caribe x10', 'CIG', '32', 5500, 4680, 24, 5],
    ['Cafe Morasurco 500 gr', 'VAR', '32', , , 24, 5],
    ['Cafe Morasurco 400 gr', 'VAR', '32', 21800, , 24, 5],
    ['Cafe Morasurco 125 gr', 'VAR', '32', 6500, , 24, 5],
    ['Cafe Morasurco 50 gr', 'VAR', '32', 2500, , 24, 5],
    //Alidos
    ['Cafe Sello rojo 500 gr', 'LAC', '19', , , 24, 5],
    ['Cafe Sello rojo 425 gr', 'LAC', '19', 23000, , 24, 5],
    ['Cafe Sello rojo 212 gr', 'LAC', '19', 12800, , 24, 5],
    ['Cafe Sello rojo 110 gr', 'LAC', '19', 6500, , 24, 5],
    ['Cafe Sello rojo 50 gr', 'LAC', '19', 2500, , 24, 5],

    ['Colcafe instantaneo 8 gr', 'VAR', '19', 1500, , 24, 5],
    ['Colcafe instantaneo 19 gr', 'VAR', '19', 1600, , 24, 5],
    ['Fideos Comarico spaguetti corbata 250 gr', 'VAR', '19', 1800, , 24, 5],
    ['Fideos Comarico corbata 250 gr', 'VAR', '19', 1800, , 24, 5],
    ['Fideos Comarico argollitas 250 gr', 'VAR', '19', 1800, , 24, 5],
    ['Fideos Comarico caracol 250 gr', 'VAR', '19', 1800, , 24, 5],
    ['Fideos Comarico corbatin 250 gr', 'VAR', '19', 1800, , 24, 5],
    ['Fideos Comarico macarones 250 gr', 'VAR', '19', 1800, , 24, 5],
    ['Fideos Comarico coditos 250 gr', 'VAR', '19', 1800, , 24, 5],
    ['Fideos Doria Corbata 250 gr', 'VAR', '19', 2200, , 24, 5],
    ['Fideos Doria spaguetti 250 gr', 'VAR', '19', 2200, , 24, 5],
    ['Fideos Doria argollitas 250 gr', 'VAR', '19', 2200, , 24, 5],
    ['Fideos Doria caracol 250 gr', 'VAR', '19', 2200, , 24, 5],
    ['Fideos Doria corbatin 250 gr', 'VAR', '19', 2200, , 24, 5],
    ['Fideos Doria macarones 250 gr', 'LAC', '19', 2200, , 24, 5],
    ['Fideos Doria coditos 250 gr', 'LAC', '19', 2200, , 24, 5],
    ['Fideos Comarico spaguetti 454 gr', 'LAC', '19', 3000, , 24, 5],
    ['Galleta festival 8x8 sabores', 'LAC', '19', 11500, , 24, 5],
    ['Galleta festival unidad sabores', 'LAC', '19', 1500, , 24, 5],
    ['Galleta Saltinas x4 tacos', 'LAC', '19', 7500, , 24, 5],
    ['Galleta Saltinas taco', 'LAC', '19', 2200, , 24, 5],
    ['Galleta Ducales x3 tacos', 'LAC', '19', 8800, , 24, 5],
    ['Galleta Ducales 1 taco', 'LAC', '19', 3000, , 24, 5],
    ['Galleta Golochip 20 gr', 'LAC', '19', 1600, , 24, 5],
    ['Chocolatina Jumbo 90 gr', 'LAC', '19', 8000, , 24, 5],
    ['Chocolatina Jumbo 35 gr', 'LAC', '19', 3600, , 24, 5],
    ['Chocolatina Jet 11 gr', 'LAC', '19', 1000, , 24, 5],
    ['Chocolatina Cookies and cream 11 gr', 'LAC', '19', 1000, , 24, 5],
    ['Burbujet 11.8 gr', 'LAC', '19', 1000, , 24, 5],
    ['Burbujet Crujivainilla 50 gr', 'LAC', '19', 5500, , 24, 5],
    ['Chocolatina Cookies and cream 50g', 'LAC', '19', 5500, , 24, 5],
    //Cansur Nutrecan
    ['Nutrecan Adultos 2 Kg', 'MAS', '24', 13000, 11287, 24, 5],
    ['Nutrecan Adultos 800 gr', 'MAS', '24', 5600, 4675, 24, 5],
    ['Nutrecan Cachorro 500 gr', 'MAS', '24', 4300, 3700, 24, 5],
    ['Sabueso 2 Kg', 'MAS', '24', 10000, 8537, 24, 5],
    ['Sabueso 1 Kg', 'MAS', '24', 5000, 4270, 24, 5],
    ['Sabueso cachorro 1 Kg', 'MAS', '24', 6800, 5800, 24, 5],
    ['Cuida can 1 Kg', 'MAS', '24', 5000, 4000, 24, 5],
    ['Smart 500 gr', 'MAS', '24', 5000, 4313, 24, 5],
    ['Cuida Cat 500 gr', 'MAS', '24', 5000, 4123, 24, 5],
    ['Nutrecan morado 800 gr', 'MAS', '24', 9800, 8400, 24, 5],
    ['Solla Conejos 1 Kg', 'MAS', '24', 3000, 2500, 24, 5],
    ['Comida Humeda Gatos 80 gr', 'MAS', '24', 3000, 2550, 24, 5],
    ['Comida Humeda Perros 80 gr', 'MAS', '24', 3000, 2550, 24, 5],

    //Subir Puyo

    //Surtisur Nariño
    ['Pañal Winnie Etapa 3', 'ASP', '37', 1400, 1185, 24, 5],
    ['Pañal Winnie Etapa 3', 'ASP', '37', 38000, 35575, 24, 5],
    ['Pañal Winnie Etapa 5', 'ASP', '37', 1900, 1623, 24, 5],
    ['Pañal Winnie Etapa 5', 'ASP', '37', 51000, 48700, 24, 5],
    ['Pañal Winnie Etapa 4', 'ASP', '37', 1400, 1185, 24, 5],
    ['Pañal Winnie Etapa 4', 'ASP', '37', 47000, 44369, 24, 5],
    ['Pañal Winnie Etapa 4', 'ASP', '37', 1800, 1478, 24, 5],
    ['Pañal Winnie Etapa 2', 'ASP', '37', 1300, 1180, 24, 5],
    ['Pañal Winnie Etapa 2', 'ASP', '37', 39000, 35400, 24, 5],
    ['Pañal Winnie Etapa 3', 'ASP', '37', 1400, 1185, 24, 5],
    ['Pañal Winnie Etapa 3', 'ASP', '37', 1400, 1185, 24, 5],

    //Puyo Helado Colombina - Sofia
    ['Paleta Bombombun Fresa', 'HEL', '100', 2200, 1760, 24, 5],
    ['Paleta Chocobreak', 'HEL', '100', 4000, 3120, 24, 5],
    ['Chocoramo cono', 'ASP', '100', 4000, , 24, 5],
    ['Maxilatto', 'ASP', '100', 5700, 4700, 24, 5],

    //Puyo Varios - Pantoja
    ['Pirulito Neon Polvo', 'SNA', '100', 1000, 609, 24, 5],
    ['Zucaritas Chococrispis sobre', 'SNA', '100', 1500, 1280, 24, 5],
    ['Bombonbum sabores paquete x24', 'SNA', '100', 10500, 8696, 24, 5],
    ['Bombonbum sabores unidad', 'SNA', '100', 500, 362, 24, 5],
    ['pirulito sabores x24', 'SNA', '100', 4500, 3678, 24, 5],
    ['pirulito sabores unidad', 'SNA', '100', 200, 153, 24, 5],
    ['Max combi surtido', 'SNA', '100', 8500, 7305, 24, 5],
    ['Max combi surtido', 'SNA', '100', 100, 73, 24, 5],
    ['Chocodisk sobre', 'SNA', '100', 1200, 833, 24, 5],
    ['Millows mini 20 gr', 'SNA', '100', 1000, 684, 24, 5],
    ['Xplode Chicle', 'SNA', '100', 600, 349, 24, 5],
    ['Aji Picante 100 gr', 'SNA', '100', 3800, 3209, 24, 5],
    ['Vinagre blanco 230 ml', 'SNA', '100', 2000, 1452, 24, 5],
    ['Raid Pulgas 285 ml', 'SNA', '100', 12500, 10800, 24, 5],
    ['Salsa Soya 100 ml', 'SNA', '100', 2200, 1768, 24, 5],
    ['Fruticas Sur Caramelo acido 14 gr', 'SNA', '100', 1200, 929, 24, 5],
    ['Wafer Capri Vainilla x24', 'SNA', '100', 8000, 6800, 24, 5],
    ['Wafer Capri Vainilla unidad', 'SNA', '100', 400, 283, 24, 5],
    ['Menta helada paquete x100', 'SNA', '100', 8500, 7054, 24, 5],
    ['Menta helada unidad', 'SNA', '100', 100, 70, 24, 5],
    ['Pila AA par', 'SNA', '100', 2000, 1561, 24, 5],
    ['Pila AAA par', 'SNA', '100', 2000, 1561, 24, 5],
    ['Pila AA alkalina par', 'SNA', '100', 4500, 3700, 24, 5],
    ['Chicle Xplode espantaojos', 'SNA', '100', 100, 45, 24, 5],
    ['Chocoball unidad', 'SNA', '100', 100, 70, 24, 5],
    ['Chocoball paquete x100', 'SNA', '100', 8500, 7058, 24, 5],
    ['Fruticas Sur Caramelo blando unidad', 'SNA', '100', 100, 73, 24, 5],
    ['Fruticas Sur Caramelo blando paquete x100', 'SNA', '100', 8500, 7367, 24, 5],
    ['Galleta tipo leche 12 gr x18', 'SNA', '100', 5000, 4246, 24, 5],
    ['Galleta tipo leche 12 gr unidad', 'SNA', '100', 400, 235, 24, 5],
    ['Suerox sabores 630 ml', 'SNA', '100', 4000, 3450, 24, 5],
    ['Jirafa bombom bun unidad', 'SNA', '100', 500, 397, 24, 5],
    ['Nucita Barquillo 18 gr', 'SNA', '100', 1000, 787, 24, 5],
    ['Shampoo colores Jhonsons 25 ml', 'SNA', '100', 1500, 1149, 24, 5],
    ['Nucita crema 14 gr', 'SNA', '100', 800, 645, 24, 5],
    ['Lubriderm sobre 25 ml', 'SNA', '100', 3500, 3042, 24, 5],
    ['', 'SNA', '100', , , 24, 5],

];


async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('\n✅ Conectado a MongoDB');
        await Product.deleteMany({});
        console.log('🧹 Limpiando productos anteriores...');

        console.log('📂 Cargando categorías desde la base de datos...');
        const categoriasDB = await Category.find();
        const catMap = {}; // catCode -> catId
        for (const cat of categoriasDB) {
            catMap[cat.code] = cat._id;
        }

        console.log('🚚 Cargando proveedores desde la base de datos...');
        const proveedoresDB = await Supplier.find();
        const provMap = {}; // provCode -> provId
        for (const prov of proveedoresDB) {
            provMap[prov.code] = prov._id;
        }

        // Crear productos
        console.log('\n📦 Creando productos...');
        let totalCreados = 0;
        const providerConsecutives = {};

        for (const [name, catCode, provCode, purchasePrice, salePrice, stock, minStock] of PRODUCTOS) {
            const catId = catMap[catCode];
            if (!catId) { console.log(`   ⚠️ Categoría no encontrada para el código: ${catCode} (Producto: ${name})`); continue; }

            const provId = provMap[provCode];
            if (!provId) { console.log(`   ⚠️ Proveedor no encontrado para el código: ${provCode} (Producto: ${name})`); continue; }

            if (!providerConsecutives[provCode]) {
                providerConsecutives[provCode] = 1;
            }
            const consecutive = providerConsecutives[provCode]++;

            // Generar barcode: CAT(3) + PROV(2) + CONSEC(3)
            // Ejemplo: BEB + 07 + 001 = BEB07001
            const barcode = `${catCode}${provCode}${consecutive.toString().padStart(3, '0')}`;

            await Product.create({
                name,
                barcode,
                category: catId,
                supplier: provId,
                purchasePrice,
                salePrice,
                stock,
                minStock
            });

            totalCreados++;
        }

        const total = await Product.countDocuments();
        const sinStock = await Product.countDocuments({ stock: 0 });
        const stockBajo = await Product.countDocuments({ $expr: { $lte: ['$stock', '$minStock'] } });
        const valorCosto = await Product.aggregate([{ $group: { _id: null, v: { $sum: { $multiply: ['$stock', '$purchasePrice'] } } } }]);
        const valorVenta = await Product.aggregate([{ $group: { _id: null, v: { $sum: { $multiply: ['$stock', '$salePrice'] } } } }]);

        console.log(`\n📊 RESUMEN DEL INVENTARIO FICTICIO:`);
        console.log(`   Total productos : ${total}`);
        console.log(`   Sin stock       : ${sinStock}`);
        console.log(`   Stock bajo      : ${stockBajo}`);
        console.log(`   Valor en costo  : $${(valorCosto[0]?.v || 0).toLocaleString('es-CO')}`);
        console.log(`   Valor en venta  : $${(valorVenta[0]?.v || 0).toLocaleString('es-CO')}`);
        console.log(`\n🚀 Seed completado: ${totalCreados} productos cargados\n`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

seed();