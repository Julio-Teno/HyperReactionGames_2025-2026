import React from 'react';
import './style.css';

import { useState, useEffect } from 'react';

export default function Menu() {
    const [iniciosesion, setIniciosesion] = useState(false);
    const [nombreusuario, setNombreusuario] = useState('');     

    useEffect(() => {
        fetch('/api/auth/comprobarsesion', {
            method: 'GET',
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                setIniciosesion(Boolean(data?.valid));
                setNombreusuario(data?.username || '');
            })
            .catch(() => {
                setIniciosesion(false);
            });
    }, []);

  return (
    <header>
        <div>
            <img src="/Images/logo.png" alt="Logo" />
            <img className='headerlogotexto' src="/Images/logotexto.png" alt="Logo con texto" />
        </div>
        <nav>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/juegos">Juegos</a></li>
                {!iniciosesion && (
                    <><li><a href="/login">Iniciar Sesion</a></li><li><a href="/register">Registrarse</a></li></>
                )} 
                {iniciosesion && (
                    <><li><a href="/sugerencias">Sugerencias</a></li><li><a href="/perfil">{nombreusuario}</a></li><li><a href="/api/auth/logout">Cerrar Sesion</a></li></>
                )}
            </ul>
        </nav>
    </header>
  );
}
