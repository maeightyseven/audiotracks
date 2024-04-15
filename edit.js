
const textXY = document.getElementById("demo");
const dothings = document.getElementById("dothings");
const wdots = document.getElementById("wdots");
const playing = document.getElementById("playing");
const mainTitle = document.getElementById("mainTitle");

var decP = 5; //decimal precision

var initX = 0;
var initY = 0;
var ixy = 0; //progressivo geolocalizzazione -> 0 -> prima geolocalizzazione = coordinate di partenza
var nowX = 0;
var nowY = 0;

var marker;
var map;

var moving = 1;

var circles = $(".circle");
var polygons = $(".polygon");

var audioObjs = $("audio");
for (var i = 0; i < audioObjs.length; ++i) {
    // audioObjs[i].loop = true;
    audioObjs[i].id = "audio" + i;
    audioObjs[i].pause();
    audioObjs[i].volume = 0.0;
}

var shapes = [];

setInterval(function () {
    moving = 1;
}, 100)

function startGetLocation() {

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
    dowdots();

    if (ixy == 0) {
        initX = 44.483334;
        initY = 11.35375;
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

    nowX = 44.483334;
    nowY = 44.483334;

    map.on('mousemove', function (ev) {
        if (moving == 1) {
            nowX = ev.latlng.lat.toFixed(decP);
            nowY = ev.latlng.lng.toFixed(decP);
            doAudioThings(nowX, nowY);
            moving = 0;
        }
    });

    map.on('click', function (ev) {
        // Get the text field
        var copyText  = ev.latlng.lat.toFixed(decP) + ", " + ev.latlng.lng.toFixed(decP);
       
        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText);
        
        // Alert the copied text
        alert("Copied the text: " + copyText);
       });
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


}

function decVolume(a, t) {
    var volume = a.volume;
    setTimeout(function () {
        a.volume = volume - 0.1;
        if (a.volume > 0 + 0.1) {
            decVolume(a);
        } else {
            a.volume = 0;
            a.pause();
            return;
        }
    }, 100);
}
// When volume at zero stop all the intervalling
function addVolume(a, t) {
    var volume = a.volume;
    setTimeout(function () {
        a.volume = volume + 0.1;
        if (a.volume < 1 - 0.1) {
            addVolume(a);
        } else {
            a.volume = 1;
            return;
        }
    }, 100);
}

function playCircle(x, y, r, a, n) {
    var distance = Number(measure(nowX, nowY, x, y));
    if (distance <= r) {
        if ((a.paused)) {
            a.play();
             playing.innerHTML = n + " playing audio " + distance + " from " + a.id;
        }
        if (a.volume < 1) {
            addVolume(a);
        }
    }

    if (distance > r && !(a.paused)) {
        setTimeout(function () {
            distance = Number(measure(nowX, nowY, x, y));
            if (distance > r ) {
                 if (!(a.paused)) {
                    playing.innerHTML = n + " pause audio " + distance + " from " + a.id;
                    decVolume(a);
                    // Only fade if past the fade out point or not at zero already            
                }
            }
        }, 2000);
    }
}

function playPolygon(pointList, a, n) {
    var point = [];
    // console.log(pointList);
    var polyCoord = JSON.parse(pointList);
    point.push(nowX);
    point.push(nowY);
    //  console.log(rayCasting(point, polyCoord));
    if (rayCasting(point, polyCoord)) {
        if ((a.paused)) {
            a.play();
            playing.innerHTML = n + " playing audio " + " from " + a.id;
        }
        if (a.volume < 1) {
            addVolume(a);
        }
    }

    if (!(rayCasting(point, polyCoord)) && !(a.paused)) {
        setTimeout(function () {
            var point = [];
            // console.log(pointList);
            var polyCoord = JSON.parse(pointList);
            point.push(nowX);
            point.push(nowY);
            if (!(rayCasting(point, polyCoord))) {
                if (!(a.paused)) {
                    playing.innerHTML = n + " pause audio " + " from " + a.id;
                    decVolume(a);
                    // Only fade if past the fade out point or not at zero already            
                }
            }
        }, 1000)

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
    circles.each(function () {
        var x = $(this).attr("coord").split(",")[0];
        var y = $(this).attr("coord").split(",")[1];
        var r = $(this).attr("size");
        var a = $(this).children("audio")[0];
        var name = $(this).attr("id");
        var c = $(this).parents(".zone").attr("color");
        const n = circles.length;
        for (var i = 0; i < n; ++i) {
            cShapes[i] = L.circle([x, y], {
                color: c,
                fillColor: c,
                fillOpacity: 0.1,
                radius: r
            }).addTo(map);
        }
    });
}

function doPolygonMap() {
    var pShapes = [];
    polygons.each(function () {
        var pointList = $(this).attr("coord");
        var a = $(this).children("audio")[0];
        var name = $(this).attr("id");
        const n = polygons.length;
        var c = $(this).parents(".zone").attr("color");
        for (var i = 0; i < n; ++i) {
            var polyCoord = JSON.parse(pointList);
            pShapes[i] = L.polygon([polyCoord], {
                color: c,
                fillColor: c,
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


