import { NumberPad } from './NumberPad';

if (!customElements.get('number-pad')) {
  window.customElements.define('number-pad', NumberPad); 
}
