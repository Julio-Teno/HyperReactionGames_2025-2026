import React, { use } from 'react';
import '../style.css';
import { useState, useEffect } from 'react';
import { set } from 'astro:schema';

export default function Contenedorvaloracionjuego({id_juego}) {

//const [valoracion, setValoracion] = useState(null); // null, 'like', 'dislike'
const [promedio, setPromedio] = useState(0);
const [valoradolike, setValoradolike] = useState(false);
const [valoradodislike, setValoradodislike] = useState(false);
const [enProceso, setEnProceso] = useState(false);
let url = '';

useEffect(() => {

  fetchValoracion();

}, [id_juego]);

const fetchValoracion = async () => {
    url = `/api/valoraciones/getvaloracionjuego?id_juego=${id_juego}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {  'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setPromedio(data.promedio);
        setValoradolike(data.valoracion_usuario === 'like');
        setValoradodislike(data.valoracion_usuario === 'dislike');
      }
    } catch (error) {
      console.error('Error fetching valoracion:', error);
    } 
  };

    
    const fetchvalorar = async (valor) => {
      if (enProceso) return; 
      setEnProceso(true);
      url = `/api/valoraciones/postvaloracion?id_juego=${id_juego}`;
       try { 
            const response = await fetch(url, { 
                method: "POST", 
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: JSON.stringify({ id_juego, valor }) 
            }); 
 
            if (response.ok) { 
                if (valor === 'like') {
                    setValoradolike(true);
                    setValoradodislike(false);
                } else {
                    setValoradodislike(true);
                    setValoradolike(false);
                }
                await fetchValoracion();
            } 
 
        } catch (error) { 
            console.error('Error al enviar la valoración:', error);
        } finally {
            setEnProceso(false);
        }
    } 


  return (
          <div className='containerjuegos-section-columna containerjuegos-section-columna2'>
            <h2>Valoraciones</h2>
            <div className='containerjuegos-sectioncontenido'>
              <button disabled={enProceso} className={`btn btnvaloracion ${valoradolike ? 'btnvalorado' : 'btnnovalorado'}`} onClick={() => fetchvalorar('like')}>Me gusta</button>
              <button disabled={enProceso} className={`btn btnvaloracion ${valoradodislike ? 'btnvalorado' : 'btnnovalorado'}`} onClick={() => fetchvalorar('dislike')}>No me gusta</button>
            </div>
            <label>Valoración: {promedio}%</label>
            <meter value={promedio} min="0" max="100" low="30" high="70" optimum="100">{promedio + '%'}</meter>
            <h3>Vota, vota... que salten las chispas</h3>
          </div>
  );
}