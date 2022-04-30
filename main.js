import './style.css'
import './src/components/NumberPad'
import './src/components/RadialPicker'
import './src/components/TouchSpinner'

document.querySelector('#app').innerHTML = `
  <div style="paddding: 32px; display: flex; align-content: center; gap: 32px;">
    <number-pad minimum="0" maximum="10" value="1" title="Elemente"></number-pad>
    <radial-picker></radial-picker>
    <touch-spinner minimum="0" maximum="50" value="10" title="Elemente"></touch-spinner>
  </div>
`
