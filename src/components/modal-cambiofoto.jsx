import './style.css';
import { useState } from 'react';

export default function ModalCambioFoto({ url = '/api/usuario/postperfil', textoBoton = 'Cambiar foto de perfil', tituloModal = 'Cambiar foto de perfil',
    esBotonTabla = false 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [cargando, setCargando] = useState(false);

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

    return (
        <>
            <button className={esBotonTabla ? "btn" : "btn bigbtn"} onClick={() => setIsOpen(true)}>
                {textoBoton}
            </button>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{tituloModal}</h2>
                        <form onSubmit={cambiarDatos} className="modal-form">
                            <input 
                                type="file" 
                                name="foto" 
                                accept="image/png, image/jpeg" 
                                required 
                                className="modal-input-file"
                            />
                            
                            <div className="modal-actions">
                                <button type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setIsOpen(false)}
                                    disabled={cargando}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn" disabled={cargando}>
                                    {cargando ? 'Subiendo...' : 'Subir foto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}