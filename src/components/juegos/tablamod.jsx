import React from 'react';
import '../style.css';
import Juegocont from './juegocont';
import { useState, useEffect } from 'react';
import ModalCambioFoto from '../modal-cambiofoto';
import ModalCambioDatos from '../modal-cambiodatos';

export default function Tablamod({url , categoria = null}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [juegos, setJuegos] = useState([]); 

  const getClaseValoracion = (popularidad) => {
      if (popularidad >= 80) {
          return 'valoracion-alta';
      } else if (popularidad < 50) {
          return 'valoracion-baja';
      }
      return '';
  };

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
    <table className="tabla-juegos">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Fecha</th>
          <th>Hecho por</th>
          <th>Popularidad</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {juegosFiltrados.map((juego, index) => (
          <tr key={index}>
            <td>{juego.titulo}</td>
            <td>{juego.descripcion}</td>
            <td>{juego.categoria}</td>
            <td>{juego.fecha}</td>
            <td>{juego.id_usuario}</td>
            <td className={`valoracion ${getClaseValoracion(juego.popularidad)}`}>{juego.popularidad}</td>
            <td><img src={juego.imagen} alt={juego.titulo} /></td>
            <td>
              <ModalCambioDatos 
                  url={`/api/juegos/putjuegos/${juego.id}`}  
                  id_juego={juego.id}
                  client:load
              />
              <ModalCambioFoto 
                  url={`/api/juegos/postportada/${juego.id}`} 
                  textoBoton="Cambiar imagen" 
                  tituloModal={`Cambiar imagen de ${juego.titulo}`}
                  esBotonTabla={true}
                  client:load
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
