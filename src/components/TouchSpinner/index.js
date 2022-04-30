import { Spinner } from './TouchSpinner';

if (!customElements.get('touch-spinner')) {
  window.customElements.define('touch-spinner', Spinner); 
}
