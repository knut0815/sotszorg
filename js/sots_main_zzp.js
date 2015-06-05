///////////////////////////////////////////////////////////////////////////
////////////// State of the State - Zorg Main Code ////////////////////////
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
////////////////// Initiate Scatter plots ZZP 1 - 4 ///////////////////////
///////////////////////////////////////////////////////////////////////////
//General widths and heights
var scatterMargin = {left: 60, top: 60, right: 40, bottom: 50},
	scatterWidth = Math.min($(".dataresource.zzp1_4.chartTop").width(),500) - scatterMargin.left - scatterMargin.right,
	scatterHeight = scatterWidth*3/5;

//Create SVG inside the div		
var svgChartTop = d3.select(".dataresource.zzp1_4.chartTop").append("svg")
		.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));

var svgChartBottom = d3.select(".dataresource.zzp1_4.chartBottom").append("svg")
		.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));

//Create g elements for each group of chart elements		
var chartTop = svgChartTop.append("g").attr("class", "chartZZP1_4")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
var chartBottom = svgChartBottom.append("g").attr("class", "chartZZP1_4")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
		
///////////////////////////////////////////////////////////////////////////
/////////////////// Initiate Scatter plots ZZP 5 - 10 /////////////////////
///////////////////////////////////////////////////////////////////////////

//Create SVG inside the div		
var svgChartTop2 = d3.select(".dataresource.zzp5_10.chartTop").append("svg")
		.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));

var svgChartBottom2 = d3.select(".dataresource.zzp5_10.chartBottom").append("svg")
		.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));

//Create g elements for each group of chart elements		
var chartTop2 = svgChartTop2.append("g").attr("class", "chartZZP5_10")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
var chartBottom2 = svgChartBottom2.append("g").attr("class", "chartZZP5_10")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");

///////////////////////////////////////////////////////////////////////////
/////////////////////// Initiate Map NL ZZP 1 - 4 /////////////////////////
///////////////////////////////////////////////////////////////////////////
//General widths and heights	
var mapWidth = scatterWidth,
	mapHeight = 2*($(".dataresource.zzp1_4.chartTop").height()) - scatterMargin.top - scatterMargin.bottom;

