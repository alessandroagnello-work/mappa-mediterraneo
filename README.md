# DOCUMENTAZIONE INSTALLAZIONE PMTILES:

https://docs.protomaps.com/guide/getting-started

# INSTALLAZIONE PMTILES STEP BY STEP AMBIENTE LINUX

Per installarlo, andare o direttamente sulla repo github, o eseguire i seguenti step:

1. Scarica il pacchetto compresso specifico per architettura Linux a 64 bit dalla pagina delle release ufficiali.

    wget https://github.com/protomaps/go-pmtiles/releases/download/v1.31.2/go-pmtiles_1.31.2_Linux_x86_64.tar.gz

2. Decomprime il file .tar.gz ed estrae il file eseguibile pmtiles all'interno della cartella corrente.

    tar -xvf go-pmtiles_1.31.2_Linux_x86_64.tar.gz

3. Abilitare i permessi di esecuzione:

    chmod +x pmtiles

4. PMTILES sarà installato con successo, e possiamo vedere sia la sua versione, sia leggere e stampare a terminale l'intestazione e i metadati dell'archivio (livelli di zoom disponibili, bounding box complessivo, formato dei vettori, data di creazione e layer inclusi), tramite i 2 comandi:

    ./pmtiles version

## CREARE MAPPE TRAMITE COMANDI PMTILES (ESTRAZIONE)

Una volta installato il tool, possiamo estrarre una porzione specifica del pianeta per creare la nostra mappa locale e offline.

Utilizziamo il comando `extract` per scaricare solo l'area del Mar Mediterraneo dal file globale di Protomaps, specificando i confini geografici e il livello di dettaglio.

Esegui questo comando nel terminale:

    ./pmtiles extract https://build.protomaps.com/20261102.pmtiles med_large_z10.pmtiles --bbox=-20.0,29.0,55.0,48.0 --maxzoom=10


**parametri:**
* `https://.../20261102.pmtiles`: L'URL del file globale sorgente (il *planet*). (puoi controllare le build in https://maps.protomaps.com/builds/)

* `med_large_z10.pmtiles`: Il nome del file che verrà generato sul tuo computer.

* `--bbox=-20.0,29.0,55.0,48.0`: Il rettangolo di coordinate (Bounding Box) che delimita l'area da estrarre (Longitudine Ovest, Latitudine Sud, Longitudine Est, Latitudine Nord).

* `--maxzoom=10`: Il livello di ingrandimento massimo. Il livello 10 permette di visualizzare la la rete viaria urbana e le strade principali, mantenendo le dimensioni del file contenute.


Il file sarà necessario per essere integrato nella nostra applicazione React, fungendo da sorgente dati locale per visualizzare la mappa offline.


# INSTALLAZIONE LIBRERIA LEAFLET

Una volta generato il file med_z10.pmtiles, spostalo all'interno della cartella public/ del tuo progetto React (creato ad esempio con Vite) affinché sia accessibile pubblicamente dal browser.

Per vedere nella pagina la mappa geografica creata, dobbiamo prima aggiungere nel nostro progetto react/js questa libreria, chiamata Leaflet, che ci permette di gestire il rendering cartografico e l'interattività (come zoom e trascinamento) nel browser in modo leggero e flessibile, non essendo un framework rigido ma una libreria mirata.

Apri il terminale nella cartella del tuo progetto React e installa i pacchetti necessari:

    npm install leaflet react-leaflet protomaps-leaflet

## Integrazione della mappa

Per inserire la mappa all'interno di un layout complesso, simile a una dashboard, è consigliato separare gli stili in un file CSS dedicato sfruttando Flexbox per la disposizione degli elementi.

Crea un file chiamato `MapLayout.css` nella stessa cartella del componente e inserisci queste regole (includendo anche un lato responsive sia lato mobile sia lato pc):

```css
/* Stile base (Small - Mobile/Tablet verticale) */
.mappa-container {
  width: 100%;
  height: 800px; 
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Medium (Tablet orizzontale / Laptop) */
@media (min-width: 1024px) {
  .mappa-container {
    max-width: 1440px;
    height: 640px; 
  }
}

/* Large (Desktop ampi come nell'immagine) */
@media (min-width: 1440px) {
  .mappa-container {
    max-width: 1920px;
    height: 640px;
  }
}
```

Inseriamo dentro ad un nuovo file in component il seguente codice d'esempio:


```jsx

// File: src/components/MappaMediterraneo.jsx
import { useEffect } from 'react';
import { MapContainer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { leafletLayer } from 'protomaps-leaflet';
import '../MapLayout.css'; 

// Confini allargati necessari per coprire da Gibilterra/Atlantico fino all'estremità est
const MED_BOUNDS = [
  [29.0, -18.0], // Sud, Ovest (Atlantico)
  [48.0, 55.0]   // Nord, Est (Verso il Caspio)
];

function PMTilesLayer({ url }) {
  // Recupera l'istanza nativa di Leaflet creata dal componente genitore
  const map = useMap();

  useEffect(() => {
    // Genera il layer dal file .pmtiles impostando il tema visivo chiaro
    const layer = leafletLayer({ url: url, flavor: 'light' });
    
    // Mostra il layer aggiungendolo alla mappa
    layer.addTo(map);

    // Cleanup: rimuove il layer quando si chiude la mappa per liberare memoria
    return () => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    };
  }, [map, url]);

  return null;
}

export default function MappaMediterraneo() {
  return (
    <div className="mappa-container">
      <MapContainer
        center={[38.0, 15.0]}                       // Baricentro centrale del Mediterraneo
        zoom={5}                                    // Zoom 5 inquadra tutto il bacino a 1920px
        minZoom={5}                                 // Impedisce di rimpicciolire oltre i confini
        maxZoom={10}                                // Ingrandimento massimo consentito, da mantenere identico al parametro --maxzoom=10 usato nell'estrazione.
        maxBounds={MED_BOUNDS}                      // Recinto invisibile: blocca la visuale e impedisce il trascinamento (pan) al di fuori dell'area scaricata.
        maxBoundsViscosity={1.0}                    // Rigidità dei bordi al 100%: annulla l'effetto elastico o di rimbalzo quando l'utente urta i limiti della mappa.
        style={{ height: '100%', width: '100%' }}   // Regola obbligatoria di Leaflet: forza il componente a ereditare le dimensioni dal div genitore per non collassare a 0px.
      >
        <PMTilesLayer url="/med_large_z10.pmtiles" />
      </MapContainer>
    </div>
  );
}

```

Ora puoi richiamare la mappa in qualsiasi punto della tua applicazione richiamando il tag <MappaMediterraneo /> in una pagina.

```jsx

    <MappaMediterraneo />

```

