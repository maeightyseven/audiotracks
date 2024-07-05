
const textXY = document.getElementById('demo');
const dothings = document.getElementById('dothings');
const playing = document.getElementById('playing');
const mainTitle = document.getElementById('mainTitle');

var decP = 9; //decimal precision

var initX = 0;
var initY = 0;
var ixy = 0; //progressivo geolocalizzazione -> 0 -> prima geolocalizzazione = coordinate di partenza
var nowX = 0;
var nowY = 0;
var nowXbis;
var nowYbis;
var markerXY;

var marker = 0;
var map = 0;

var circles = $('.circle');
var polygons = $('.polygon');

var snapTime = 3000;
var alphaDir = 0;

var audioObjs = document.querySelectorAll('audio');

var videoPixel = document.getElementById('video-pixel');
var backgroundSilence = document.getElementsByClassName('background-silence')[0];

const options = {
    enableHighAccuracy: true,
    timeout: 10000,
};

var source = [];

// instigate our audio context

// load some sound
var tracks = [];

var gains = [];

var panners = [];
var panning = [];

var gainsCreate = [];

   var  audioCtx;
   var orientationX = 0;
   
   window.addEventListener("deviceorientation", handleOrientation, true);
   
//    function handleOrientation(event) {
//     orientationX = event.beta; // In degree in the range [-180,180)
//   }
 
