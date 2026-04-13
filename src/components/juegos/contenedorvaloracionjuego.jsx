import React from 'react';
import '../style.css';

export default function Contenedorvaloracionjuego({}) {


  return (
          <div className='containerjuegos-section-columna containerjuegos-section-columna2'>
            <h2>Valoraciones</h2>
            <div className='containerjuegos-sectioncontenido'>
              <button className=' btn valoracion'>Me gusta</button>
              <button className='btn valoracion'>No me gusta</button>
            </div>
            <p>Placeholder mostrar promedio puede que con una barra</p>
            <h3>Vota, vota... que salten las chispas</h3>
          </div>
  );
}