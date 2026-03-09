import React from 'react';
import './style.css';

export default function Menu() {
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
                <li><a href="/contacto">Contacto</a></li>
                <li><a href="/login">Iniciar Sesion</a></li>
            </ul>
        </nav>
    </header>
  );
}
