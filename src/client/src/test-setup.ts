import "@testing-library/jest-dom/vitest";
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Étend les assertions de Vitest (expect) avec les matchers de Jest DOM (comme toBeInTheDocument)
expect.extend(matchers);

// Nettoie le DOM après chaque test pour éviter les fuites de mémoire et les interférences entre tests
afterEach(() => {
  cleanup();
});
