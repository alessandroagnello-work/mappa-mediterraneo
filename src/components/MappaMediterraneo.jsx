import { useEffect, useRef, useState } from 'react';
import { MapContainer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { PMTiles, leafletRasterLayer } from 'pmtiles';
import '../MapLayout.css'; 

const MED_BOUNDS = [
  [20.0, -22.0],
  [55.0, 58.0]
];

function PMTilesLayer({ url }) {
  const map = useMap();

  useEffect(() => {
    const p = new PMTiles(url);
    const layer = leafletRasterLayer(p, {
      maxZoom: 9
    });
    
    layer.addTo(map);
    return () => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    };
  }, [map, url]);

  return null;
}

// Funzione per centrare la mappa al click dell'utente con il mouse
function ClickToCenter() {
  const map = useMap();
  useEffect(() => {
    const handleClick = (e) => map.panTo(e.latlng);
    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map]);
  return null;
}

// 1. Accetta language come prop passata da MapPage
export default function MappaMediterraneo({ language = 'it' }) {
  const mapRef = useRef(null);
  const [highContrast, setHighContrast] = useState(true); 

  // 2. Determina il file PMTiles in base a contrasto e alla prop language
  let currentMapUrl = "";
  if (highContrast) {
    currentMapUrl = language === 'it' 
      ? "/med_color_it_hc.pmtiles" 
      : "/med_color_hc_9.pmtiles";
  } else {
    currentMapUrl = "/med_topo_z10.pmtiles";
  }

  const currentBgColor = highContrast ? "#e8edf2" : "#f2efe9";

  return (
    <div>
      {/* Bottone per attivare/disattivare la visibilità della mappa ad alto contrasto */}
      <button 
        onClick={() => setHighContrast(!highContrast)}
        aria-pressed={highContrast}
        style={{ marginBottom: '15px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        {highContrast ? 'Disattiva Alto Contrasto' : 'Attiva Alto Contrasto'}
      </button>

      {/* Gestisce il tema ad alto contrasto e abilita la navigazione da tastiera bloccando lo scroll della pagina */}
      <div 
        className={`mappa-container ${highContrast ? 'mappa-alto-contrasto' : ''}`}  {/* Applica la classe base e, se attivo, aggiunge lo stile per l'alto contrasto */}
        role="region"
        aria-label="Mappa interattiva topografica del Mediterraneo"
        aria-describedby="map-instructions"
        tabIndex={0}
        onKeyDown={(e) => {

          // Esegue i comandi se l'istanza Leaflet è già montata
          if (mapRef.current) {
            const map = mapRef.current;
            const panStep = 80;
            const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '=', '-'];
            
            // Impedisce lo scroll predefinito della pagina web quando si usano le frecce
            if (handledKeys.includes(e.key)) e.preventDefault(); 

            if (e.key === 'ArrowUp') map.panBy([0, -panStep]);             //movimento verso l'alto della mappa
            if (e.key === 'ArrowDown') map.panBy([0, panStep]);            //movimento verso il basso della mappa
            if (e.key === 'ArrowLeft') map.panBy([-panStep, 0]);           //movimento verso sinistra della mappa  
            if (e.key === 'ArrowRight') map.panBy([panStep, 0]);           //movimento verso destra della mappa
            if (e.key === '+' || e.key === '=') map.zoomIn();              //zoom in della mappa
            if (e.key === '-') map.zoomOut();                              //zoom out della mappa
          }
        }}
      > 
        <p id="map-instructions" className="sr-only">
          Usa le frecce direzionali della tastiera per spostarti sulla mappa. Usa i tasti più e meno per ingrandire o rimpicciolire.
        </p>

        <MapContainer
          ref={mapRef}                  // Riferimento alla mappa per la navigazione da tastiera
          center={[38.0, 16.0]}         // Centro della mappa sul Mediterraneo
          zoom={5}                      // Zoom iniziale della mappa
          minZoom={5}                   // Zoom minimo della mappa
          maxZoom={9}                   // Zoom massimo della mappa
          maxBounds={MED_BOUNDS}        // Limiti della mappa per il Mediterraneo
          maxBoundsViscosity={1.0}      // Impedisce di uscire dai limiti della mappa
          keyboard={false}              // Disabilita la navigazione da tastiera predefinita di Leaflet per implementare quella personalizzata 
          keyboardPanDelta={80}         // Imposta la distanza di spostamento della mappa quando si usano le frecce direzionali
          attributionControl={false}    // Disabilita il controllo di attribuzione per una visualizzazione più pulita
          style={{ height: '100%', width: '100%', backgroundColor: currentBgColor }}
        >
          <PMTilesLayer key={currentMapUrl} url={currentMapUrl} /> {/* Ricarica il layer PMTiles quando cambia l'URL tra quelle disponibili */}
          <ClickToCenter />
        </MapContainer>
      </div>
    </div>
  );
}