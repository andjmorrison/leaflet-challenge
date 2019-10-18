// initialize map -> request -> render -> legend

// urls
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
// let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson' //smaller test set

// layer
let darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "C. A Morrison 2019 | Data courtesy of <a href=https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php>USGS GeoJSON Feed</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
})

let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [darkmap],
})

// courtesy of ColorBrewer -> gradient
colorBrews = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']

function colorBrewer(d) {
	return d > 5 ? colorBrews[5] :
	       d > 4 ? colorBrews[4] :
	       d > 3 ? colorBrews[3] :
	       d > 2 ? colorBrews[2] :
	       d > 1 ? colorBrews[1] :
                colorBrews[0] ;
}

// request
d3.json(url, function(data) {
  // console.log(data.features)

  // geoJSON
  geoData = data.features
  
  // foreach to gather elements
  geoData.forEach(individual => {

    let quakeMag = individual.properties.mag
    let quakePlace = individual.properties.place
    let quakeTime = individual.properties.time
    let quakeCoords = individual.geometry.coordinates.slice(0,2).reverse()

    let lat = individual.geometry.coordinates[0]
    let lon = individual.geometry.coordinates[1]

    // define each marker w/ color grade
    var marker = L.circleMarker(quakeCoords, {
      radius: quakeMag ** 2,
      color: 'white',
      weight: .3,
      fillColor: colorBrewer(quakeMag),
      opacity: 1
    })
    .bindPopup(`<h3> Magnitude: ${quakeMag} | ${quakePlace}</h3><hr><p> ${new Date(quakeTime)} </p>`)
    .addTo(myMap)
  })
})

// legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  // create div
	let div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 1, 2, 3, 4, 5]
		labels = []

	// loop to create colored legend w/ proper grades
	for (let i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + colorBrewer(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
	}
	return div
}

legend.addTo(myMap)