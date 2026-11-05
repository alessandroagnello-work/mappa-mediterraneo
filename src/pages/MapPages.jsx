import { useParams } from 'react-router-dom';
import MappaMediterraneo from '../components/MappaMediterraneo';

export default function MapPage() {
  const { lang } = useParams(); // Legge automaticamente 'it' o 'en' dall'URL
  const activeLang = lang === 'en' ? 'en' : 'it';

  return (
    <div>
      <h2>{activeLang === 'it' ? 'Dashboard Mappa (IT)' : 'Map Dashboard (EN)'}</h2>
      <MappaMediterraneo language={activeLang} />
    </div>
  );
}