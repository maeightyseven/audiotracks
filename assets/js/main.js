
const textXY = document.getElementById("demo");
const dothings = document.getElementById("dothings");
const wdots = document.getElementById("wdots");
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

var moving = 1;
var clk = 1;

var audioCtx;

var circles = $(".circle");
var polygons = $(".polygon");
var points = $(".point");


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
}

var shapes = [];

setInterval(function () {
    moving = 1;
}, 500)

function startGetLocation() {

    silenceConstAudio.play();
    video.play();
    setInterval(function () {
        silenceConstAudio.play();
        video.play();
    }, 5000)

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
                doPointMap();

                ixy = ixy + 1;
            }

            nowX = position.coords.latitude.toFixed(decP);
            nowY = position.coords.longitude.toFixed(decP);
            nowXbis = position.coords.latitude.toFixed(decP);
            nowYbis = position.coords.longitude.toFixed(decP);
            doAudioThings(nowX, nowY);
            moving = 0;

        },

            function (error) {
                if (error.code == error.PERMISSION_DENIED)
                    if (ixy == 0) {

                        for (var i = 0; i < audioObjs.length; ++i) {
                            audioObjs[i].controls = true;
                        }
                        if ($("#mainTitle").attr("coord") !== "") {
                            initX = $("#mainTitle").attr("coord").split(",")[0];
                            initY = $("#mainTitle").attr("coord").split(",")[1];
                        }
                        else {
                            initX = 0;
                            initY = 0;
                        }

                        map = L.map('map').setView([initX, initY], 18);
                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }).addTo(map);

                        marker = L.marker([initX, initY]).addTo(map);
                        doCircleMap();
                        doPolygonMap();
                        doPointMap();
                        ixy = ixy + 1;
                    }

                map.on('mousemove', function (ev) {
                    nowX = ev.latlng.lat.toFixed(decP);
                    nowY = ev.latlng.lng.toFixed(decP);
                    nowXbis = ev.latlng.lat.toFixed(decP);
                    nowYbis = ev.latlng.lng.toFixed(decP);
                    doAudioThings(nowX, nowY);
                    moving = 0;
                });


                map.on('click', function (ev) {
                    // Get the text field
                    var copyText = ev.latlng.lat.toFixed(decP) + ", " + ev.latlng.lng.toFixed(decP);

                    // Copy the text inside the text field
                    navigator.clipboard.writeText(copyText);

                    // Alert the copied text
                    alert(copyText);
                });
                textXY.innerHTML = "you denied me :-(";
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

    dothings.innerHTML = "Now Walk Around And Listen";


    circles.each(function () {
        var x = $(this).attr("coord").split(",")[0];
        var y = $(this).attr("coord").split(",")[1];
        var r = $(this).attr("size");
        var a = $(this).children("audio")[0];
        var n = $(this).attr("id");
        playCircle(x, y, r, a, n)
    });

    points.each(function () {
        var x = $(this).attr("coord").split(",")[0];
        var y = $(this).attr("coord").split(",")[1];
        var r = $(this).attr("size");
        var a = $(this).children("audio")[0];
        var n = $(this).attr("id");
        playPoint(x, y, r, a, n)
    });

    polygons.each(function () {
        var polyCoord = $(this).attr("coord");
        var a = $(this).children("audio")[0];
        var n = $(this).attr("id");
        playPolygon(polyCoord, a, n);
    });


}

