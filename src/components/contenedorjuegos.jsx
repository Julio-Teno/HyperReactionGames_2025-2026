import React from 'react';
import './style.css';
import Juegocont from './juegocont';

export default function ContenedorJuegos() {
  return (
    <div>
        <h2>Todos los juegos</h2>
        <p>En el futuro insertar buscador aunque haga 3 juegos</p>
        <div className='containerportadasjuegos'>
            <Juegocont 
                titulo="Magic Rain"
                imagen="/Images/magicrain.png"
                link="/juego"
            />
            <Juegocont 
                titulo="Placeholder"
                imagen="/Images/placeholder.png"
                link="/noexiste"
            />
            <Juegocont 
                titulo="Placeholder"
                imagen="/Images/placeholder.png"
                link="/noexiste2"
            />
        </div>
    </div>
  );
}
