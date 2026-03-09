import React from 'react';
import './style.css';

export default function Juegocont({ titulo, imagen, link }) {
  return (
    
        <div>
            <a href={link}>
                <div className='containerimgportada'>
                     <img src={imagen} alt={titulo} className='juegologo' />
                </div>
                <h2>{titulo}</h2>
            </a>
        </div>

  );
}
