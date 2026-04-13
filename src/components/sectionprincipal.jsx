import React from 'react';
import './style.css';

export default function SectionPrincipal({ titulo, texto, imagen }) {

  return (
    <div className="section sectionprincipal">
      <picture>
          <source src={imagen} type="image/png" />
          <source src={imagen} type="image/webp" />
          {imagen && <img src={imagen} alt={titulo} />}
      </picture>
      <div className='principal-text'>
        <h1>{titulo}</h1>
        <p>{texto}</p>
        <a href="#slidercont" className='btn bigbtn'>Ver juegos</a>
      </div>
      
      
    </div>
  );
}