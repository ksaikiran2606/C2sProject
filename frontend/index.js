import { registerRootComponent } from 'expo';
import App from './App';

// Suppress harmless Expo WebSocket errors in browser
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    if (
      message.includes('WebSocket connection to') &&
      message.includes('_expo/ws') &&
      (message.includes('ERR_CONNECTION_REFUSED') || message.includes('failed'))
    ) {
      // Silently ignore Expo dev server WebSocket errors - they're harmless
      return;
    }
    originalError.apply(console, args);
  };
}

registerRootComponent(App);

