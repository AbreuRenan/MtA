const cursorPosition = document.documentElement;
cursorPosition.addEventListener('mousemove', (handleMouseMove))


function handleMouseMove(e) {
    cursorPosition.style.setProperty('--x', e.clientX + 'px')
    cursorPosition.style.setProperty('--y', e.clientY + 'px')
}