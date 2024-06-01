
const textXY = document.getElementById("demo");
const dothings = document.getElementById("dothings");
const playing = document.getElementById("playing");
const mainTitle = document.getElementById("mainTitle");

var decP = 6; //decimal precision

var initX = 0;
var initY = 0;
var ixy = 0; //progressivo geolocalizzazione -> 0 -> prima geolocalizzazione = coordinate di partenza
var nowX = 0;
var nowY = 0;

var marker;
var map;

var circles = $(".circle");
var polygons = $(".polygon");

var snapTime = 3000;
var alphaDir = 0;

var audioObjs = $("audio");
const options = {
    enableHighAccuracy: true,
    timeout: 10000,
};

for (var i = 0; i < audioObjs.length; ++i) {
    audioObjs[i].id = "audio" + i;
    audioObjs[i].pause();
    audioObjs[i].volume = 0.0;
    audioObjs[i].setAttribute("style", "position:absolute;")

}

var shapes = [];

function startGetLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function getPosition(position) {

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
            nowXbis = position.coords.latitude.toFixed(decP);
            nowYbis = position.coords.longitude.toFixed(decP);
            doAudioThings(nowX, nowY);

        },

            function (error) {
                if (error.code == error.PERMISSION_DENIED) {
                    if (ixy == 0) {

                        document.querySelector("body").classList.add("edit");
                        if (document.querySelector("#mainTitle").hasAttribute("coord")) {
                            initX = document.querySelector("#mainTitle").getAttribute("coord").split(",")[0];
                            initY = document.querySelector("#mainTitle").getAttribute("coord").split(",")[1];
                        }
                        else {
                            initX = 44.483132;
                            initY = 11.349113;
                        }

                        map = L.map('map').setView([initX, initY], 18);
                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 18,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }).addTo(map);

                        marker = L.marker([initX, initY]).addTo(map);
                        doCircleMap();
                        doPolygonMap();
                        ixy = ixy + 1;
                    }

                    dothings.innerHTML = "Now Walk Around And Listen";


                    map.on('mousemove', function (ev) {
                        nowX = ev.latlng.lat.toFixed(decP);
                        nowY = ev.latlng.lng.toFixed(decP);
                        nowXbis = ev.latlng.lat.toFixed(decP);
                        nowYbis = ev.latlng.lng.toFixed(decP);
                        doAudioThings(nowX, nowY);
                    });


                    map.on('click', function (ev) {
                        // Get the text field
                        var copyText = ev.latlng.lat.toFixed(decP) + ", " + ev.latlng.lng.toFixed(decP);

                        // Copy the text inside the text field
                        navigator.clipboard.writeText(copyText);

                        // Alert the copied text
                        dothings.innerHTML  = copyText;
                    });
                    textXY.innerHTML = "you denied me :-(";
                }
            },
            options
        );
    } else {
        textXY.innerHTML = "Geolocation is not supported by this browser.";
    }

}

function startGetLocationNoMap() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function getPosition(position) {

            if (ixy == 0) {
                initX = position.coords.latitude.toFixed(decP);
                initY = position.coords.longitude.toFixed(decP);
                // map = L.map('map').setView([initX, initY], 18);
                // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                //     maxZoom: 19,
                //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                // }).addTo(map);

                // marker = L.marker([initX, initY]).addTo(map);
                // doCircleMap();
                // doPolygonMap();

                ixy = ixy + 1;
            }

            nowX = position.coords.latitude.toFixed(decP);
            nowY = position.coords.longitude.toFixed(decP);
            nowXbis = position.coords.latitude.toFixed(decP);
            nowYbis = position.coords.longitude.toFixed(decP);
            doAudioThings(nowX, nowY);

        },

            function (error) {
                if (error.code == error.PERMISSION_DENIED) {
                    if (ixy == 0) {

                        document.querySelector("body").classList.add("edit");
                        if (document.querySelector("#mainTitle").hasAttribute("coord")) {
                            initX = document.querySelector("#mainTitle").getAttribute("coord").split(",")[0];
                            initY = document.querySelector("#mainTitle").getAttribute("coord").split(",")[1];
                        }
                        else {
                            initX = 44.483132;
                            initY = 11.349113;
                        }

                        map = L.map('map').setView([initX, initY], 18);
                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 18,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }).addTo(map);

                        marker = L.marker([initX, initY]).addTo(map);
                        ixy = ixy + 1;
                    }

                    map.on('mousemove', function (ev) {
                        nowX = ev.latlng.lat.toFixed(decP);
                        nowY = ev.latlng.lng.toFixed(decP);
                        nowXbis = ev.latlng.lat.toFixed(decP);
                        nowYbis = ev.latlng.lng.toFixed(decP);
                        doAudioThings(nowX, nowY);
                    });


                    map.on('click', function (ev) {
                        // Get the text field
                        var copyText = ev.latlng.lat.toFixed(decP) + ", " + ev.latlng.lng.toFixed(decP);

                        // Copy the text inside the text field
                        navigator.clipboard.writeText(copyText);

                        // Alert the copied text
                        dothings.innerHTML = copyText;
                    });
                    textXY.innerHTML = "you denied me :-(";
                }
            },
            options
        );
    } else {
        textXY.innerHTML = "Geolocation is not supported by this browser.";
    }

}

