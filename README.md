# DOCUMENTAZIONE: COME GENERARE UNA MAPPA (OFFLINE) E MOSTRARLA SU REACT.JS

Questa documentazione spiega come estrarre una mappa base (es. Esri World Topo o Google Terrain) tramite QGIS e convertirla nel formato .pmtiles per l'utilizzo offline nel nostro componente React.
Per iniziare, dobbiamo installare nel nostro dispositivo QGIS

QGIS (Quantum GIS) è un software open-source e gratuito di livello professionale che rientra nella categoria dei Sistemi Informativi Geografici (GIS). È necessario per:
1. **Scaricare i dati (Tile Downloading):** Prelevare i tasselli immagine dai server originali (Google, Esri, ecc.) senza limitazioni di API.
2. **Ritagliare su misura l'area:** Delimitare il download al solo bounding box del Mediterraneo per evitare file di dimensioni colossali.
3. **Creare l'archivio (MBTiles):** Impacchettare migliaia di singole immagini 256x256 in un unico file compatto pronto per la conversione.

Dopo aver creato il MBTiles, lo convertiremo successivamente tramite bash in un PMTiles utilizzabile per il nostro progetto

## SCARICARE QGIS

Per scaricare QGIS, possiamo seguire la linea guida presente su questa doc:

```
https://qgis.org/resources/installation-guide/

```

Una volta installato correttamente, tramite bash possiamo avviarlo scrivendo:


```bash

qgis


```

avviato questo comando, se è stato scaricato correttamente, si aprirà QGIS

## COME CREIAMO LE MAPPE SU QGIS

QGIS ci permette di creare a mano le mappe o di importare delle mappe gia create tramite appositi url

Per il momento eseguiamo la 2 opzione, e per fare ciò, seguiamo i vari step:

### CREIAMO UNA NUOVA CONNESSIONE

Per importare una mappa gia esistente online, possiamo seguire uno dei 2 passaggi seguenti:


#### METODO 1: Creare una nuova connessione XYZ manualmente

1. A sinistra, nel pannello **"Browser"**, clicca col pulsante destro del mouse su **XYZ Tiles** e seleziona l'opzione **New Connection...**

<img src="public/imageTutorial/NewConnection.png" width="600" alt="Nuova connessione XYZ">


2. Si aprirà una finestra con varie opzioni. Compila solo i seguenti campi:
   - **Name (Nome):** Inserisci un nome riconoscibile per la mappa (es. Esri World Topo).
   - **URL:** Incolla l'indirizzo della mappa che intendi scaricare.

Ecco un esempio di URL per la mappa Esri Topo:
`https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`


<img src="public/imageTutorial/Name&UrlNewConnection.png" width="600" alt="Nome e url connessione">

