// ------------- Carte --------------
const maCarte = L.map('macarte', {
    attributionControl: false, 
    zoomControl: false,
    maxZoom: 18
}).setView([54, -70], 5);

// ---------- Icônes ------------
const pinIcon = L.icon({
    iconUrl: '../../src/assets/img/pin.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -30]
});

const positionIcon = L.icon({
    iconUrl: '../../src/assets/img/position.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const pinBleueIcon = L.icon({
    iconUrl: '../../src/assets/img/pin_bleue.svg',
    iconSize: [14, 28],
    iconAnchor: [7, 28],
    popupAnchor: [0, -28]
});

const pinVerteIcon = L.icon({
    iconUrl: '../../src/assets/img/pin_verte.svg',
    iconSize: [14, 28],
    iconAnchor: [7, 28],
    popupAnchor: [0, -28]
});

const pinJauneIcon = L.icon({
    iconUrl: '../../src/assets/img/pin_jaune.svg',
    iconSize: [14, 28],
    iconAnchor: [7, 28],
    popupAnchor: [0, -28]
});

const pinRougeIcon = L.icon({
    iconUrl: '../../src/assets/img/pin_rouge.svg',
    iconSize: [14, 28],
    iconAnchor: [7, 28],
    popupAnchor: [0, -28]
});

const pinMauveIcon = L.icon({
    iconUrl: '../../src/assets/img/pin_mauve.svg',
    iconSize: [14, 28],
    iconAnchor: [7, 28],
    popupAnchor: [0, -28]
});

// -------------- Fonds de carte --------------
const antique = L.esri.Vector.vectorBasemapLayer('ArcGIS:ModernAntique:Base', {
    apikey: cleAPI
});
antique.addTo(maCarte);

const imagerie = L.esri.Vector.vectorBasemapLayer('ArcGIS:Imagery', {
    apikey: cleAPI 
});

// ---------------- Géolocalisation -----------------
const maPosition = document.querySelector('#maposition');

let getPosition = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(affichePosition, afficheErreur);
    } else {
        alert = "Votre navigateur ne prend pas en charge la géolocalisation.";
    }
}

let affichePosition = (position) => {
    maCarte.locate({ setView: true });

    maCarte.on('locationfound', (e) => {
        L.marker(e.latlng, { icon: positionIcon }).addTo(maCarte);
        L.circle(e.latlng, {
            fillOpacity: 0.6,
            radius: e.accuracy
        }).addTo(maCarte);
    });
    maCarte.flyTo([lat, long], 15);
}

let afficheErreur = (erreur) => {
    alert = "Nous n'avons pas réussi à trouver votre position.";
}

maPosition.addEventListener('click', getPosition);

// -------------------- Couches de données -----------------

// Liens
const urlImmeubles = "https://services6.arcgis.com/pG4MNR4EC4WmfCRT/ArcGIS/rest/services/donneesouvertesmccipclv7/FeatureServer/0";
const urlSites = "https://services6.arcgis.com/pG4MNR4EC4WmfCRT/ArcGIS/rest/services/donneesouvertesmccspclv7/FeatureServer/0";

// Couches
// 1920 et 1950 - 2010
const coucheImmeubles = L.esri.Cluster.featureLayer({
    url: urlImmeubles,
    pointToLayer: (feature, latlng) => {
        let annee = new Date(feature.properties.date_attribution_stat_jurid_pri).getFullYear();
        let pinIcon;
        if(annee < 1950) {
            pinIcon = pinBleueIcon;
        } else if(annee >= 1950 && annee < 1970) {
            pinIcon = pinVerteIcon;
        } else if(annee >= 1970 && annee < 1990) {
            pinIcon = pinJauneIcon;
        } else if(annee >= 1990 && annee < 2010) {
            pinIcon = pinRougeIcon;
        } else if(annee > 2010) {
            pinIcon = pinMauveIcon;
        }
        return L.marker(latlng, { icon: pinIcon });
    }    
}).addTo(maCarte);

