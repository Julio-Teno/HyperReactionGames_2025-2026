import React from 'react';
import './style.css';

export default function SectionPrincipal({ titulo, texto, imagen }) {

  return (
    <div className="section sectionprincipal">
      <h2>{titulo}</h2>
      <p>{texto}</p>
      <picture>
          <source src={imagen} type="image/png" />
          <source src={imagen} type="image/webp" />
          {imagen && <img src={imagen} alt={titulo} />}
      </picture>
    </div>
  );
}