*(Nota: Questo URL usa lo standard Slippy Map. Le variabili {z}, {y} e {x} dicono a QGIS di calcolare e scaricare dinamicamente il livello di zoom, la latitudine e la longitudine dei tasselli dell'area che stiamo inquadrando).*

---

#### METODO 2: Installare QuickMapServices

Per trovare facilmente gli URL delle mappe senza doverli cercare su internet o incollarli a mano, possiamo implementare un plugin di QGIS chiamato **QuickMapServices**. Questo plugin fornisce un catalogo integrato di mappe pronte all'uso.

1. Dal menu in alto di QGIS, vai su **Plugins > Manage and Install Plugins...**
2. Cerca `QuickMapServices`, seleziona **NextGIS QuickMapServices** dalla lista e clicca su **Install Plugin**.
3. Una volta installato, vai nel menu in alto **Web > QuickMapServices** e seleziona la mappa da scaricare (come ad esempio ESRI / ESRI TOPO)

<img src="public/imageTutorial/ImportViaPlugin" width="600" alt="Import tramite plugin">


---

## COME ESPORTARE LA MAPPA IN MBTILES

Una volta caricata la mappa base (visibile nel pannello "Layers" in basso a sinistra e al centro dello schermo), dobbiamo ritagliare esclusivamente l'area del Mediterraneo e generare il pacchetto compresso di tasselli.

1. Dal menu in alto, clicca su **Processing** > **Toolbox** (Strumenti di Processing). Comparirà una colonna sulla destra dello schermo.
2. Nella barra di ricerca della colonna Processing, digita `mbtiles`.
3. Sotto la cartella **Raster tools**, fai doppio clic su **Generate XYZ tiles (MBTiles)**.

<img src="public/imageTutorial/GenerateXYZTiles.png" width="600" alt="Strumenti di Processing MBTiles">

4. Nella finestra di configurazione che si apre, imposta i seguenti campi:
   - **Extent (Estensione):** Puoi definire l'area da scaricare in tre modi diversi cliccando sul pulsante a destra del campo:
     - **In base alla vista a schermo (Consigliato se hai già inquadrato l'area):** Clicca sul pulsante e scegli **Use Map Canvas Extent** (*Usa estensione della vista mappa*). QGIS utilizzerà i bordi visibili attualmente a schermo nel tuo progetto.
     - **Tramite coordinate manuali (Mediterraneo completo):** Incolla direttamente i valori:
       ```text
       -22.0, 20.0, 58.0, 55.0
       ```
     - **Selezione visiva a mano libera:** Clicca sul pulsante e scegli **Draw on Canvas** (*Disegna sulla vista mappa*), poi trascina il cursore sul foglio di lavoro disegnando un rettangolo attorno all'area desiderata.
     
   - **Minimum zoom:** `5`
   - **Maximum zoom:** `10`  
     *(Nota: Evitare zoom superiori a 10 o 11: ogni livello aggiuntivo quadruplica il numero di tasselli, facendo esplodere il peso del file oltre svariati gigabyte).*
   - **Tile format:** `JPG`
   - **Quality:** `85`
   - **Output file (MBTiles):** Clicca sui tre puntini `...` a destra, seleziona **Save to File...**, indica la cartella di destinazione e nomina il file (es. `mappa_mediterraneo.mbtiles`).

<img src="public/imageTutorial/EsempioParametriConnessione.png" width="600" alt="Parametri esportazione MBTiles">

5. Clicca sul pulsante **Run** (Esegui) in basso a destra. Il download richiederà alcuni minuti in base alla velocità della connessione.

---



# INSTALLAZIONE PMTILES STEP BY STEP AMBIENTE LINUX

Per installarlo, segui direttamente la guida presente in questo link:


```
https://docs.protomaps.com/guide/getting-started


```


## CONVERTIRE LE MAPPE CREATE IN QGIS IN FORMATO PMTILES

Fatta l'installazione di PMTiles, ora possiamo eseguire il comando di conversione del file creato precedentemente:

./pmtiles convert nome_mappa.mbtiles nome_mappa.pmtiles




# INSTALLAZIONE LIBRERIA LEAFLET

Una volta generato il file .pmtiles, spostalo all'interno della cartella public/ del tuo progetto React (creato ad esempio con Vite) affinché sia accessibile pubblicamente dal browser.

Per vedere nella pagina la mappa geografica creata, dobbiamo prima aggiungere nel nostro progetto react/js questa libreria, chiamata Leaflet, che ci permette di gestire il rendering cartografico e l'interattività (come zoom e trascinamento) nel browser in modo leggero e flessibile, non essendo un framework rigido ma una libreria mirata.

Apri il terminale nella cartella del tuo progetto React e installa i pacchetti necessari:

    npm install leaflet react-leaflet protomaps-leaflet

## INTEGRAZIONE DELLA MAPPA IN REACT

### 1. File di stile (`MapLayout.css`)
Leaflet richiede un'altezza esplicita sul contenitore per non collassare a 0 pixel. Crea il file `MapLayout.css`:

```css
.mappa-container {
  width: 100%;
  height: 640px;
  position: relative;
}
```

---

### 2. Componente Mappa (`src/components/MappaMediterraneo.jsx`)
Crea il componente che inizializza Leaflet e monta il layer raster dal file `.pmtiles`:

```jsx
import { useEffect } from 'react';
import { MapContainer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { PMTiles, leafletRasterLayer } from 'pmtiles';
import '../MapLayout.css';

// Limiti geografici dell'area esportata (Sud-Ovest, Nord-Est)
const MED_BOUNDS = [
  [20.0, -22.0],
  [55.0, 58.0]
];

function PMTilesLayer({ url }) {
  const map = useMap();

  useEffect(() => {
    // Carica il file PMTiles dalla cartella public/
    const p = new PMTiles(url);
    const layer = leafletRasterLayer(p, {
      minZoom: 5,
      maxZoom: 10
    });

    layer.addTo(map);

    // Pulizia del layer allo smontaggio del componente
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
      <MapContainer '100%' '100%', 16.0]} center="{[38.0," height: maxBounds="{MED_BOUNDS}" maxBoundsViscosity="{1.0}" maxZoom="{10}" minZoom="{5}" style="{{" width: zoom="{5}" }}>
        <PMTilesLayer url="/mappa_mediterraneo.pmtiles"/>
      </MapContainer>
    </div>
  );
}
```

---

### 3. Rendering del componente (`App.jsx`)
Importa e inserisci la mappa nel punto desiderato della tua applicazione:

```jsx
import MappaMediterraneo from './components/MappaMediterraneo';

export default function App() {
  return (
    <main>
      <h1>Mappa Offline del Mediterraneo</h1>
      <MappaMediterraneo/>
    </main>
  );
}
```