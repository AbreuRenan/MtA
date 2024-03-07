const handleMouseMove = (e) => {
    cursorPosition.style.setProperty('--x', e.clientX + 'px');
    cursorPosition.style.setProperty('--y', e.clientY + 'px');
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (touch) {
      cursorPosition.style.setProperty('--x', touch.clientX + 'px');
      cursorPosition.style.setProperty('--y', touch.clientY + 'px');
    }
  };

  cursorPosition.addEventListener('mousemove', handleMouseMove);
  cursorPosition.addEventListener('touchmove', handleTouchMove);

  // Função de limpeza para remover os event listeners quando o componente for desmontado
  return () => {
    cursorPosition.removeEventListener('mousemove', handleMouseMove);
    cursorPosition.removeEventListener('touchmove', handleTouchMove);
  };