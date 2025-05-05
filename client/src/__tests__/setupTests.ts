import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder and TextDecoder which are required by react-router
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Silence React 19 act() warnings
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};