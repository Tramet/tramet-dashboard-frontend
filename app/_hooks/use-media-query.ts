import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar media queries
 * @param query La consulta de media query a evaluar (ej: "(min-width: 768px)")
 * @returns Un booleano que indica si la media query coincide actualmente
 */
export function useMediaQuery(query: string): boolean {
  // Valor predeterminado basado en SSR
  const getMatches = (query: string): boolean => {
    // En el lado del servidor, siempre devuelve false para evitar errores de hidratación
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  // Efecto para actualizar el estado cuando cambia la media query
  useEffect(() => {
    // Evitar ejecución en el servidor
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia(query);

    // Actualizar el estado inicial
    setMatches(mediaQuery.matches);

    // Crear un listener para actualizar el estado cuando cambia
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Añadir el listener
    mediaQuery.addEventListener('change', handler);

    // Limpiar listener al desmontar
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export default useMediaQuery;
