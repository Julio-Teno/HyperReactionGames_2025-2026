import { set } from 'astro:schema';
import './style.css';
import { useState, useEffect } from 'react';

export default function ModalCambioDatos({ url = '', id_juego }) {
    const [isOpen, setIsOpen] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [juego, setJuego] = useState({}); 

    

    const cambiarDatos = async (e) => {
        e.preventDefault();
        setCargando(true);

        const formData = new FormData(e.target);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                setIsOpen(false);
                window.location.reload(); 
            } else {
                const data = await response.json();
                alert('Error al subir la imagen: ' + (data.error || 'Desconocido'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Fallo al conectar con el servidor.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (!isOpen || !id_juego) return;
        
        const fetchJuego = async () => {
            try {
                const response = await fetch(`/api/juegos/getjuegosid/${id_juego}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del juego');
                }
                
                const data = await response.json();
                setJuego(data[0] || {});
            } catch (error) {
                console.error('Error fetching juego:', error);
            }
        };

        fetchJuego();
    }, [id_juego, isOpen]);

    return (
        <>
            <button className={"btn"} onClick={() => setIsOpen(true)}>
                Editar
            </button>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editar datos</h2>
                        <form onSubmit={cambiarDatos} className="modal-form">
                            <input type='text' name='titulo' placeholder='Nuevo titulo' className="modal-input" required defaultValue={juego.titulo || ''} />
                            <textarea name='descripcion' placeholder='Nueva descripcion' className="modal-textarea" required defaultValue={juego.descripcion || ''} ></textarea>
                            <select name='categoria' className="modal-select" required defaultValue={juego.categoria || ''}>
                                <option value="">Selecciona una categoria</option>
                                <option value="Accion">Acción</option>
                                <option value="Plataformas">Plataformas</option>
                                <option value="Otro">Otro</option>
                            </select>

                            
                            <div className="modal-actions">
                                <button type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setIsOpen(false)}
                                    disabled={cargando}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn" disabled={cargando}>
                                    {cargando ? 'Cambiando...' : 'Cambiar datos'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}