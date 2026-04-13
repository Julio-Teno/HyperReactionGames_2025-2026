import React from 'react';
import '../style.css';
import { useState, useEffect, useRef } from 'react';

export default function Sliderjuegos({ url }) {
  const [juegos, setJuegos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSlides = juegos.length + 1;
  const porcentajeSlide = 100 / totalSlides;

  
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
  }, [url]);

  // INICIALIZA slider y textos cuando llegan juegos
  useEffect(() => {
    if (!sliderRef.current || juegos.length === 0) return;

    const slider = sliderRef.current;
    slider.style.setProperty('--slides-total', juegos.length + 1);
    slider.classList.add('slider-elements-no-transition');
    slider.style.transform = 'translateX(0%)';
    slider.offsetHeight;
    slider.classList.remove('slider-elements-no-transition');

    setCurrentIndex(0);
    cambiartextos(0);
    cambiarfondo(0);
  }, [juegos]);

  
  function cambiarfondo(indexJuego) {
    const categoria = juegos[indexJuego]?.categoria;
    const section = document.getElementById('slidercont');

    if (!section) return;

    section.classList.remove(
      'fondo-accion',
      'fondo-plataformas',
      'fondo-otros'
    );

    if (!categoria) return;

    switch (categoria.toLowerCase()) {
      case 'accion':
        section.classList.add('fondo-accion');
        break;
      case 'plataformas':
        section.classList.add('fondo-plataformas');
        break;
      case 'otro':
        section.classList.add('fondo-otros');
        break;
      default:
        break;
    }
  }

  function cambiartextos(indexJuego) {
    const juego = juegos[indexJuego];
    if (!juego) return;

    document.getElementById('slider-titulo').textContent =
      juego.titulo || '';
    document.getElementById('slider-descripcion').textContent =
      juego.descripcion || '';
    document.getElementById('slider-categoria').textContent =
      juego.categoria || '';

    const link = document.getElementById('slider-link');
    if (link) link.href = juego.link || '#';
  }

  function bloquearMovimiento(slider, onComplete) {
    setIsTransitioning(true);

    let timeoutId = null;
    const liberar = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      setIsTransitioning(false);
    };

    const onTransitionEnd = (event) => {
      if (event.propertyName !== 'transform') return;
      slider.removeEventListener('transitionend', onTransitionEnd);
      if (onComplete) onComplete();
      liberar();
    };

    slider.addEventListener('transitionend', onTransitionEnd);

    // Fallback por si transitionend no se dispara.
    timeoutId = setTimeout(() => {
      slider.removeEventListener('transitionend', onTransitionEnd);
      if (onComplete) onComplete();
      liberar();
    }, 1700);
  }

  // AUTOPLAY
  useEffect(() => {
    if (juegos.length <= 1 || !sliderRef.current) return;

    const interval = setInterval(() => {
        if (isTransitioning) return;
      setCurrentIndex((prev) => {
        let newIndex = prev + 1;
        const slider = sliderRef.current;
        if (!slider) return prev;

        slider.classList.remove('slider-elements-no-transition');
        slider.style.transform = `translateX(-${newIndex * porcentajeSlide}%)`;

        const realIndex = newIndex === juegos.length ? 0 : newIndex;

        cambiartextos(realIndex);
        cambiarfondo(realIndex);

        // LOOP INFINITO
        if (newIndex === juegos.length) {
          bloquearMovimiento(slider, () => {
            slider.classList.add('slider-elements-no-transition');
            slider.style.transform = 'translateX(0%)';

            slider.offsetHeight; // reflow
            slider.classList.remove('slider-elements-no-transition');
          });

          return 0;
        }

        bloquearMovimiento(slider);

        return newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [juegos, porcentajeSlide]);

  // BOTONES
  function siguiente() {
    if (!sliderRef.current) return;
    if (isTransitioning) return;

    setCurrentIndex((prev) => {
      let newIndex = prev + 1;
      if (newIndex > juegos.length) return prev;

      const slider = sliderRef.current;
      slider.classList.remove('slider-elements-no-transition');
      slider.style.transform = `translateX(-${newIndex * porcentajeSlide}%)`;

      const realIndex = newIndex === juegos.length ? 0 : newIndex;

      cambiartextos(realIndex);
      cambiarfondo(realIndex);

      // Si llega al clon, vuelve al inicio para no quedarse bloqueado.
      if (newIndex === juegos.length) {
        bloquearMovimiento(slider, () => {
          slider.classList.add('slider-elements-no-transition');
          slider.style.transform = 'translateX(0%)';
          slider.offsetHeight;
          slider.classList.remove('slider-elements-no-transition');
          setCurrentIndex(0);
        });

        return 0;
      }

      bloquearMovimiento(slider);

      return newIndex;
    });
  }

  function anterior() {
    if (!sliderRef.current) return;
    if (isTransitioning) return;

    setCurrentIndex((prev) => {
      let newIndex = prev - 1;
      if (newIndex < 0) {
        newIndex = juegos.length - 1;
      }

      const slider = sliderRef.current;
      slider.classList.remove('slider-elements-no-transition');
      slider.style.transform = `translateX(-${newIndex * porcentajeSlide}%)`;

      cambiartextos(newIndex);
      cambiarfondo(newIndex);
      bloquearMovimiento(slider);

      return newIndex;
    });
  }

  return (
    <div className='slider'>
      <div className='slider-fondo' id='slidercont'>
        <h2 id='sliderh2'>Juegos destacados</h2>

        <button className='slider-btn slider-btn-1' onClick={anterior}>&lt;</button>
        <button className='slider-btn slider-btn-2' onClick={siguiente}>&gt;</button>

        <ul className='slider-elements' ref={sliderRef}>
          {juegos.map((juego, index) => (
            <li key={index}>
              <a href={juego.link}>
                <picture>
                    <source srcSet={juego.imagen} type="image/png" />
                    <source srcSet={juego.imagen} type="image/webp" />
                    <img src={juego.imagen} alt={juego.titulo} className='slider-image'/>
                </picture>
              </a>
            </li>
          ))}
            
            {juegos.length > 0 && (
            <li>
                <picture>
                    <source srcSet={juegos[0].imagen} type="image/png" />
                    <source srcSet={juegos[0].imagen} type="image/webp" />
                    <img src={juegos[0].imagen} alt={juegos[0].titulo} className='slider-image'/>
                </picture>
            </li>
          )}
        </ul>

        <div className='slider-textos'>
          <h2 id='slider-titulo'></h2>
          <div className='slider-textos-container'>
            <h3>Descripcion</h3>
            <p id='slider-descripcion'></p>

            <h3>Categoria</h3>
            <p id='slider-categoria'></p>

            <a id='slider-link' className='btn bigbtn'>Jugar ahora</a>
          </div>
        </div>
      </div>
    </div>
  );
}