// 1970 - 2010
const coucheSites = L.esri.featureLayer({
    url: urlSites,
    style: (feature) => {
        let annee = new Date(feature.properties.date_attribution_stat_jurid_pri).getFullYear();
        let couleur;
        if(annee < 1950) {
            couleur = "#218380" 
        } else if(annee >= 1950 && annee < 1970) {
            couleur = "#8FB339" 
        } else if(annee >= 1970 && annee < 1990) {
            couleur = "#FAA307" 
        } else if(annee >= 1990 && annee < 2010) {
            couleur = "#EF233C" 
        } else if(annee > 2010) {
            couleur = "#8F2D56" 
        }
        return { color: couleur, fillOpacity: 0.4, weight: 2 };
    }
}).addTo(maCarte);

// Pop-ups
coucheImmeubles.bindPopup((layer) => {
    return layer.feature.properties.nom_bien;
});

coucheSites.bindPopup((layer) => {
    return layer.feature.properties.nom_bien;
});

// Boite d'infos
const titre = document.querySelector("#titre_boite_info");
const description = document.querySelector("#description");
const synthese = document.querySelector("#synthese");
const lien_repertoire = document.querySelector("#lien_repertoire");
const photo = document.querySelector("#photo");
const sousTitresInfos = document.querySelectorAll("#informations h3, #informations p");

sousTitresInfos.forEach(titre => {
    titre.style.display = "none";
});

coucheImmeubles.on('click', (e) => {
    sousTitresInfos.forEach(titre => {
        titre.style.display = "block";
    });

    titre.innerHTML = e.layer.feature.properties.nom_bien;
    description.innerHTML = e.layer.feature.properties.description_bien;
    synthese.innerHTML = e.layer.feature.properties.synthese_historique;
    lien_repertoire.innerHTML = `Pour plus d'informations, vous pouvez consulter le <a href="${e.layer.feature.properties.url_rpcq}" target="_blank">répertoire du patrimoine culturel du Québec</a>.`;
});

coucheSites.on('click', (e) => {
    sousTitresInfos.forEach(titre => {
        titre.style.display = "block";
    });

    titre.innerHTML = e.layer.feature.properties.nom_bien;
    description.innerHTML = e.layer.feature.properties.description_bien;
    synthese.innerHTML = e.layer.feature.properties.synthese_historique;
    lien_repertoire.innerHTML = `Pour plus d'informations, vous pouvez consulter le <a href="${e.layer.feature.properties.url_rpcq}" target="_blank">répertoire du patrimoine culturel du Québec</a>.`;
});

// -------------------- Contrôles ---------------------

// Fonds de carte et couches
let fondsDeCarte = {
    "Antique": antique,
    "Imagerie": imagerie
};

let couches = {
    "Immeubles patrimoniaux": coucheImmeubles,
    "Sites patrimoniaux": coucheSites
}

L.control.layers(fondsDeCarte, couches).addTo(maCarte);

// Échelle et zoom
L.control.scale({
    "maxWidth":400, 
    "imperial":false, 
    "updateWhenIdle": true
}).addTo(maCarte);

L.control.zoom({
    position: "bottomleft", 
    zoomInTitle: "Zoom avant", 
    zoomOutTitle: "Zoom arrière"
}).addTo(maCarte);

// ----------------- Barre de recherche ------------------
const couchePoints = L.layerGroup();
couchePoints.addTo(maCarte);

const barreDeRecherche = L.esri.Geocoding.geosearch({
    position: "topleft",
    placeholder: "Entrer une adresse",
    useMapBounds: false,
    providers: [L.esri.Geocoding.arcgisOnlineProvider({
        apikey: cleAPI,
        nearby: {
            lat: 46,
            lng: -71
        },
    })]
}).addTo(maCarte);

barreDeRecherche.on("results", (data) => {
    for(let i=0; i<data.results.length; i++){
        couchePoints.clearLayers();
        let marqueur = L.marker(data.results[i].latlng);
        let textePopUp = '';
        if(data.results[i].text && data.results[i].properties.Place_addr) {
            textePopUp = `${data.results[i].text} <br> ${data.results[i].properties.Place_addr}`;
        } else {
            textePopUp = `${data.results[i].text}`;
        }
        marqueur.bindPopup(textePopUp);
        marqueur.addTo(couchePoints);
    }
});