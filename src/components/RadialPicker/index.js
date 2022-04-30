import { RadialPicker } from './RadialPicker';

if (!customElements.get('radial-picker')) {
  window.customElements.define('radial-picker', RadialPicker); 
}
