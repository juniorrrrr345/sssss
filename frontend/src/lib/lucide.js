import React from 'react';

/**
 * Crée une icône Lucide React
 * @param {string} name - Nom de l'icône
 * @param {Array} elements - Éléments SVG de l'icône
 * @returns {React.Component} Composant d'icône
 */
export const createLucideIcon = (name, elements) => {
  const IconComponent = React.forwardRef(({ className, size = 24, ...props }, ref) => {
    return React.createElement(
      'svg',
      {
        ref,
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: className,
        ...props
      },
      elements.map((element, index) => 
        React.createElement(element[0], { key: index, ...element[1] })
      )
    );
  });

  IconComponent.displayName = name;
  return IconComponent;
};
