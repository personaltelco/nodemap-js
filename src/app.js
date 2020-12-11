function loaded() {
    var url = 'https://personaltelco.net/api/v0/hosts';
    status("loading " + url);
    var map = mapinit();
    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (data) { return setup(map, data.data); });
}
function ptplatlng(node) {
    if (node) {
        var lat = parseFloat(node.lat);
        var lng = parseFloat(node.lon);
        if (lat && lng) {
            return L.latLng(lat, lng);
        }
    }
}
/*
        "node": "BuffaloGap",
        "nodename": "Buffalo Gap Saloon and Eatery",
        "hostname": "dave",
        "description": "Buffalo Gap Saloon and Eatery",
        "notes": "",
        "status": "active",
        "splashpageversion": "2014",
        "logo": "BuffaloGap.png",
        "device": "ERX",
        "bridge": "0",
        "filter": "BOTH",
        "pubaddr": "10.11.9.1",
        "pubmasklen": 25,
        "privaddr": "192.168.11.1",
        "privmasklen": 24,
        "dhcpstart": 100,
        "address": "6835 SW Macadam Ave, Portland, OR 97219",
        "lat": "45.47452",
        "lon": "-122.6719",
        "url": "http://www.thebuffalogap.com/",
        "rss": "http://www.reverbnation.com/controller/rss/venue_shows_rss/buffalogapsaloon",
        "twitter": "thebuffalogap",
        "wikiurl": "https://personaltelco.net/wiki/NodeBuffaloGap",
        "updated": 1570247874974
*/
function make_marker(node) {
    var marker = L.marker(node.latlng);
    var node_date = dayjs(node.updated);
    marker.bindPopup("<b><a href=\"" + node.wikiurl + "\">" + node.node + "</a></b><br>" + node.address + "<br>last updated: " + node_date.format('YYYY-MM-DD'));
    return marker;
}
function status(msg) {
    document.getElementById("status").innerHTML = msg;
}
function find_bounding_box(nodes) {
    var minLat = 90;
    var minLng = 180;
    var maxLat = -90;
    var maxLng = -180;
    nodes.forEach(function (node) {
        minLat = Math.min(minLat, node.latlng.lat);
        minLng = Math.min(minLng, node.latlng.lng);
        maxLat = Math.max(maxLat, node.latlng.lat);
        maxLng = Math.max(maxLng, node.latlng.lng);
    });
    return [[minLat, minLng], [maxLat, maxLng]];
}
function setup(map, hash_nodes) {
    var all_nodes = hash_nodes.map(function (node) { return node[Object.keys(node)[0]]; }); //invert object layout
    all_nodes.forEach(function (node) { return node.latlng = ptplatlng(node); });
    var location_nodes = all_nodes.filter(function (node) { return node.latlng; });
    var active_nodes = all_nodes.filter(function (node) { return node.status == "active"; });
    status(all_nodes.length + " nodes loaded. " + active_nodes.length + " active. " + location_nodes.length + " with location.");
    map.fitBounds(find_bounding_box(location_nodes));
    location_nodes.forEach(function (node) {
        var marker = make_marker(node);
        if (marker) {
            marker.addTo(map);
        }
    });
}
function mapinit() {
    var map = L.map('ptp-map');
    var osmUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'OpenStreetMap Contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 2, maxZoom: 18, attribution: osmAttrib });
    osm.addTo(map);
    return map;
}
