import '../style.css';
import Contenedorvaloracionjuego from './contenedorvaloracionjuego';

export default function Conexionwebgl({ titulo, nombrejuego, id_juego, descripcion, categoria, fecha_creacion }) {
 //voy a probar con un iframe ya que tengo el juego en public
  return (
    <div className='section sectionjuego'>
        <h1>{titulo}</h1>
        <div className='containerjuegos'>
          <iframe
              src={`/Juegosgl/${nombrejuego}/index.html`}
              title={titulo}
              style={{ border: 'none' }}
              allowFullScreen
              secure
              scrolling='no'
              loading='lazy'
          />
        </div>
        <div className='containerjuegos-section'>
          <Contenedorvaloracionjuego id_juego={id_juego} />
          <div className='containerjuegos-section-columna containerjuegos-section-columna1'>
            <h2>Descubre mas sobre el juego</h2>
            <div>
              <ul>
                <li><strong>Descripcion:</strong> {descripcion}</li>
                <li><strong>Categoria:</strong> {categoria}</li>
                <li><strong>Fecha de creacion:</strong> {new Date(fecha_creacion).toLocaleDateString()}</li>
              </ul>
            </div>
            <h2>Controles</h2>
            <div className='containerjuegos-sectioncontenido'>
              <p>Placeholder</p>
              <p>W, A, S, D para moverse</p>
              <p>Click izquierdo para interactuar</p>
            </div> 
          </div>
        </div>     
    </div>
  );
}