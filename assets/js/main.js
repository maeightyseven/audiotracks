

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

var audioObjs = document.getElementsByTagName('audio');
const options = {
    enableHighAccuracy: true,
    timeout: 10000,
};

var source = [];

window.onload = function () {
    for (var i = 0; i < audioObjs.length; i++) {
        var copyurl = audioObjs[source.length].children[0].src;
        source.push(copyurl);
        audioObjs[i].children[0].src = 'Suoni/system-silence.mp3';
        audioObjs[i].id = 'audio' + (i);
        audioObjs[i].parentElement.id = 'Shape' + (i);
        audioObjs[i].setAttribute('style', 'position:absolute;');
        audioObjs[i].volume = 0;
    }
};


function initAudio() {
    setTimeout(function () {
        var countA = 0;
        for (countA = 0; countA < audioObjs.length; countA++) {
            audioObjs[countA].play();
            initAudioStop(countA);
        }
        document.getElementsByTagName('body')[0].classList.add('ready');
    }, 25);
}

function initAudioStop(countA) {
    setTimeout(function () {
        audioObjs[countA].pause();
        document.querySelectorAll('audio')[countA].currentTime = 0;
        audioObjs[countA].children[0].src = source[countA];
    }, 50);
}

var shapes = [];

/*DOMContentLoaded*/

async function startGetLocation() {
    initAudio();
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
                    textXY.innerHTML = 'you denied me :-(';
                }
            },
            options
        );
    } else {
        textXY.innerHTML = 'Geolocation is not supported by this browser.';
    }

}

async function startGetLocationNoMap() {
    initAudio();
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
                    }
                    textXY.innerHTML = 'you denied me :-(';
                }
            },
            options
        );
    } else {
        textXY.innerHTML = 'Geolocation is not supported by this browser.';
    }

}

async function startGetLocationNoShapes() {
    initAudio();
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
                    textXY.innerHTML = 'you denied me :-(';
                }
            },
            options
        );
    } else {
        textXY.innerHTML = 'Geolocation is not supported by this browser.';
    }

}

