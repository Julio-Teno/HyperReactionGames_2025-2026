import './style.css';

export default function Conexionwebgl({ titulo }) {
 //voy a probar con un iframe ya que tengo el juego en public
  return (
    <div className='section'>
        <h1>{titulo}</h1>
        <div className='containerjuegos'>
          <iframe
              src="/PruebaMagicRain/index.html"
              title="Magic Rain"
              style={{ border: 'none' }}
          />
        </div>
    </div>
  );
}