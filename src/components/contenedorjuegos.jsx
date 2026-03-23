import React from 'react';
import './style.css';
import Juegocont from './juegocont';
import { useState } from 'react';

export default function ContenedorJuegos() {
  const [searchTerm, setSearchTerm] = useState('');
  const juegos = [ //en el futuro bbdd
    {
        titulo: "Magic Rain", 
        descripcion: "Recoge todos los caramelos posibles antes de que caigan al suelo.",
        imagen: "/Images/magicrain.png",
        link: "/juego"
    },  
    {
        titulo: "Placeholder", 
        descripcion: "Descripción del juego placeholder.",
        imagen: "/Images/placeholder.png",
        link: "/noexiste"
    },
    {
        titulo: "Placeholder2",
        descripcion: "Descripción del juego placeholder.",
        imagen: "/Images/placeholder.png",
        link: "/noexiste2"
    },
    {
        titulo: "Placeholde3", 
        descripcion: "Descripción del juego placeholder.",
        imagen: "/Images/placeholder.png",
        link: "/noexiste"
    }

    //como hacer bbdd
    //consulta api\juegos.js
    //consulta ahi seria const juegos = await query('SELECT * FROM juegos')
    //si hay respuesta, juegos = respuesta.rows.map(juego => ({ titulo: juego.titulo, descripcion: juego.descripcion, imagen: no he puesto eso en la bbdd (placeholder), link: /juego/${juego.id}  }))
    //si no hay respuesta, juegos = [todavia no hay juegos F]
    //juegos.filter(juego => juego.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
];


  return (
    <div>
        <form id='buscarjuego'>
            <label htmlFor="buscar">Buscar juegos:</label>
            <input type='text' id='buscar' className='juegosbusqueda' placeholder='Escribe el juego que quieras jugar...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </form>
        
        <div className='containerportadasjuegos'>
            {juegos.filter(juego => juego.titulo.toLowerCase().includes(searchTerm.toLowerCase())).map((juego, index) => (
                <Juegocont key={index} titulo={juego.titulo} descripcion={juego.descripcion} imagen={juego.imagen} link={juego.link} />
            ))}
        </div>
    </div>
  );
}
