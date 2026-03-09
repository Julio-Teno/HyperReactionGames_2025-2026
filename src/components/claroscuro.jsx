import { useState, useEffect } from 'react';
import './style.css';


export default function Claroscuro() {
  const [modoscuro, setIsDarkMode] = useState(false);

  const [textoboton, setTextoboton] = useState(modoscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro");

  const cambiartema = () => {
    const nuevomodo = !modoscuro;
    setIsDarkMode(nuevomodo);
    setTextoboton(nuevomodo ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  };

  // Use useEffect to handle DOM manipulation after component mounts
  useEffect(() => {
    const boton = document.querySelector('.botonclaroscuro');   


    // Check if we're in the browser (client-side)
    if (typeof document !== 'undefined') {
      if (modoscuro) {
        document.body.classList.add('modoscuro');
      } else {
        document.body.classList.remove('modoscuro');
      }
    }
  }, [modoscuro]); //Effect runs when modoscuro changes

  return (
    <button className="btn botonclaroscuro" onClick={cambiartema}>
      {textoboton} 
    </button>
  );
}