function decVolume(a) {
    if (a.classList[0] !== 'playing') {
        var t = 0;
        if (a.parentElement.hasAttribute("fadeout")) {
            t = Number(a.parentElement.attributes.fadeout.value);

            var decT = t / 100;
            var Vcent = Math.round(a.volume * 100);
            Vcent = Vcent - 1;
            a.volume = (Math.round(Vcent) / 100).toFixed(6);
            setTimeout(function () {
                if (Vcent > 1) {
                    decVolume(a);
                } else {
                    a.volume = 0;
                    a.pause();
                    if (a.duration < 10) {
                        a.currentTime = 0;
                    }
                }
            }, decT);
        }
        else {
            a.pause();
            a.volume = 0;
            if (a.duration < 10) {
                a.currentTime = 0;
            }
        }
    }
}
// When volume at zero stop all the intervalling
function addVolume(a) {

    if (a.classList[0] == 'playing') {
        var t = 0;
        if (a.parentElement.hasAttribute("fadein")) {
            t = Number(a.parentElement.attributes.fadein.value);

            var addT = t / 100;
            var Vcent = Math.round(a.volume * 100);
            Vcent = Vcent + 1;
            a.volume = (Math.round(Vcent) / 100).toFixed(6);
            setTimeout(function () {
                if (Vcent < 99) {
                    addVolume(a);
                }
            }, addT);
        }
        else {
            a.volume = 1;
        }
    }
}
function playPoint(x, y, r, a, n) {
    // var distance = Number(measure(nowX, nowY, x, y));
    // if (distance <= r) {
    //     if ((a.paused)) {
    //         a.play();
    //         playing.innerHTML = n + " playing audio " + distance + " from " + a.id;
    //     }
    //         a.volume = (1 - distance / r).toFixed(6);
    //         //    console.log(a.volume);


    //     var source;
    //     a.volume = 1;
    //     audioCtx = new AudioContext();
    //     if (!audioCtx) {
    //         audioCtx = new AudioContext();

    //     }
    //     if (!source) {

    //         source = audioCtx.createMediaElementSource(a);
    //     }

    //     // Create a MediaElementAudioSourceNode
    //     // Feed the HTMLMediaElement into it


    //     var panNode = new StereoPannerNode(audioCtx);
    //     var gainNode = audioCtx.createGain();
    //     a.classList.add("playing");

    //     if ((a.classList[0] == 'playing')) {
    //         var dy = nowY - y;
    //         var dx = nowX - x;
    //         var theta = Math.atan2(dy, dx); // range (-PI, PI]
    //         theta *= 180 / Math.PI; // rads to degs, range (-180, 180]

    //     var vAngle = theta.toFixed(2);

    //     var  panValue = Math.sin(vAngle).toFixed(2);
    //     // Create audio context if it doesn't already exist
    //     // We can do this as their has been some user interaction
    //     gainNode.gain.value = (1 - distance / r).toFixed(6);
    //     // Event handler function to increase panning to the right and left
    //     // when the slider is moved


    //     // connect the AudioBufferSourceNode to the gainNode
    //     // and the gainNode to the destination, so we can play the
    //     // music and adjust the panning using the controls


    //     panNode.pan.value = panValue;
    //     console.log(panValue);
    //     console.log(panNode.pan.value);
    //     source.connect(gainNode).connect(panNode).connect(audioCtx.destination);
    //     }
    // }
}

function playAudio(a) {
    a.play();
}

function pauseAudio(a) {
    a.pause();
}

function playCircle(x, y, r, a, n) {
    var distance = Number(measure(nowX, nowY, x, y));
    if (distance <= r) {
        if ((a.paused)) {
            if (a.parentElement.parentElement.hasAttribute("group")) {
                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                for (var i = 0; i < groupAudio; i++) {
                    playAudio(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                }
            }
            else {
                a.play();
                playing.innerHTML = n + " playing audio " + distance + " from " + a.id;
            }
        }
        if ($(a).parents(".circle").attr("fade") == "center") {
            a.volume = (1 - distance / r).toFixed(6);
            //    console.log(a.volume);
            a.classList.add("playing");
        }
        else if (a.volume < 1 && (a.classList[0] !== 'playing')) {
            a.classList.add("playing");
            addVolume(a);
        }
    }

    if (distance > r && !(a.paused)) {
        if ($(a).parents(".circle").attr("fade") == "center") {
            a.volume = 0.0;
            a.classList.remove("playing");
            if (!(a.parentElement.parentElement.hasAttribute("group"))) {
                a.pause();
            }
            else {
                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                var groupPlayingAudio = a.parentElement.parentElement.querySelectorAll('.playing').length;
                if (groupPlayingAudio == 0)
                    for (var i = 0; i < groupAudio; i++) {
                        pauseAudio(a.parentElement.parentElement.querySelectorAll('audio')[i]);
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
                                }
                        }          
                    }
                }
            }, snapTime);
        }
    }
}

