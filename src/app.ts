
declare var L: any;
declare var dayjs: any;

import type { PtpNode } from "./ptp_node"

export function loaded() {
    let url = 'https://personaltelco.net/api/v0/hosts'
    message(`loading ${url}`) 
    let map = mapinit()    
    fetch(url)
     .then(response => response.json())
     .then(data => {
        let nodes: PtpNode[] = data.data.map(node => node[Object.keys(node)[0]]) //invert object layout
        setup(map, nodes)
    })
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

function setup(map, all_nodes: PtpNode[]) {
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
