import React from 'react';
import '../style.css';
import Juegocont from './juegocont';
import { useState, useEffect } from 'react';

export default function ContenedorJuegos({url , categoria = null}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [juegos, setJuegos] = useState([]); 

  if (categoria) {
    url = `/api/juegos/getjuegoscategoria?categoria=${categoria}`;
  }

  useEffect(() => { //pulir
    fetch(`${url}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener los juegos');
            }
            return response.json();
        })
        .then((data) => {
            setJuegos(data);
        })
        .catch((error) => {
            console.error('Error fetching juegos:', error);
            setJuegos([]);
        });
  }, []);

    

    //como hacer bbdd
    //consulta api\juegos.js
    //consulta ahi seria const juegos = await query('SELECT * FROM juegos')
    //si hay respuesta, juegos = respuesta.rows.map(juego => ({ titulo: juego.titulo, descripcion: juego.descripcion, imagen: no he puesto eso en la bbdd (placeholder), link: /juego/${juego.id}  }))
    //si no hay respuesta, juegos = [todavia no hay juegos F]
    //juegos.filter(juego => juego.titulo.toLowerCase().includes(searchTerm.toLowerCase()))

    let juegosFiltrados = juegos.filter(juego => juego.titulo.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortOption === 'titulo') {
      juegosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (sortOption === 'fecha' || sortOption === '') {
        juegosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); 
    } else if (sortOption === 'antiguos') {
        juegosFiltrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    } else if (sortOption === 'popularidad') {        
        juegosFiltrados.sort((a, b) => b.popularidad - a.popularidad);
    }



  return (
    <div>
        <form id='buscarjuego'>
            <input type='text' id='buscar' className='juegosbusqueda' placeholder='Escribe el juego que quieras jugar...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select id='ordenarpor' value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value=''>Ordenar por</option>
                <option value='titulo'>Nombre</option>
                <option value='fecha'>Recientes</option>
                <option value='antiguos'>Antiguos</option>
                <option value='popularidad'>Populares</option>
            </select>
        </form>
        
        <div className='containerportadasjuegos'>
            { juegosFiltrados.map((juego, index) => (
                <Juegocont key={index} titulo={juego.titulo} descripcion={juego.descripcion} imagen={juego.imagen} link={juego.link}  />   
            ))}
            {juegosFiltrados.length === 0 && <p>No se encontraron juegos que coincidan con tu búsqueda.</p>}
        </div>
    </div>
  );
}
