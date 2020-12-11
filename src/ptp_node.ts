export interface PtpNode {
    node: string;
    nodename: string;
    hostname: string;
    description: string;
    notes: string;
    status: string;
    splashpageversion: string;
    logo: string;
    device: string;
    bridge: string;
    filter: string;
    pubaddr: string;
    pubmasklen: number;
    privaddr: string;
    privmasklen: number;
    dhcpstart: number;
    address: string;
    lat: string;
    lon: string;
    url: string;
    rss: string;
    twitter: string;
    wikiurl: string;
    updated: number;

    latlng: any // leaflet L.latlng
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