function doAudioThings(nowX, nowY) {
    if (map != 0) {
        markerXY = L.latLng(nowX, nowY);
        marker.setLatLng(markerXY);
        // console.log(nowX);
        // console.log(nowY);
        textXY.innerHTML = 'ACTUAL POSITION: ' + nowX + ' , ' + nowY +
            '<br>STARTING POINT: ' + initX + ' , ' + initY +
            '<br>distance from STARTING POINT: ' + measure(initX, initY, nowX, nowY) + 'm';
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
    var maxvol;
    var roundVol;
    if (a.parentElement.hasAttribute('volume')) {
        maxvol = Number(a.parentElement.attributes.volume.value) / 100;
    } else {
        maxvol = 1;
    }
    if (a.volume.toFixed(4) > 0) {
        if (a.classList[0] !== 'playing') {
            var t = 0;
            if (a.parentElement.hasAttribute('fadeout')) {
                t = Number(a.parentElement.attributes.fadeout.value);
                var decT = t * maxvol / 50;
                a.volume = (a.volume - 0.02 * maxvol).toFixed(4);
                setTimeout(function () {
                    if (a.volume.toFixed(4) > (0.02 * maxvol).toFixed(4)) {
                        decVolume(a);
                    } else {
                        a.volume = 0;
                        if (!(a.parentElement.parentElement.hasAttribute('group'))) {
                            a.pause();
                        }
                        else {
                            if (a.parentElement.parentElement.querySelectorAll('.playing').length = 0) {
                                a.pause();
                            }
                        }
                        if ((a.duration.toFixed(2) < 10) || a.parentElement.hasAttribute('rewind') || a.duration.toFixed(2) == a.currentTime.toFixed(2)) {
                            a.currentTime = 0;
                        }
                    }
                }, decT);
            }
            else {
                a.volume = 0;
                if (!(a.parentElement.parentElement.hasAttribute('group'))) {
                    a.pause();
                }
                else {
                    if (a.parentElement.parentElement.querySelectorAll('.playing').length = 0) {
                        a.pause();
                    }
                }
                if ((a.duration < 10) || a.parentElement.hasAttribute('rewind') || a.duration.toFixed(2) == a.currentTime.toFixed(2)) {
                    a.currentTime = 0;
                }
            }
        }
    }
}
// When volume at zero stop all the intervalling
function addVolume(a) {
    var maxvol = 1;
    var roundVol;
    if (a.parentElement.hasAttribute('volume')) {
        maxvol = Number(a.parentElement.attributes.volume.value) / 100;
    }
    if (a.volume.toFixed(4) < maxvol) {
        if (a.classList[0] == 'playing') {
            var t = 0;
            if (a.parentElement.hasAttribute('fadein')) {
                t = Number(a.parentElement.attributes.fadein.value);
                var addT = t * maxvol / 50;
                a.volume = (a.volume + 0.02 * maxvol).toFixed(4);
                setTimeout(function () {
                    if (a.volume.toFixed(4) < maxvol) {
                        addVolume(a);
                    }
                }, addT);
            }
            else {
                a.volume = maxvol;
            }
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
    var maxvol = 1;
    var roundVol;
    var idist;
    if (a.parentElement.hasAttribute('volume')) {
        maxvol = Number(a.parentElement.attributes.volume.value) / 100;
    }
    var distance = Number(measure(nowX, nowY, x, y));
    if (distance <= r) {
        if (!(a.hasAttribute('controls'))) {
            a.setAttribute('controls', '')
        }
        if ((a.paused)) {
            if (a.parentElement.parentElement.hasAttribute('group')) {
                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                for (var i = 0; i < groupAudio; i++) {
                    if (!(groupAudio[i].parentElement.parentElement.hasAttribute('rewind'))) {
                        playAudio(groupAudio[i]);
                    }
                }
            }
            else if ((!(a.duration.toFixed(2) == a.currentTime.toFixed(2)) && !(a.parentElement.hasAttribute('rewind'))) || (a.hasAttribute('loop'))) {
                a.play();
            }
        }
        if (a.parentElement.hasAttribute('fade')) {
            if (distance < r) {
                idist = Math.cos(distance / r * 90 * Math.PI / 180);
                if (maxvol == 1) {
                    roundVol = (1 - distance / r).toFixed(4) * idist.toFixed(2);
                    a.volume = roundVol.toFixed(4);
                }
                else {
                    roundVol = (1 - distance / r).toFixed(4) * idist.toFixed(2) * maxvol;
                    a.volume = roundVol.toFixed(4);
                    if (roundVol.toFixed(2) <= maxvol) {
                        a.volume = roundVol.toFixed(2);
                    }
                }
                //console.log(a.volume);
                a.classList.add('playing');
            }
        }
        else if (a.volume < 1 && (a.classList[0] !== 'playing')) {
            a.classList.add('playing');
            addVolume(a);
        }
    }

    else if (distance > r && (!(a.paused) || (a.ended))) {
        if ($(a).parents('.circle').attr('fade') == 'center') {
            a.volume = 0.0;
            a.classList.remove('playing');
            if ((a.duration.toFixed(2) == a.currentTime.toFixed(2)) && !(a.hasAttribute('loop')) || a.parentElement.hasAttribute('rewind')) {
                a.currentTime = 0;
            }
            if (!(a.parentElement.parentElement.hasAttribute('group'))) {
                a.pause();
                a.removeAttribute('controls');
            }
            else {
                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                var groupPlayingAudio = a.parentElement.parentElement.querySelectorAll('.playing').length;

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
                    if ((!(a.paused)) && (a.classList[0] == 'playing')) {
                        a.classList.remove('playing');
                        decVolume(a);
                        // Only fade if past the fade out point or not at zero already  
                        if (a.parentElement.parentElement.hasAttribute('group')) {
                            var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                            var groupPlayingAudio = a.parentElement.parentElement.querySelectorAll('.playing').length;
                            if (groupPlayingAudio == 0) {
                                for (var i = 0; i < groupAudio; i++) {
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
                var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                for (var i = 0; i < groupAudio; i++) {
                    playAudio(a.parentElement.parentElement.querySelectorAll('audio')[i]);
                }
            }
            else if ((!(a.duration == a.currentTime)) || (a.duration == a.currentTime && a.hasAttribute('loop'))) {
                a.play();
            }
        }
        if (a.volume < 1 && (a.classList[0] !== 'playing')) {
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
                if ((!(a.paused)) && (a.classList[0] == 'playing')) {
                    a.classList.remove('playing');
                    decVolume(a);
                    if (a.parentElement.parentElement.hasAttribute('group')) {
                        var groupAudio = a.parentElement.parentElement.querySelectorAll('audio').length;
                        var groupPlayingAudio = a.parentElement.parentElement.querySelectorAll('.playing').length;
                        if (groupPlayingAudio == 0) {
                            for (var i = 0; i < groupAudio; i++) {
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