function startGetLocationNoShapes() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function getPosition(position) {

            if (ixy == 0) {
                initX = position.coords.latitude.toFixed(decP);
                initY = position.coords.longitude.toFixed(decP);
                map = L.map('map').setView([initX, initY], 18);
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);

                marker = L.marker([initX, initY]).addTo(map);
                // doCircleMap();
                // doPolygonMap();

                ixy = ixy + 1;
            }

            nowX = position.coords.latitude.toFixed(decP);
            nowY = position.coords.longitude.toFixed(decP);
            nowXbis = position.coords.latitude.toFixed(decP);
            nowYbis = position.coords.longitude.toFixed(decP);
            doAudioThings(nowX, nowY);

        },

            function (error) {
                if (error.code == error.PERMISSION_DENIED) {
                    if (ixy == 0) {

                        document.querySelector("body").classList.add("edit");
                        if (document.querySelector("#mainTitle").hasAttribute("coord")) {
                            initX = document.querySelector("#mainTitle").getAttribute("coord").split(",")[0];
                            initY = document.querySelector("#mainTitle").getAttribute("coord").split(",")[1];
                        }
                        else {
                            initX = 44.483132;
                            initY = 11.349113;
                        }

                        map = L.map('map').setView([initX, initY], 18);
                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 18,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }).addTo(map);

                        marker = L.marker([initX, initY]).addTo(map);
                        ixy = ixy + 1;
                    }

                    map.on('mousemove', function (ev) {
                        nowX = ev.latlng.lat.toFixed(decP);
                        nowY = ev.latlng.lng.toFixed(decP);
                        nowXbis = ev.latlng.lat.toFixed(decP);
                        nowYbis = ev.latlng.lng.toFixed(decP);
                        doAudioThings(nowX, nowY);
                    });


                    map.on('click', function (ev) {
                        // Get the text field
                        var copyText = ev.latlng.lat.toFixed(decP) + ", " + ev.latlng.lng.toFixed(decP);

                        // Copy the text inside the text field
                        navigator.clipboard.writeText(copyText);

                        // Alert the copied text
                        dothings.innerHTML = copyText;
                    });
                    textXY.innerHTML = "you denied me :-(";
                }
            },
            options
        );
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

function decVolume(a) {
    var maxvol;
    if (a.parentElement.hasAttribute("volume")) {
        maxvol = Number(a.parentElement.attributes.volume.value)/100;
    } else {
        maxvol = 1;
    }
    if (a.classList[0] !== 'playing') {
        var t = 0;
        if (a.parentElement.hasAttribute("fadeout")) {
            t = Number(a.parentElement.attributes.fadeout.value);
            var decT = t / 100;
            var Vcent = a.volume*100;
            Vcent = Vcent - maxvol;
            if (a.volume > 0) {
                a.volume = ((Vcent) / 100).toFixed(6);
            }
            setTimeout(function () {
                if (Vcent > maxvol) {
                    decVolume(a);
                } else {
                    a.volume = 0;
                    a.pause();
                    if ((a.duration < 10) || a.parentElement.hasAttribute("rewind") || a.duration == a.currentTime) {
                        a.currentTime = 0;
                    }
                }
            }, decT);
        }
        else {
            a.pause();
            a.volume = 0;
            if ((a.duration < 10) || a.parentElement.hasAttribute("rewind") ||  a.duration == a.currentTime) {
                a.currentTime = 0;
            }
        }
    }
}
// When volume at zero stop all the intervalling
function addVolume(a) {
    var maxvol = 1;
    if (a.parentElement.hasAttribute("volume")) {
        maxvol = Number(a.parentElement.attributes.volume.value)/100;
    }
    if (a.classList[0] == 'playing') {
        var t = 0;
        if (a.parentElement.hasAttribute("fadein")) {
            t = Number(a.parentElement.attributes.fadein.value);
            var addT = t / 100;
            var Vcent = a.volume * 100;
            Vcent = Vcent + maxvol;
            a.volume = ((Vcent) / 100).toFixed(6);
            setTimeout(function () {
                if (Vcent < maxvol*100 - 1) {
                    addVolume(a);
                }
            }, addT);
        }
        else {
            a.volume = Number(maxvol);
        }
    }
}

function playAudio(a) {
    a.play();
}

