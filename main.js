
const textXY = document.getElementById("demo");
const dothings = document.getElementById("dothings");
const wdots = document.getElementById("wdots");
const playing = document.getElementById("playing");
const mainTitle = document.getElementById("mainTitle");

var decP = 15; //decimal precision

var initX = 0;
var initY = 0;
var ixy = 0; //progressivo geolocalizzazione -> 0 -> prima geolocalizzazione = coordinate di partenza
var nowX = 0;
var nowY = 0;

var marker;
var map;


var circles = $(".circle");
var polygons = $(".polygon");

var audioObjs = $("audio");
    for (var i = 0; i < audioObjs.length; ++i) {
       // audioObjs[i].loop = true;
        audioObjs[i].id = "audio" + i;
        audioObjs[i].pause();
        audioObjs[i].volume = 0.0;
    }
/*
var a1 = document.getElementById("myAudio1");
var a2 = document.getElementById("myAudio2");
var a3 = document.getElementById("myAudio3");
var a4 = document.getElementById("myAudio4");
*/

var shapes = [];

function startGetLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function getPosition(position) {
            dowdots();

            if (ixy == 0) {
                initX = position.coords.latitude.toFixed(decP);
                initY = position.coords.longitude.toFixed(decP);
                map = L.map('map').setView([initX, initY], 18);
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
        
                marker = L.marker([initX, initY]).addTo(map);
                doCircleMap();
                doPolygonMap();
                ixy = ixy + 1;
            }
        
            nowX = position.coords.latitude.toFixed(decP);
            nowY = position.coords.longitude.toFixed(decP);
            doAudioThings(nowX, nowY);
        },
           
          function(error) {
            if (error.code == error.PERMISSION_DENIED)
            textXY.innerHTML = "you denied me :-(";
          });
    } else {
        textXY.innerHTML = "Geolocation is not supported by this browser.";
    }
    
}


function doAudioThings(nowX, nowY) {
    markerXY = L.latLng(nowX, nowY);
    marker.setLatLng(markerXY);
   // console.log(nowX);
   // console.log(nowY);
    textXY.innerHTML = "ACTUAL POSITION: " + nowX + " , " + nowY +
        "<br>STARTING POINT: " + initX + " , " + initY +
        "<br>distance from STARTING POINT: " + measure(initX, initY, nowX, nowY) + "m";

    dothings.innerHTML = "Now Walk Around And Listen";
    playing.innerHTML = "";

    circles.each(function () {
        var x = $(this).attr("coord").split(",")[0];
        var y = $(this).attr("coord").split(",")[1];
        var r = $(this).attr("size");
        var a = $(this).children("audio")[0];
        var n = $(this).attr("id");
        playCircle(x, y, r, a, n)
    });

    polygons.each(function () {
        var polyCoord = $(this).attr("coord");
        var a = $(this).children("audio")[0];
        var n = $(this).attr("id");
        playPolygon(polyCoord, a, n);
    });
    /*
        if (measure(nowX, nowY, 44.495389782872614, 11.349457843631866) < 500) {
        playCircle(44.49529412089082, 11.348885862549388, 2, a1, "Biciclette");
        playCircle(44.495431904565024, 11.348828594660992, 2, a2, "Papavero");
        playCircle(44.495389782872614, 11.349457843631866, 50, a3, "Chiostro");
        playCircle(44.49542082874493, 11.348778602401508, 15, a4, "Piazza Rossini");
        }
    
        if (measure(nowX, nowY, 44.48584670323959, 11.366846005965819) < 500) {
    
        playCircle(44.48584670323959, 11.366846005965819, 15, a1, "Biciclette");
        playCircle(44.48578201580465, 11.366551125150702, 15, a2, "Papavero");
        }
    
        if (measure(nowX, nowY, 44.483334, 11.353757) < 900) {
    
        
    }*/

}

function playCircle(x, y, r, a, n) {
    var distance = Number(measure(nowX, nowY, x, y));
    if (distance <= r) {
        a.play();
        while (a.volume < 1.0) {
        playing.innerHTML = n + " playing audio " + distance + " from " + a.id;
         setInterval(function () {
            // Only fade if past the fade out point or not at zero already
            a.volume += 0.1;}, 100)
         }              
    }

    else {
         playing.innerHTML = n + " pause audio " + distance + " from " + a.id;

           while (a.volume > 0.0) {
            // Only fade if past the fade out point or not at zero already
            setInterval(function () {
            // Only fade if past the fade out point or not at zero already
             a.volume -= 0.1;}, 100)
            }              
        
            // When volume at zero stop all the intervalling
            if (a.volume == 0.0) {
                a.pause();       
            }
    }
}

function measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    var dm = d * 1000; // meters
    return dm.toFixed(2);
}


function playPolygon(pointList, a, n) {
    var point = [];
   // console.log(pointList);
    var polyCoord = JSON.parse(pointList);
    point.push(nowX);
    point.push(nowY);
  //  console.log(rayCasting(point, polyCoord));
    if (rayCasting(point, polyCoord)) {
               a.play();
        while (a.volume < 1.0) {
        playing.innerHTML = n + " playing audio "  + " from " + a.id;
         setInterval(function () {
            // Only fade if past the fade out point or not at zero already
            a.volume += 0.1;}, 100)
         }              
    }

    else {
         playing.innerHTML = n + " pause audio "  + " from " + a.id;

           while (a.volume > 0.0) {
            // Only fade if past the fade out point or not at zero already
            setInterval(function () {
            // Only fade if past the fade out point or not at zero already
             a.volume -= 0.1;}, 100)
            }              
        
            // When volume at zero stop all the intervalling
            if (a.volume == 0.0) {
                a.pause();       
            }
    }
}

function rayCasting(point, polygon) {
    const n = polygon.length
    let isIn = false
    const x = point[0]
    const y = point[1]
    let x1, x2, y1, y2

    x1 = polygon[n - 1][0]
    y1 = polygon[n - 1][1]

    for (var i = 0; i < n; ++i) {
        x2 = polygon[i][0];
        y2 = polygon[i][1];

        if (y < y1 !== y < y2 && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) {
            isIn = !isIn;
        }
        x1 = x2
        y1 = y2
    }

    return isIn;
}

function doCircleMap() {
    var cShapes = [];
   circles.each(function(){
       var x = $(this).attr("coord").split(",")[0];
        var y = $(this).attr("coord").split(",")[1];
        var r = $(this).attr("size");
        var a = $(this).children("audio")[0];
        const n = circles.length;
    for (var i = 0; i < n; ++i) {
        cShapes[i] = L.circle([x, y], {
        color: 'violet',
        fillColor: 'violet',
        fillOpacity: 0.1,
        radius: r
    }).addTo(map);
    }
   });
}

function doPolygonMap() {
var pShapes = [];
    polygons.each(function(){
        var pointList = $(this).attr("coord");
        var a = $(this).children("audio")[0];
        var name = $(this).attr("id");
        const n = polygons.length;
    for (var i = 0; i < n; ++i) {
    var polyCoord = JSON.parse(pointList); 
    pShapes[i]= L.polygon([polyCoord], {
        color: 'violet',
        fillColor: 'violet',
        fillOpacity: 0.1
        }).addTo(map);
    }
    });
}

function dowdots() {
    var tdots = "";
    setInterval(function () {
        wdots.innerHTML = tdots;
        tdots += "."
        if (tdots.length > 3) {
            tdots = "";
        }
    }, 500);
}
