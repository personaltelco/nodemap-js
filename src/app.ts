declare var L: any;
declare var dayjs: any;

function loaded() {
    let url = 'https://personaltelco.net/api/v0/hosts'
    message(`loading ${url}`) 
    let map = mapinit()    
    fetch(url)
     .then(response => response.json())
     .then(data => setup(map, data.data));
}

function ptplatlng(node) {
    if(node) {
        let lat = parseFloat(node.lat)
        let lng = parseFloat(node.lon)
        if (lat && lng) {
          return L.latLng(lat,lng)
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
    let marker = L.marker(node.latlng)
    let node_date = dayjs(node.updated)
    marker.bindPopup(`<b><a href="${node.wikiurl}">${node.node}</a></b><br>${node.address}<br>last updated: ${node_date.format('YYYY-MM-DD')}`)
    return marker
}

function message(msg) {
    document.getElementById("status").innerHTML = msg   
}

function find_bounding_box(nodes) {
    var minLat = 90
    var minLng = 180
    var maxLat = -90
    var maxLng = -180

    nodes.forEach(node => {
        minLat = Math.min(minLat, node.latlng.lat)
        minLng = Math.min(minLng, node.latlng.lng)
        maxLat = Math.max(maxLat, node.latlng.lat)
        maxLng = Math.max(maxLng, node.latlng.lng)
    })
    return [[minLat, minLng], [maxLat, maxLng]]
}

function setup(map, hash_nodes) {
    let all_nodes = hash_nodes.map(node => node[Object.keys(node)[0]]) //invert object layout
    all_nodes.forEach(node => node.latlng = ptplatlng(node))
    let location_nodes = all_nodes.filter(node => node.latlng)
    let active_nodes = all_nodes.filter(node => node.status == "active")
    message(`${all_nodes.length} nodes loaded. ${active_nodes.length} active. ${location_nodes.length} with location.`)

    map.fitBounds(find_bounding_box(location_nodes))
    location_nodes.forEach(node => {
        let marker = make_marker(node)
        if(marker) {
          marker.addTo(map)
        }
    })
}

function mapinit() {
    var map = L.map('ptp-map')
    var osmUrl='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var osmAttrib='OpenStreetMap Contributors'
    var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib});
    osm.addTo(map)
    return map
}