function pauseAudio(a) {
    a.pause();
}

function playCircle(x, y, r, a, n) {
    var maxvol = 100;
    if (a.parentElement.hasAttribute("volume")) {
        maxvol = Number(a.parentElement.attributes.volume.value);
    }
    var distance = Number(measure(nowX, nowY, x, y));
    if (distance <= r) {
        if (!(a.hasAttribute("controls"))) {
        a.setAttribute("controls", "")
        }
        if (a.parentElement.hasAttribute("random")) {
            var rri = Math.floor(Math.random() * a.parentElement.querySelectorAll('audio').length);
            a = a.parentElement.querySelectorAll('audio')[rri];
        } else {rri = 0}
        if ((a.paused)) {
            if (a.parentElement.parentElement.hasAttribute("group")) {
                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                for (var i = 0; i < groupAudio; i++) {
                    playAudio(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                }
            }
            else if ((!( a.duration == a.currentTime)) || (a.hasAttribute("loop"))) {
                a.play();
            }
        }
        if ($(a).parents(".circle").attr("fade") == "center") {
            if (distance < r) {
                a.volume = ((1 - (distance / r))*maxvol/100).toFixed(6);
                 //console.log(a.volume);
                a.classList.add("playing");
            }
        }
        else if (a.volume < 1 && (a.classList[0] !== 'playing')) {
            a.classList.add("playing");
            addVolume(a);
        }
    }

    if (distance > r && (!(a.paused) || (a.ended))) {
        if ($(a).parents(".circle").attr("fade") == "center") {
            a.volume = 0.0;
            a.classList.remove("playing");
            if (( a.duration == a.currentTime) && !(a.hasAttribute("loop")) || a.parentElement.hasAttribute('rewind')) {
                a.currentTime = 0;
            }
            if (!(a.parentElement.parentElement.hasAttribute("group"))) {
                a.pause();
                a.removeAttribute("controls")
            }
            else {
                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                var groupPlayingAudio = a.parentElement.parentElement.querySelectorAll('.playing').length;
                if (groupPlayingAudio == 0)
                    for (var i = 0; i < groupAudio; i++) {
                        pauseAudio(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                        a.parentElement.parentElement.querySelectorAll('audio')[i].removeAttribute("controls")
                    }
            }
        }
        else {
            setTimeout(function () {
                distance = Number(measure(nowX, nowY, x, y));
                if (distance > r) {
                    if ((!(a.paused)) && (a.classList[0] == 'playing')) {
                        a.classList.remove("playing");
                        playing.innerHTML = n + " pause audio " + distance + " from " + a.id;
                        decVolume(a);
                        // Only fade if past the fade out point or not at zero already  
                        if (a.parentElement.parentElement.hasAttribute("group")) {
                            var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                            var groupPlayingAudio = a.parentElement.parentElement.querySelectorAll('.playing').length;
                            if (groupPlayingAudio == 0)
                                for (var i = 0; i < groupAudio; i++) {
                                    decVolume(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                                    a.parentElement.parentElement.querySelectorAll('audio')[i].removeAttribute("controls")

                                }
                        }
                    }
                    a.removeAttribute("controls")
                }
            }, snapTime);
        }
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
            a.setAttribute("controls", "")
            if (a.parentElement.parentElement.hasAttribute("group")) {
                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                for (var i = 0; i < groupAudio; i++) {
                    playAudio(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                }
            }
            else if ((!( a.duration == a.currentTime)) || ( a.duration == a.currentTime && a.hasAttribute("loop"))) {
                a.play();
            }
        }
        if (a.volume < 1 && (a.classList[0] !== 'playing')) {
            a.classList.add("playing");
            addVolume(a);
        }
    }

    if (!(rayCasting(point, polyCoord)) && !(a.paused)) {
        setTimeout(function () {
            var newXY = [];
            newXY.push(nowXbis);
            newXY.push(nowYbis);
            if (!(rayCasting(newXY, polyCoord))) {
                if ((!(a.paused)) && (a.classList[0] == 'playing')) {
                    a.classList.remove("playing");
                    playing.innerHTML = n + " pause audio " + " from " + a.id;
                    decVolume(a);
                    if (a.parentElement.parentElement.hasAttribute("group")) {
                        var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                        var groupPlayingAudio = a.parentElement.parentElement.querySelectorAll('.playing').length;
                        if (groupPlayingAudio == 0)
                            for (var i = 0; i < groupAudio; i++) {
                                pauseAudio(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                                a.parentElement.parentElement.querySelectorAll('audio')[i].removeAttribute("controls")

                            }
                    }
                    a.removeAttribute("controls")
                    // Only fade if past the fade out point or not at zero already            
                }


            }
        }, snapTime)
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
    return dm.toFixed(decP);
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
            }).addTo(map);
        }
    });
}