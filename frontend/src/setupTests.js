import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { mockMatchMedia, mockResizeObserver } from './testUtils/setupMocks';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

mockMatchMedia();
mockResizeObserver();
