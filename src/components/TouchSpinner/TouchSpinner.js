import {LitElement, html, css} from 'lit-element';
import * as d3 from 'd3';

export class Spinner extends LitElement {
  static get properties() {
    return {
      maximum: { type: Number },
  	  minimum: { type: Number },
      value: { type: Number },
      title: { type: String },
      _currentAngle: { type: Number },
    };
  }

  constructor() {
    super();
    this.maximum = 100;
    this.minimum = 0;
    this.value = 25;
    this.title = 'Items';
  }

  static get styles() {
    return css`
        .markerBackground {
            fill: #BFC5CC;
        }
        .markerForeground {
            fill: #717982;
        }
        .background {
            fill: white;
        }
        .centerbackground {
            fill: #fff;
        }
        .tumbBackground {
            fill: #800080;
        }
        .value-meter text {
            font-family: "Roboto", "Noto", "Segoe UI Semibold", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 28px;
            fill: #800080;
            font-weight: bold;
        }
        .value-meter .subtext {
            font-family: "Roboto", "Noto", "Segoe UI Semibold", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 16px;
            fill: #800080;
            font-weight: bold;
        }`;
  }
  
  render() {
    return html`
	<div class="content-wrapper">
		<content>
            <div id="spinnerElement" @mousemove=${this.handleTrack}>
            </div>
		</content>
	</div>`;
  }
  
  firstUpdated(changedProperties) {
    var width = 200,
    height = 200,
    twoPi = 2 * Math.PI,
    total = this.maximum,
    current = this.value;
    
    // outer circle
    var arc = d3.arc()
        .startAngle(0)
        .innerRadius(70)
        .outerRadius(58);
    
    var element = this.shadowRoot.getElementById("spinnerElement");
    var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .on("mousedown", function() { d3.event.preventDefault(); });
    
    var meter = svg.append("g")
        .attr("id", "outercircle")
        .attr("class", "value-meter");
    
    meter.append("path")
        .attr("class", "markerBackground")
        .attr("d", arc.endAngle(twoPi));
    
    // value marker
    var angle = (current * 100 / total) * 360 / 100;
    var foreground = meter.append("path")
        .attr("id", "valueMarker")
        .attr("class", "markerForeground")
        .attr("d", arc.endAngle(twoPi / (360/angle)));

    // value tumb
    var tumb = meter.append("rect")
        .attr("id", "tumb")
        .attr("class", "tumbBackground")
        .attr("width", 18)
        .attr("height", 30)
        .attr("x", -9)
        .attr("y", -85)
        .attr("transform", "rotate(" + angle + ")")
    
    // inner circle
    var innerArc = d3.arc()
        .startAngle(0)
        .innerRadius(0)
        .outerRadius(58);

    meter.append("path")
        .attr("class", "background")
        .attr("fill", "white")
        .attr("d", innerArc.endAngle(twoPi));

    // center circle
    var arc2 = d3.arc()
        .startAngle(0)
        .innerRadius(0)
        .outerRadius(40);

    meter.append("path")
        .attr("class", "centerbackground")
        .attr("fill", "white")
        .attr("d", arc2.endAngle(twoPi));

    // center text
    var text = meter.append("text")
        .attr("id", "valuetext")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.2em")
        .on("mousedown", function() { d3.event.preventDefault(); });
    text.text(current);

    // subtext
    var subtext = meter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.4em")
        .attr("class", "subtext")
        .on("mousedown", function() { d3.event.preventDefault(); });
    subtext.text(this.title);
    this._currentAngle = angle;
  }
  
  updated(changedProperties) {
    var arc = d3.arc()
        .startAngle(0)
        .innerRadius(70)
        .outerRadius(58);

    // change value meter
    var meter = d3.select(this.shadowRoot.getElementById("valueMarker"));
    meter.attr("d", arc.endAngle( ( (Math.PI*2)/360 ) * this._currentAngle ));

    // move tumb
    d3.select(this.shadowRoot.getElementById("tumb"))
        .attr("transform", "rotate(" + this._currentAngle + ")");
    
    // change text
    var text = d3.select(this.shadowRoot.getElementById("valuetext"));
    text.text(this.value);
  }
  
  handleTrack(e) {
      if (e.which == 1) {
        var offsets = this.shadowRoot.getElementById('spinnerElement').getBoundingClientRect();
        var ox = offsets.left;
        var oy = offsets.top;
        var x = e.x - ox;
        var y = e.y - oy;
        
        // calc angle
        var angle = ((Math.atan2(100-y, x-100) * (180 / Math.PI)) - 90) * -1;
        this.value = Math.round( ((this.maximum+3) * ((angle)*100/360) / 100)+0);
        
        // check boundaries
        if(angle < 0){
            angle = 360 - (angle*-1);
            if(angle > 358){
                angle = 358;
            }
            this.value = Math.round( (this.maximum+3) * (angle*100/360) / 100);
            if (this.value > this.maximum) {
                this.value = this.maximum;
                angle = 360;
            }
        }
        this._currentAngle = angle;
    }
  }
}
