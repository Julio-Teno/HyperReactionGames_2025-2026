import '../style.css';
import Contenedorvaloracionjuego from './contenedorvaloracionjuego';
import RankingJuego from './rankingjuego';
import { useState, useEffect, use } from 'react';

export default function Conexionwebgl({ titulo, nombrejuego, id_juego, descripcion, categoria, fecha_creacion }) {
 //voy a probar con un iframe ya que tengo el juego en public

  const [puntuacionObtenida, setPuntuacionObtenida] = useState(null);
  const [puedepuntuar, setPuedePuntuar] = useState(false);

  useEffect(() => {
    const escucharMensaje = async (event) => {
      if (event.origin !== window.location.origin) {
        return; //seguridad
      }

      if (event.data && event.data.tipo === 'JUEGO_TERMINADO') {
        const puntuacionObtenida = event.data.puntuacion;
        setPuntuacionObtenida(puntuacionObtenida);
        //console.log('Puntuación obtenida del juego:', puntuacionObtenida);
        setPuedePuntuar(true);
        // fetch a api para guardar la puntuacion
        try {
          const response = await fetch('/api/puntuaciones/postpuntuacion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id_juego: id_juego,
                puntuacion: puntuacionObtenida,
              }),
            });
            if (!response.ok) {
              throw new Error('Error al guardar la puntuación');
            }
        
        }
        catch (error) {
          console.error('Error al guardar la puntuación:', error);
        }
      }
    };

    window.addEventListener('message', escucharMensaje);

    return () => {
      window.removeEventListener('message', escucharMensaje);
    };
  }, [id_juego]); 


  return (
    <div className='sectionjuego'>
      <div className='containerjuegos-header'>
        <h1>{titulo}</h1>
        <Contenedorvaloracionjuego id_juego={id_juego} />
      </div>
        <div className='containerjuegos'>
          <iframe
              src={`/Juegosgl/${nombrejuego}/index.html`}
              title={titulo}
              style={{ border: 'none' }}
              allowFullScreen
              scrolling='no'
              loading='lazy'
          />
        </div>
        <div className='containerjuegos-section'>
          <div className='containerjuegos-section-columna containerjuegos-section-columna1'>
            {puedepuntuar && (
            <h2>Puntos obtenidos: {puntuacionObtenida !== null ? puntuacionObtenida : 'Aún no se ha obtenido una puntuación'}</h2>
            )}
            <h2>Descubre mas sobre el juego</h2>
            <div>
              <ul>
                <li><strong>Descripcion:</strong> {descripcion}</li>
                <li><strong>Categoria:</strong> {categoria}</li>
                <li><strong>Fecha de creacion:</strong> {new Date(fecha_creacion).toLocaleDateString()}</li>
              </ul>
            </div>
          </div>
        </div>   
    </div>
  );
  }