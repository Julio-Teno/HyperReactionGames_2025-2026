import React from 'react';
import '../style.css';
import { useState } from 'react';

export default function Juegocont({ titulo, imagen, descripcion, link }) {
  const [descripcionState, setDescripcionState] = useState(descripcion);
  const [descripcionMostrada, setDescripcionMostrada] = useState(false);

  return (
    
        <div>
            <a href={link}>
                <div className='containerimgportada'>
                     <picture>
                        <source src={imagen} type="image/png" />
                        <source src={imagen} type="image/webp" />
                        <img src={imagen} alt={titulo} className='juegologo' />
                     </picture>         
                </div>
            </a>
                <div className='containertextojuego'>
                    <h2>{titulo}</h2>
                     <button className='btn' onClick={() => setDescripcionMostrada(!descripcionMostrada)}>
                        {descripcionMostrada ? 'Saber menos' : 'Saber mas'}
                    </button>
                    {descripcionMostrada && <p>{descripcionState}</p>}
                </div>
        </div>

  );
}