function playPolygon(pointList, a, n) {
    var point = [];
    var t = 1;
    // console.log(pointList);
    var polyCoord = JSON.parse(pointList);
    point.push(nowX);
    point.push(nowY);
    //  console.log(rayCasting(point, polyCoord));
    if (rayCasting(point, polyCoord)) {
        if ((a.paused)) {
            if (a.parentElement.parentElement.hasAttribute("group")) {
                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                for (var i = 0; i < groupAudio; i++) {
                    playAudio(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                }
            }
            else {
                a.play();
                playing.innerHTML = n + " playing audio " + " from " + a.id;
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
                    // Only fade if past the fade out point or not at zero already            
                }
             
                if (a.parentElement.parentElement.hasAttribute("group")) {
                    var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                    var groupPlayingAudio = a.parentElement.parentElement.querySelectorAll('.playing').length;
                    if (groupPlayingAudio == 0)
                        for (var i = 0; i < groupAudio; i++) {
                            decVolume(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                        }
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

function doPointMap() {
    // var cShapes = [];
    // points.each(function () {
    //     var x = $(this).attr("coord").split(",")[0];
    //     var y = $(this).attr("coord").split(",")[1];
    //     var r = $(this).attr("size");
    //     var a = $(this).children("audio")[0];
    //     var name = $(this).attr("id");
    //     var c = $(this).parents(".zone").attr("color");
    //     const n = points.length;
    //     for (var i = 0; i < n; ++i) {
    //         cShapes[i] = L.circle([x, y], {
    //             color: c,
    //             fillColor: c,
    //             fillOpacity: 0.1,
    //             radius: r
    //         }).addTo(map);
    //     }
    // });
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



// Create the root video element
var silenceConstAudio = document.createElement('audio');
silenceConstAudio.setAttribute('loop', '');
document.body.appendChild(silenceConstAudio);

// Add some styles if needed
// A helper to add sources to audio
var sourceSilence = document.createElement('source');
sourceSilence.src = 'Suoni/noSilence.mp3';
sourceSilence.setAttribute('type', 'audio/mp3');
silenceConstAudio.appendChild(sourceSilence);

// Create the root video element
var video = document.createElement('video');
video.setAttribute('loop', '');
// Add some styles if needed
video.setAttribute('style', 'position: relative; width: 1px; height: 1px');

// A helper to add sources to video
function addSourceToVideo(element, type, dataURI) {
    var source = document.createElement('source');
    source.src = dataURI;
    source.type = 'video/' + type;
    element.appendChild(source);
}

// A helper to concat base64
var base64 = function (mimeType, base64) {
    return 'data:' + mimeType + ';base64,' + base64;
};

// Add Fake sourced
addSourceToVideo(video, 'webm', base64('video/webm', 'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='));
addSourceToVideo(video, 'mp4', base64('video/mp4', 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=='));

// Append the video to where ever you need
document.body.appendChild(video);


const compassCircle = document.querySelector(".compass-circle");
const startBtn = document.querySelector(".start-btn");
const myPoint = document.querySelector(".my-point");
let compass;
const isIOS = !(
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)
);

function init() {
    startBtn.addEventListener("click", startCompass);
}

function startCompass() {
    if (isIOS) {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response === "granted") {
                    window.addEventListener("deviceorientation", handler, true);
                } else {
                    alert("has to be allowed!");
                }
            })
            .catch(() => alert("not supported"));
    } else {
        window.addEventListener("deviceorientationabsolute", handler, true);
    }
}

function handler(e) {
    compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;
}

// init();


// window.addEventListener("deviceorientation", handleOrientation);

// function handleOrientation(event) {
//     if (clk == 1) {
//         clk = 0;
//         alphaDir = event.alpha; // In degree in the range [0,360)
//         textXY.innerHTML = "orientation: alpha " + event.alpha;
//     }
// }

