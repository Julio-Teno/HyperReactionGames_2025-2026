import React from 'react';
import '../style.css';
import Juegocont from './juegocont';
import { useState, useEffect } from 'react';

export default function RankingJuego({id_juego, limite = null}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [ranking, setRanking] = useState([]); 


  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const url = limite ? `/api/puntuaciones/getpuntuacion/${id_juego}?limite=${limite}` : `/api/puntuaciones/getpuntuacion/${id_juego}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener los juegos');
        }
        
        const data = await response.json();
        setRanking(data);
      } catch (error) {
        console.error('Error fetching juegos:', error);
        setRanking([]);
      }
    };

    if (id_juego) {
        fetchJuegos();
    }
  }, [id_juego, limite]);

    

    //como hacer bbdd
    //consulta api\juegos.js
    //consulta ahi seria const juegos = await query('SELECT * FROM juegos')
    //si hay respuesta, juegos = respuesta.rows.map(juego => ({ titulo: juego.titulo, descripcion: juego.descripcion, imagen: no he puesto eso en la bbdd (placeholder), link: /juego/${juego.id}  }))
    //si no hay respuesta, juegos = [todavia no hay juegos F]
    //juegos.filter(juego => juego.titulo.toLowerCase().includes(searchTerm.toLowerCase()))

    let rankingFiltrado = ranking.filter(juego => juego.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortOption === 'nombre') {
      rankingFiltrado.sort((a, b) => a.nombre_usuario.localeCompare(b.nombre_usuario));
        } else if (sortOption === 'primeros' || sortOption === '') {
        rankingFiltrado.sort((a, b) => b.puntuacion - a.puntuacion);
    } else if (sortOption === 'ultimos') {
       rankingFiltrado.sort((a, b) => a.puntuacion - b.puntuacion);
    } 


  return (
    <div>
        <form id='buscarjuego'>
            <input type='text' id='buscar' className='juegosbusqueda' placeholder='Buscar usuario' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </form>
        
        <h1>Ranking de {ranking[0]?.nombre_juego || 'Juego'}</h1>
        <table className='tabla-juegos'>
            <thead>
                <tr>
                    <th>Posición</th>
                    <th>Usuario</th>
                    <th>Puntuación</th>
                    <th><select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value='primeros' disabled>Ordenar por</option>
                        <option value='nombre'>Nombre</option>
                        <option value='primeros'>Primeros</option>
                        <option value='ultimos'>Ultimos</option>
                    </select></th>
                </tr>
            </thead>
            <tbody>
                {rankingFiltrado.map((puntuacion, index) => (
                    <tr key={index} className={puntuacion.es_usuario ? 'puntuacion-usuario' : ''}>
                        <td>{puntuacion.posicion || index + 1}</td>
                        <td>{puntuacion.nombre_usuario}{puntuacion.es_usuario ? ' (Tú)' : ''}</td>
                        <td>{puntuacion.puntuacion}</td>
                        <td></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}