//Create SVG inside the div	
var svgMap = d3.select(".dataresource.zzp1_4.map").append("svg")
		.attr("width", (mapWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (mapHeight + scatterMargin.top + scatterMargin.bottom));
		
//Create g elements for each group of chart elements	
var map = svgMap.append("g").attr("class", "map")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
var mapCallout = svgMap.append("g").attr("class", "mapCallout")
		.attr("transform", "translate(" + (scatterMargin.left) + "," + (scatterMargin.top * 7/4) + ")")
		.style("visibility", "hidden");
var mapLegendWrapper = svgMap.append("g").attr("class", "legend");
var clusterLegendWrapper = svgMap.append("g").attr("class", "legend");

///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate Map NL ZZP 5 - 10 //////////////////////////
///////////////////////////////////////////////////////////////////////////

//Create SVG inside the div	
var svgMap2 = d3.select(".dataresource.zzp5_10.map").append("svg")
		.attr("width", (mapWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (mapHeight + scatterMargin.top + scatterMargin.bottom));
		
//Create g elements for each group of chart elements	
var map2 = svgMap2.append("g").attr("class", "map")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
var mapCallout2 = svgMap2.append("g").attr("class", "mapCallout")
		.attr("transform", "translate(" + (scatterMargin.left) + "," + (scatterMargin.top * 7/4) + ")")
		.style("visibility", "hidden");
var mapLegendWrapper2 = svgMap2.append("g").attr("class", "legend");
var clusterLegendWrapper2 = svgMap2.append("g").attr("class", "legend");
///////////////////////////////////////////////////////////////////////////
/////////////////////// Initiate Map Tilburg //////////////////////////////
///////////////////////////////////////////////////////////////////////////
//General widths and heights	
var mapTilburgMargin = {left: 30, top: 20, right: 30, bottom: 50},
	mapTilburgWidth = Math.min($(".dataresource.zzp1_4.tilburg.map").width(),500) - mapTilburgMargin.left - mapTilburgMargin.right,
	mapTilburgHeight = mapTilburgWidth*3/4;

//Create SVG inside the div	
var svgMapTilburg = d3.select(".dataresource.zzp1_4.tilburg.map").append("svg")
		.attr("width", (mapTilburgWidth + mapTilburgMargin.left + mapTilburgMargin.right))
		.attr("height", (mapTilburgHeight + mapTilburgMargin.top + mapTilburgMargin.bottom));
		
//Create g elements for each group of chart elements	
var mapTilburg = svgMapTilburg.append("g").attr("class", "map")
		.attr("transform", "translate(" + mapTilburgMargin.left + "," + mapTilburgMargin.top + ")");
		
///////////////////////////////////////////////////////////////////////////
/////////////////////// Initiate Bars Tilburg /////////////////////////////
///////////////////////////////////////////////////////////////////////////

//General widths and heights	
var barTilburgMargin = {left: 30, top: 20, right: 30, bottom: 60},
	barTilburgWidth = Math.min($(".dataresource.zzp1_4.tilburg.bar").width(),500) - barTilburgMargin.left - barTilburgMargin.right,
	barTilburgHeight = barTilburgWidth*3/4;

//Create SVG inside the div	
var svgbarTilburg = d3.select(".dataresource.zzp1_4.tilburg.bar").append("svg")
		.attr("width", (barTilburgWidth + barTilburgMargin.left + barTilburgMargin.right))
		.attr("height", (barTilburgHeight + barTilburgMargin.top + barTilburgMargin.bottom));
		
//Create g elements for each group of chart elements	
var barTilburg = svgbarTilburg.append("g").attr("class", "bar")
		.attr("transform", "translate(" + (barTilburgWidth/2 + barTilburgMargin.left) + "," + barTilburgMargin.top + ")");

///////////////////////////////////////////////////////////////////////////
//////////////// Initiate Half-Circles Scatterplot ////////////////////////
///////////////////////////////////////////////////////////////////////////

//General widths and heights	
var scatterTilburgMargin = {left: 100, top: 70, right: 100, bottom: 90},
	scatterTilburgWidth = $(".dataresource.tilburg.scatter").width() - scatterTilburgMargin.left - scatterTilburgMargin.right,
	scatterTilburgHeight = Math.min(500, scatterTilburgWidth*3/5);

//Create SVG inside the div	
var svgScatterTilburg = d3.select(".dataresource.tilburg.scatter").append("svg")
		.attr("width", (scatterTilburgWidth + scatterTilburgMargin.left + scatterTilburgMargin.right))
		.attr("height", (scatterTilburgHeight + scatterTilburgMargin.top + scatterTilburgMargin.bottom));
		
//Create g elements for each group of chart elements	
var scatterTilburg = svgScatterTilburg.append("g").attr("class", "scatter")
		.attr("transform", "translate(" + scatterTilburgMargin.left + "," + scatterTilburgMargin.top + ")");

///////////////////////////////////////////////////////////////////////////
///////////// Initiate Tilburg Building Year Line Dot plot ////////////////
///////////////////////////////////////////////////////////////////////////

//General widths and heights	
var lineTilburgMargin = {left: 200, top: 30, right: 200, bottom: 30},
	lineTilburgWidth = Math.min($(".dataresource.tilburg.year").width(),900) - lineTilburgMargin.left - lineTilburgMargin.right,
	lineTilburgHeight = 150;

//Create SVG inside the div	
var svgLineTilburg = d3.select(".dataresource.tilburg.year").append("svg")
		.attr("width", (lineTilburgWidth + lineTilburgMargin.left + lineTilburgMargin.right))
		.attr("height", (lineTilburgHeight + lineTilburgMargin.top + lineTilburgMargin.bottom));
		
//Create g elements for each group of chart elements	
var lineTilburg = svgLineTilburg.append("g").attr("class", "scatter")
		.attr("transform", "translate(" + lineTilburgMargin.left + "," + (lineTilburgMargin.top + lineTilburgHeight/2) + ")");
		
///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate global variables ///////////////////////////
///////////////////////////////////////////////////////////////////////////

//var rateById = d3.map();

//Take out all gemeentes with unknown number of ZZP 1-4
var gemeentes = gemeentes.filter(function(d) { return d.ZZP1_4_Perc >= 0;});

var zorgkantoorById = {};
gemeentes.forEach(function (d) { 
	zorgkantoorById[d.GM_CODE] = d.Zorgkantoorcode; 
});	

var gemeenteById = {};
zorgkantoor.forEach(function (d) { 
	gemeenteById[d.Zorgkantoorcode] = d.GM_CODE; 
});	

var GM_CODES = [];
gemeentes.forEach(function(d,i) {
			GM_CODES[d.GM_CODE] = i;
});	

//Blue color palette for NL map ZZP 1 - 4
var color = d3.scale.threshold()
			.range(['#bdd7e7','#59afe1','#0d80c4','#08519c'])
			.domain([0.2,0.4,0.6]);

			
//Green - Blue color palette for NL map ZZP 5 - 10
//var color2 = d3.scale.threshold()
//			.range(["#4d9221", "#7fbc41", "#b8e186", "#e6f5d0", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"])
//			.domain([-0.05,-0.025,-0.01,0,0.01,0.025,0.05]);
var color2 = d3.scale.threshold()
			.range(["#7fbc41", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"])
			.domain([0,0.15,0.30,0.50]);
			
//Slightly different color palette for Tilburg map
var colorTilburgMap = d3.scale.threshold()
		.range(['#bdd7e7','#0599d7','#08519c'])
		.domain([0.3,0.35]);
var colorTilburgNames = ["20% - 30%","30% - 35%","35% - 40%"];
		
///////////////////////////////////////////////////////////////////////////
/////////////////////////// Initiate charts ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

/////////////////////////// ZZP 1 - 4 ///////////////////////////////
//Draw the top scatter plot
drawTopScatter(scatterWidth, scatterHeight, scatterMargin);
//Draw the bottom scatter plot
drawBottomScatter(scatterWidth, scatterHeight, scatterMargin);
				
//Draw the NL map
drawMap(mapWrapper = map, chartClass = "chartZZP1_4", colorScale = color, colorVar = "ZZP1_4_Perc", 
		mapTitle = "Percentage van lichte intramurale zorg (lage ZZP) t.o.v. totale intramurale zorg per gemeente", width = mapWidth, height = mapHeight);
//Draw the legend below the map
drawHistoLegend(data = gemeentes, width = mapWidth, height = mapHeight, margin = scatterMargin,
				colorScale = color, xVar = "ZZP1_4_Perc", wrapper = mapLegendWrapper, title = "% lage ZZP t.o.v. totale intramurale zorg", yoff = 50);
//Draw the legend visible on hover over
drawClusterLegend(wrapper = clusterLegendWrapper, width = mapWidth, height = mapHeight, margin = scatterMargin)
//Create data note
svgMap.append("text")
	.attr("transform", "translate(" + scatterMargin.left + "," + (scatterMargin.top + mapHeight + scatterMargin.bottom/2) + ")")
	.attr("class", "legendTitle")
	.style("font-size", "8px")
	.style("text-anchor", "start")
	.text("Bron: CBS & Zorg op de Kaart (2014)");

//Initiate the call out
drawCallout(calloutWrapper = mapCallout, topText = "Aantal lage ZZP dat zal verdwijnen", bottomText = "% lage ZZP t.o.v. totale intramurale zorg");

/////////////////////////// ZZP 5 - 10 ///////////////////////////////

//Draw the top scatter plot
drawTopScatter2(scatterWidth, scatterHeight, scatterMargin);
//Draw the bottom scatter plot
drawBottomScatter2(scatterWidth, scatterHeight, scatterMargin);
				
//Draw the NL map
drawMap(mapWrapper = map2, chartClass = "chartZZP5_10", colorScale = color2, colorVar = "ZZP5_10_Perc_Groei", 
		mapTitle = "De percentuele verandering van de benodigde zorgvraag van zware intramurale zorg (hoge ZZP) per gemeente in 2020", width = mapWidth, height = mapHeight);
//Draw the legend below the map
drawHistoLegend(data = gemeentes, width = mapWidth, height = mapHeight, margin = scatterMargin,
				colorScale = color2, xVar = "ZZP5_10_Perc_Groei", wrapper = mapLegendWrapper2, 
				title = "Verandering in hoge ZZP tot 2020", yoff = 50);
//Draw the legend visible on hover over
drawClusterLegend(wrapper = clusterLegendWrapper2, width = mapWidth, height = mapHeight, margin = scatterMargin)
//Create data note
svgMap2.append("text")
	.attr("transform", "translate(" + scatterMargin.left + "," + (scatterMargin.top + mapHeight + scatterMargin.bottom/2) + ")")
	.attr("class", "legendTitle")
	.style("font-size", "8px")
	.style("text-anchor", "start")
	.text("Bron: Zorg op de Kaart (2014), verwachte populatie groei en bij gelijke samenstelling van gemeentes (CBS, 2011)");

//Initiate the call out
drawCallout(calloutWrapper = mapCallout2, topText = "Totaal verwachte hoge ZZP in 2020", bottomText = "Verandering in hoge ZZP tot 2020");

/////////////////////////// Tilburg - ZZP 1 - 4 ///////////////////////////////
//Draw the Tilburg map
drawMapTilburg(mapWrapper = mapTilburg, colorVar = "ZZP1_4_Perc", mapTitle = "", width = mapTilburgWidth, height = mapTilburgHeight);
//Create data note
svgMapTilburg.append("text")
	.attr("transform", "translate(" + mapTilburgMargin.left + "," + (mapTilburgMargin.top + mapTilburgHeight + mapTilburgMargin.bottom*0.75) + ")")
	.attr("class", "legendTitle")
	.style("text-anchor", "start")
	.style("font-size", "8px")
	.text("Bron: CBS & Zorg op de Kaart (2014)");

//Draw the Tilburg bar charts
drawBarsTilburg();

///////////////// Tilburg - Half circle scatterplot //////////////////////

//Draw Tilburg comparison scatter
drawTilburgScatter(scatterTilburg, scatterTilburgWidth, scatterTilburgHeight, scatterTilburgMargin);
//Create data note
svgScatterTilburg.append("text")
	.attr("transform", "translate(" + scatterTilburgMargin.left + "," + (scatterTilburgMargin.top + scatterTilburgHeight + scatterTilburgMargin.bottom*0.75) + ")")
	.attr("class", "legendTitle")
	.style("text-anchor", "start")
	.style("font-size", "8px")
	.text("Bron: CBS & Zorg op de Kaart (2014)");

	
////////////////// Tilburg - Building year line chart /////////////////////
	
//Draw Tilburg health care centers building year chart
drawBuildingYearLine(lineTilburg, lineTilburgWidth, lineTilburgHeight, lineTilburgMargin);	
	
//Create data note
svgLineTilburg.append("text")
	.attr("transform", "translate(" + lineTilburgMargin.left + "," + (lineTilburgMargin.top + lineTilburgHeight + lineTilburgMargin.bottom/2) + ")")
	.attr("class", "legendTitle")
	.style("font-size", "8px")
	.style("text-anchor", "start")
	.text("Note: Het K.B.O. Kapucijnenklooster uit 1882 is buiten de grafiek gelaten | Bron: Kadaster, Transformeerbaarheidskans door TNO");
///////////////////////////////////////////////////////////////////////////
/////////////////////////// Other functions ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

function drawClusterLegend(wrapper, width, height, margin) {
	wrapper.attr("transform", "translate(" + margin.left + "," + (margin.top + height - 90) + ")")
		   .style("visibility", "hidden");
	
	//Append rectangle for chosen area (green)
	wrapper.append("rect")
		.attr("class", "legendRect greenSquare")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 15)
		.attr("height", 15)
		.style("fill", "#81BC00");
	wrapper.append("text")
		.attr("class", "legendTitle greenSquare")
		.attr("x", 23)
		.attr("y", 0)
		.attr("dy", "1.25em")
		.style("text-anchor", "start")
		.style("font-size", "9px")
		.text("");

	//Append rectangle for (dark blue)
	wrapper.append("rect")
		.attr("class", "legendRect darkblueSquare")
		.attr("x", 0)
		.attr("y", 20)
		.attr("width", 15)
		.attr("height", 15)
		.style("fill", "#00A1DE");
	wrapper.append("text")
		.attr("class", "legendTitle darkblueSquare")
		.attr("x", 23)
		.attr("y", 20)
		.attr("dy", "1.25em")
		.style("text-anchor", "start")
		.style("font-size", "9px")
		.text("");
		
	//Append rectangle for similar gemeentes (light blue)
	wrapper.append("rect")
		.attr("class", "legendRect lightblueSquare")
		.attr("x", 0)
		.attr("y", 40)
		.attr("width", 15)
		.attr("height", 15)
		.style("fill", "#00A1DE");
	wrapper.append("text")
		.attr("class", "legendTitle lightblueSquare")
		.attr("x", 23)
		.attr("y", 40)
		.attr("dy", "1.25em")
		.style("text-anchor", "start")
		.style("font-size", "9px")
		.text("");
	wrapper.append("text")
		.attr("class", "legendTitle legendSub")
		.attr("x", 30)
		.attr("y", 55)
		.attr("dy", "1.25em")
		.style("text-anchor", "start")
		.style("font-size", "9px")
		.text("aantal inwoners, inkomen, leeftijdsverdeling en % huurwoningen");
	
}//drawClusterLegend