for (var i = 0; i < document.getElementsByTagName('audio').length; ++i) {
        var input = document.createElement("input");
        input.setAttribute('type', 'number');
        input.setAttribute("value", 0);
        input.setAttribute("hidden", "");
        document.getElementsByTagName('audio')[i].id = "inputAudio"+i;
        var parent = document.getElementsByTagName('audio')[i].parentElement;
        parent.appendChild(input);
        input.value = 0;
       
 }


    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        } 
        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        
        for (var i = 0; i < document.getElementsByTagName('audio').length; ++i) {
             tracks.push(new MediaElementAudioSourceNode(audioCtx, {
                mediaElement: document.getElementsByTagName('audio')[i],
            }));
            gainsCreate[i] = audioCtx.createGain();
            gainsCreate[i].gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            panning[i] = { pan: 0 };
            panners[i] = new StereoPannerNode(audioCtx, panning[i]);
            tracks[i].connect(gainsCreate[i]).connect(panners[i]).connect(audioCtx.destination);

     }
     
        cycleAudio();
        document.getElementsByTagName('body')[0].classList.add('ready');
    }

    function cycleAudio() {
        // tracks.push(track);
        var i = source.length;

        // document.getElementsByTagName('audio')[i].id = 'audio' + (i);
        // document.getElementsByTagName('audio')[i].parentElement.id = 'Shape' + (i);
        var copyurl = document.getElementsByTagName('audio')[i].getElementsByTagName('source')[0].src;
        document.getElementsByTagName('audio')[i].crossOrigin = "anonymous";
        document.getElementsByTagName('audio')[i].src = 'https://maeightyseven.github.io/audiotracks/Suoni/system-silence.mp3';
        document.getElementsByTagName('audio')[i].getElementsByTagName('source')[0].src = 'https://maeightyseven.github.io/audiotracks/Suoni/system-silence.mp3';
        source.push(copyurl);
        document.querySelectorAll('audio')[i].play();
        if (source.length < document.getElementsByTagName('audio').length) {
            cycleAudio();
        } else {
            videoPixel.play();
            backgroundSilence.play();
        }
    }

    function initAudioStop(i) {
        if (i < document.getElementsByTagName('audio').length) {
            document.getElementsByTagName('audio')[i].pause();
            document.getElementsByTagName('audio')[i].currentTime = 0;
            document.getElementsByTagName('audio')[i].src = source[i];
            document.getElementsByTagName('audio')[i].getElementsByTagName('source')[0].src = source[i];
            gainsCreate[i].gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            i = i + 1;
            initAudioStop(i);
        } else {
                videoPixel.play();
                backgroundSilence.play();
            }
    }

    var shapes = [];

    /*DOMContentLoaded*/

    function startGetLocation() {
        initAudio();
        setTimeout(function () {
            document.getElementsByTagName('body')[0].classList.add('live');
            document.getElementsByTagName('body')[0].classList.add('edit');

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
                        initAudioStop(0);

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

                                document.getElementsByTagName('body')[0].classList.add('edit');
                                if (document.getElementById('mainTitle').hasAttribute('coord')) {
                                    initX = document.getElementById('mainTitle').getAttribute('coord').split(',')[0];
                                    initY = document.getElementById('mainTitle').getAttribute('coord').split(',')[1];
                                }
                                else {
                                    initX = 44.483132;
                                    initY = 11.349113;
                                }

                                map = L.map('map').setView([initX, initY], 16);
                                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                    maxZoom: 20,
                                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                }).addTo(map);

                                marker = L.marker([initX, initY]).addTo(map);
                                doCircleMap();
                                doPolygonMap();
                                ixy = ixy + 1;
                                initAudioStop(0);

                            }

                            dothings.innerHTML = 'Now Walk Around And Listen';


                            map.on('mousemove', function (ev) {
                                nowX = ev.latlng.lat.toFixed(decP);
                                nowY = ev.latlng.lng.toFixed(decP);
                                nowXbis = ev.latlng.lat.toFixed(decP);
                                nowYbis = ev.latlng.lng.toFixed(decP);
                                doAudioThings(nowX, nowY);
                            });


                            map.on('click', function (ev) {
                                // Get the text field
                                var copyText = ev.latlng.lat.toFixed(decP) + ', ' + ev.latlng.lng.toFixed(decP);

                                // Copy the text inside the text field
                                navigator.clipboard.writeText(copyText);

                                // Alert the copied text
                                dothings.innerHTML = copyText;
                            });
                            // textXY.innerHTML = 'you denied me :-(';
                        }
                    },
                    options
                );
            } else {
                textXY.innerHTML = 'Geolocation is not supported by this browser.';
            }
        }, 5000);

    }

    function startGetLocationNoMap() {
        initAudio();
        document.getElementsByTagName('body')[0].classList.add('live');
        setTimeout(function () {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(function getPosition(position) {

                    if (ixy == 0) {
                        initX = position.coords.latitude.toFixed(decP);
                        initY = position.coords.longitude.toFixed(decP);
                        // map = L.map('map').setView([initX, initY], 18);
                        // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        //     maxZoom: 19,
                        //     attribution: '&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>'
                        // }).addTo(map);

                        // marker = L.marker([initX, initY]).addTo(map);
                        // doCircleMap();
                        // doPolygonMap();

                        ixy = ixy + 1;
                        initAudioStop(0);
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

                                document.querySelector('body').classList.add('edit');
                                if (document.getElementById('mainTitle').hasAttribute('coord')) {
                                    initX = document.getElementById('mainTitle').getAttribute('coord').split(',')[0];
                                    initY = document.getElementById('mainTitle').getAttribute('coord').split(',')[1];
                                }
                                else {
                                    alert('ERRORE')
                                }
                                initAudioStop(0);

                            }
                            // textXY.innerHTML = 'you denied me :-(';
                        }
                    },
                    options
                );
            } else {
                textXY.innerHTML = 'Geolocation is not supported by this browser.';
            }
        }, 5000);

    }

    function startGetLocationNoShapes() {
        initAudio();
        setTimeout(function () {
            document.getElementsByTagName('body')[0].classList.add('live');
            document.getElementsByTagName('body')[0].classList.add('edit');
            
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
                        initAudioStop(0);
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

                                document.querySelector('body').classList.add('edit');
                                if (document.getElementById('mainTitle').hasAttribute('coord')) {
                                    initX = document.getElementById('mainTitle').getAttribute('coord').split(',')[0];
                                    initY = document.getElementById('mainTitle').getAttribute('coord').split(',')[1];
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
                                initAudioStop(0);

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
                                var copyText = ev.latlng.lat.toFixed(decP) + ', ' + ev.latlng.lng.toFixed(decP);

                                // Copy the text inside the text field
                                navigator.clipboard.writeText(copyText);

                                // Alert the copied text
                                dothings.innerHTML = copyText;
                            });
                            // textXY.innerHTML = 'you denied me :-(';
                        }
                    },
                    options
                );
            } else {
                textXY.innerHTML = 'Geolocation is not supported by this browser.';
            }
        }, 5000);

    }

    function doAudioThings(nowX, nowY) {
        if (map != 0) {
            markerXY = L.latLng(nowX, nowY);
            marker.setLatLng(markerXY);
            // console.log(nowX);
            // console.log(nowY);
            // textXY.innerHTML = 'ACTUAL POSITION: ' + nowX + ' , ' + nowY +
            //     '<br>STARTING POINT: ' + initX + ' , ' + initY +
            //     '<br>distance from STARTING POINT: ' + measure(initX, initY, nowX, nowY) + 'm';
        }

        circles.each(function () {
            var x = $(this).attr('coord').split(',')[0];
            var y = $(this).attr('coord').split(',')[1];
            var r = $(this).attr('size');
            var a = $(this).children('audio')[0];
            var n = $(this).attr('id');
            playCircle(x, y, r, a, n)
        });

        polygons.each(function () {
            var polyCoord = $(this).attr('coord');
            var a = $(this).children('audio')[0];
            var n = $(this).attr('id');
            playPolygon(polyCoord, a, n);
        });

    }

    function decVolume(a) {
        
        var index = a.id.substring(10);
        var maxvol;
        if (a.parentElement.hasAttribute('volume')) {
            maxvol = Number(a.parentElement.attributes.volume.value) / 100;
        } else {
            maxvol = 1;
        }
        var roundVol = gainsCreate[index].gain.value;
        var decT;
        if (a.classList[0] !== 'playing') {
            var t;
            if (a.parentElement.hasAttribute('fadeout')) {
                t = Number(a.parentElement.attributes.fadeout.value);
                decT = t/20;
                roundVol = roundVol - 0.05*maxvol;
                gainsCreate[index].gain.setValueAtTime(roundVol, audioCtx.currentTime + 0.05);
                if (roundVol > 0) {
                    setTimeout(() => {
                        decVolume(a);
                }  , decT);
            } else
                {
                    a.pause();
                }
            }
            else {
                gainsCreate[index].gain.setValueAtTime(0, audioCtx.currentTime + 0.1);

                a.parentElement.querySelector("input").value = 0;
                if (!(a.parentElement.parentElement.hasAttribute('group'))) {
                    a.pause();
                }
                else {
                    if (a.parentElement.parentElement.getElementsByClassName('playing').length == 0) {
                        a.pause();
                    }
                }
                if ((a.duration < 10) || a.parentElement.hasAttribute('rewind') || a.duration.toFixed(2) == a.currentTime.toFixed(2)) {
                    a.currentTime = 0;
                }
            }
        }
        
    }
    // When volume at zero stop all the intervalling
    function addVolume(a) {
        var index = a.id.substring(10);
        var maxvol = 1;
        var roundVol = gainsCreate[index].gain.value;
        var addT;
        if (a.parentElement.hasAttribute('volume')) {
            maxvol = Number(a.parentElement.attributes.volume.value) / 100;
        }

            if (a.classList[0] == 'playing') {
                var t;
                if (a.parentElement.hasAttribute('fadein')) {
                    t = Number(a.parentElement.attributes.fadein.value);
                    addT = t/20;
                    roundVol = roundVol + 0.05*maxvol;
                    gainsCreate[index].gain.setValueAtTime(roundVol, audioCtx.currentTime + 0.05);
                    if (roundVol < maxvol) {
                        setTimeout(() => {
                            addVolume(a);
                    }, addT);
                }  
                    //gainsCreate[index].gain.setTargetAtTime(maxvol, audioCtx.currentTime, );
                 }
                else {
                    gainsCreate[index].gain.exponentialRampToValueAtTime(maxvol, audioCtx.currentTime + 0.1);
                    a.parentElement.querySelector("input").value = maxvol;
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
        var index = a.id.substring(10);
        var withAngle = 0;
        var maxvol = 1;
        var roundVol;
        var idist;
        if (a.parentElement.hasAttribute('volume')) {
            maxvol = Number(a.parentElement.attributes.volume.value) / 100;
        }

        if (a.parentElement.hasAttribute('spatial') || document.body.classList.contains('spatial')) {
        withAngle = angle( nowX, nowY, x, y) - orientationX;
        panners[index].pan.value = withAngle/270 ;
         // max pan di 0.75
        }

        var distance = Number(measure(nowX, nowY, x, y));
        if (distance <= r) {
            if (!(a.hasAttribute('controls'))) {
                a.setAttribute('controls', '')
            }
            if ((a.parentElement.hasAttribute('spatial'))) {
                
            }
            if ((a.paused)) {
                if (a.parentElement.parentElement.hasAttribute('group')) {
                    var groupAudio = a.parentElement.parentElement.querySelectorAll('audio');
                    for (var i = 0; i < groupAudio.length; i++) {
                        if (!(groupAudio[i].parentElement.parentElement.hasAttribute('rewind'))) {
                            playAudio(groupAudio[i]);
                        }
                    }
                }
                if ((!(a.duration.toFixed(2) == a.currentTime.toFixed(2))) || (a.hasAttribute('loop'))) {
                    a.play();
                }
            }
            if (a.parentElement.hasAttribute('fade')) {
                if (distance < r) {
                    idist = Math.cos(distance / r * 90 * Math.PI / 180);
                    if (maxvol == 1) {
                        roundVol = (1 - distance / r).toFixed(3) * idist.toFixed(2);
                        gainsCreate[index].gain.setValueAtTime(roundVol.toFixed(3), audioCtx.currentTime);
                        a.parentElement.querySelector("input").value = roundVol.toFixed(3);
                    }
                    else {
                        roundVol = (1 - distance / r).toFixed(3) * idist.toFixed(2) * maxvol;
                        gainsCreate[index].gain.setValueAtTime(roundVol.toFixed(3), audioCtx.currentTime);
                        a.parentElement.querySelector("input").value = roundVol.toFixed(3);
                        if (roundVol.toFixed(3) <= maxvol) {
                            gainsCreate[index].gain.setValueAtTime(roundVol.toFixed(3), audioCtx.currentTime);
                            a.parentElement.querySelector("input").value = roundVol.toFixed(3);
                        }
                    }
                    //console.log(a.volume);
                    a.classList.add('playing');
                }
            }
            if (a.parentElement.querySelector("input").value < 1 && (a.classList[0] !== 'playing')) {
                a.classList.add('playing');
                addVolume(a);
            }
        }

        else if (distance > r && (!(a.paused) || (a.ended))) {
            if ($(a).parents('.circle').attr('fade') == 'center') {
                gainsCreate[index].gain.setValueAtTime(0, audioCtx.currentTime);
                a.parentElement.querySelector("input").value = 0;
                a.classList.remove('playing');
                if ((a.duration.toFixed(2) == a.currentTime.toFixed(2)) && !(a.hasAttribute('loop')) || a.parentElement.hasAttribute('rewind')) {
                    a.currentTime = 0;
                }
                if (!(a.parentElement.parentElement.hasAttribute('group'))) {
                    a.pause();
                    a.removeAttribute('controls');
                }
                else {
                    var groupPlayingAudio = a.parentElement.parentElement.getElementsByClassName('playing').length;
                    if (groupPlayingAudio == 0) {
                        a.pause();
                        a.removeAttribute('controls');
                    }
                }
            }
            else {
                setTimeout(function () {
                    distance = Number(measure(nowX, nowY, x, y));
                    if (distance > r) {
                        if ((!(a.paused) || (a.ended)) && (a.classList[0] == 'playing')) {
                            a.classList.remove('playing');
                            decVolume(a);
                            // Only fade if past the fade out point or not at zero already  
                            if (a.parentElement.parentElement.hasAttribute('group')) {
                                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio');
                                var groupPlayingAudio = a.parentElement.parentElement.getElementsByClassName('playing').length;
                                if (groupPlayingAudio == 0) {
                                    for (var i = 0; i < groupAudio.length; i++) {
                                        decVolume(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                                        a.parentElement.parentElement.querySelectorAll('audio')[i].removeAttribute('controls')

                                    }
                                }
                            }
                        }
                        a.removeAttribute('controls')
                    }
                }, snapTime);
            }
        }
    }

    function playPolygon(pointList, a, n) {
        // const gainNode = new gainNode(audioCtx);
        var point = [];
        // console.log(pointList);
        var polyCoord = JSON.parse(pointList);
        point.push(nowX);
        point.push(nowY);

        //  console.log(rayCasting(point, polyCoord));
        if (rayCasting(point, polyCoord)) {
    
            if ((a.paused)) {
                a.setAttribute('controls', '');
                if (a.parentElement.parentElement.hasAttribute('group')) {
                    var groupAudio = a.parentElement.parentElement.querySelectorAll('audio');
                    for (var i = 0; i < groupAudio.length; i++) {
                        playAudio(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                    }
                }
                if ((!(a.duration == a.currentTime)) || (a.duration == a.currentTime && a.hasAttribute('loop'))) {
                    a.play();
                }
            }
            if (a.parentElement.querySelector("input").value < 1 && (a.classList[0] !== 'playing')) {
                a.classList.add('playing');
                addVolume(a);
            }
        }

        if (!(rayCasting(point, polyCoord))) {
            setTimeout(function () {
                var newXY = [];
                newXY.push(nowXbis);
                newXY.push(nowYbis);
                if (!(rayCasting(newXY, polyCoord))) {
                    newXY = [];
                    if ((!(a.paused) || (a.ended)) && (a.classList[0] == 'playing')) {
                        a.classList.remove('playing');
                        decVolume(a);
                        if (a.parentElement.parentElement.hasAttribute('group')) {
                            var groupAudio = a.parentElement.parentElement.querySelectorAll('audio');
                            var groupPlayingAudio = a.parentElement.parentElement.getElementsByClassName('playing').length;
                            if (groupPlayingAudio == 0) {
                                for (var i = 0; i < groupAudio.length; i++) {
                                    decVolume(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                                    a.parentElement.parentElement.querySelectorAll('audio')[i].removeAttribute('controls')

                                }
                            }
                        }
                        a.removeAttribute('controls')
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

    function angle(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        //if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
      }

    function doCircleMap() {
        var cShapes = [];
        circles.each(function () {
            var x = $(this).attr('coord').split(',')[0];
            var y = $(this).attr('coord').split(',')[1];
            var r = $(this).attr('size');
            var a = $(this).children('audio')[0];
            var name = $(this).attr('id');
            var c = $(this).parents('.zone').attr('color');
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
            var pointList = $(this).attr('coord');
            var a = $(this).children('audio')[0];
            var name = $(this).attr('id');
            const n = polygons.length;
            var c = $(this).parents('.zone').attr('color');
            for (var i = 0; i < n; ++i) {
                var polyCoord = JSON.parse(pointList);
                pShapes[i] = L.polygon([polyCoord], {
                    color: c,
                }).addTo(map);
            }
        });
    }
