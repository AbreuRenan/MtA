import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocking window.scrollTo as it's not implemented in jsdom
window.scrollTo = vi.fn();

// Mocking Element.prototype.animate for Web Animations API in jsdom
if (!Element.prototype.animate) {
  Element.prototype.animate = vi.fn().mockReturnValue({
    finished: Promise.resolve(),
    cancel: vi.fn(),
    pause: vi.fn(),
    play: vi.fn(),
    reverse: vi.fn(),
    finish: vi.fn(),
  });
}
