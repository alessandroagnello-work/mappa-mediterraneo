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
      maxZoom: 10
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
      : "/med_color_en_hc.pmtiles";
  } else {
    currentMapUrl = language === 'it' 
      ? "/med_topo_it_z10.pmtiles" 
      : "/med_topo_en_z10.pmtiles";
  }

  const currentBgColor = highContrast ? "#e8edf2" : "#f2efe9";

  return (
    <div>
      <button 
        onClick={() => setHighContrast(!highContrast)}
        aria-pressed={highContrast}
        style={{ marginBottom: '15px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        {highContrast ? 'Disattiva Alto Contrasto' : 'Attiva Alto Contrasto'}
      </button>

      <div 
        className={`mappa-container ${highContrast ? 'mappa-alto-contrasto' : ''}`}
        role="region"
        aria-label="Mappa interattiva topografica del Mediterraneo"
        aria-describedby="map-instructions"
        tabIndex={0}
        onKeyDown={(e) => {
          if (mapRef.current) {
            const map = mapRef.current;
            const panStep = 80;
            const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '=', '-'];
            
            if (handledKeys.includes(e.key)) e.preventDefault(); 

            if (e.key === 'ArrowUp') map.panBy([0, -panStep]);
            if (e.key === 'ArrowDown') map.panBy([0, panStep]);
            if (e.key === 'ArrowLeft') map.panBy([-panStep, 0]);
            if (e.key === 'ArrowRight') map.panBy([panStep, 0]);
            if (e.key === '+' || e.key === '=') map.zoomIn();
            if (e.key === '-') map.zoomOut();
          }
        }}
      >
        <p id="map-instructions" className="sr-only">
          Usa le frecce direzionali della tastiera per spostarti sulla mappa. Usa i tasti più e meno per ingrandire o rimpicciolire.
        </p>

        <MapContainer
          ref={mapRef}
          center={[38.0, 16.0]}
          zoom={5}
          minZoom={5}
          maxZoom={10}
          maxBounds={MED_BOUNDS}
          maxBoundsViscosity={1.0}
          keyboard={false} 
          keyboardPanDelta={80}
          attributionControl={false}
          style={{ height: '100%', width: '100%', backgroundColor: currentBgColor }}
        >
          <PMTilesLayer key={currentMapUrl} url={currentMapUrl} />
          <ClickToCenter />
        </MapContainer>
      </div>
    </div>
  );
}