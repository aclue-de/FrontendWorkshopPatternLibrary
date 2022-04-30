import {LitElement, html, css} from 'lit-element';
import * as d3 from 'd3';

export class RadialPicker extends LitElement {
  static get properties() {
    return {
      maximum: { type: Number },
  	  minimum: { type: Number },
      value: { type: Number },
      title: { type: String },
      isOpen: { type: Boolean },
      _currentAngle: { type: Number },
      __lastvalue: { type: Number },
    };
  }

  constructor() {
    super();
    this.maximum = 100;
    this.minimum = 0;
    this.value = 25;
    this.title = 'Items';
    this.isOpen = false;
    this._currentAngle = 0;
    this.__lastvalue = 25;
  }

  static get styles() {
    return css`
        .trp-value-meter .markerForeground {
            fill: #717982;
        }
        .trp-value-meter .background {
            fill: white;
        }
        .trp-value-meter .tumbBackground {
            fill: #800080;
        }
        text {
            font-family: "Roboto", "Noto", "Segoe UI Semibold", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 16px;
            fill: black;
            font-weight: bold;
        }
    }`;
  }
  
  render() {
    return html`
      <div class="content-wrapper">
          <content>
            <svg id="container" width="376" height="276" @mouseup=${this.handleMouseUp}>
              <g id="trp-root" @mousemove=${this.handleMouseMove}>
                <circle id="trp-outercircle" @mouseout=${this.handleMouseOut}
                  style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#f1daea;stroke-width:28;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                  cx="138"
                  cy="138"
                  r="124" />
                <circle id="trp-innercircle"
                  style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#d9add1;stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                  cx="138"
                  cy="138"
                  r="72" />
              </g>
              <g id="trp-tooltip">
                <rect id="trp-valuerect"
                  y="123.33631"
                  x="294.68835"
                  height="29.62327"
                  width="42.623268"
                  style="fill:#ffffff;fill-opacity:1;stroke:#808080;stroke-width:1.91669023;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;visibility=hidden" />
                <text id="trp-valuetext"
                  y="143"
                  x="315"
                  class="text"
                  height="29.62327"
                  width="42.623268"
                  text-anchor="middle"
                  style="visibility=hidden"/>
              </g>
              <g id="trp-backsymbol"
                transform="translate(-67,-58)"
                width="20" height="20"
                @mousedown=${this.handleButtonMouseDown}
                @mouseup=${this.handleButtonMouseUp}
                @mouseover=${this.handleButtonMouseEnter}
                @mouseout=${this.handleButtonMouseOut}>
                <circle id="trp-symbolcircle"
                  r="20"
                  style="fill:#ffffff;fill-opacity:1;stroke:#82397a;stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none"
                  cy="196.14795"
                  cx="205.35718"/>
                <path id="trp-symbolpath"
                  style="fill:#82397a;fill-opacity:1"
                  d="m 202.59227,189.45945 3.05906,0 -5.52983,5.59967 14.64814,0 0,2.17765 -14.64814,0 5.52983,5.59966 -3.05906,0 -5.11802,-5.10191 -1.52951,-1.55547 z" />
              </g>
            </svg>
          </content>
        </div>`;
  }
  
  firstUpdated(changedProperties) {
    var width = 276,
    height = 276,
    twoPi = 2 * Math.PI,
    total = this.maximum,
    current = this.value;

    // define value arc
    var arc = d3.arc()
        .startAngle(0)
        .innerRadius(70)
        .outerRadius(72);

    var element = this.shadowRoot.getElementById("container");

    // select svg element and disable default mouse behavior
    var svg = d3.select(element)
        .on("mousedown", function(e) { e.preventDefault(); });

    // create value layer
    var meter = svg.append("g")
        .attr("id", "trp-valuelayer")
        .attr("class", "trp-value-meter")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // draw value arc
    var angle = Math.max(360,total)/Math.min(360,total)*current;
    var foreground = meter.append("path")
        .attr("id", "trp-valuemarker")
        .attr("class", "markerForeground")
        .style("fill", "#82397a");
    foreground.attr("d", arc.endAngle(twoPi/(360/angle)));

    // draw value line
    var meter = svg.append("g")
        .attr("id", "trp-linelayer")
        .attr("transform", "translate(138,138)");
    meter.append("line")
        .attr("id", "trp-valueline")
        .attr("x1", 0)
        .attr("y1", -20)
        .attr("x2", 0)
        .attr("y2", -72)
        .attr("stroke-width", 2)
        .attr("stroke", "#82397a")
        .attr("transform", "rotate(" + angle + ")")
        .style("visibility", "visible");

    // draw markers
    var angle = 0, value = 0, i = 0;
    
    for	(i = 0; i < 5; i++) {
        this.drawMarkers(meter, value);
        angle += 20;
        value = angle * this.maximum / 100;
    }

    // draw indicator
    var meter = svg.append("g")
        .attr("id", "mouseovertrp-linelayer")
        .attr("transform", "translate(138,138)");
    meter.append("line")
        .attr("id", "mouseOverLine")
        .attr("x1", 0)
        .attr("y1", -20)
        .attr("x2", 0)
        .attr("y2", -72)
        .attr("stroke-width", 1)
        .attr("stroke", "#d9add1")
        .style("visibility", "hidden");
        
    // hide trp-tooltip	
    d3.select(this.shadowRoot.getElementById("trp-valuerect")).style("visibility", "hidden");

    // show / collapse selection area
    this.toggleOpen(!this.isOpen, true);
    this._currentAngle = angle;
  }

  handleMouseOut(){
    this.toggleValueIndicator(false);
  }
  
  toggleValueIndicator(show) {
        d3.select(this.shadowRoot.getElementById("mouseOverLine")).style("visibility", show ? "visible" : "hidden");
        d3.select(this.shadowRoot.getElementById("trp-valuerect")).style("visibility", show ? "visible" : "hidden");
        d3.select(this.shadowRoot.getElementById("trp-valuetext")).style("visibility", show ? "visible" : "hidden");
  }

  toggleButtonState(mouseDown) {
    d3.select(this.shadowRoot.getElementById("trp-symbolpath")).style("fill", mouseDown ? "#ffffff" : "#82397a");
    d3.select(this.shadowRoot.getElementById("trp-symbolcircle")).style("fill", mouseDown ? "#82397a" : "#ffffff");
  }

  toggleOpen(isOpen, init) {
    // expand / collapse selection area
    if (!isOpen) {
        d3.select(this.shadowRoot.getElementById("trp-valuelayer")).transition().duration(650).attr("transform", "translate(138,138) rotate(0) scale(1)").style('opacity', 1);
        d3.select(this.shadowRoot.getElementById("trp-linelayer")).transition().duration(650).attr("transform", "translate(138,138) rotate(0) scale(1)").style('opacity', 1);
        d3.select(this.shadowRoot.getElementById("trp-outercircle")).transition().duration(650).attr("transform", "translate(0,0) scale(1)").style('opacity', 1);
        d3.select(this.shadowRoot.getElementById("trp-innercircle")).transition().duration(650).attr("transform", "translate(0,0) scale(1)").style('opacity', 1);
    }
    else {
        d3.select(this.shadowRoot.getElementById("trp-valuelayer")).transition().duration(init ? 0 : 650).attr("transform", "translate(138,138) rotate(90) scale(0.2)").style('opacity', 0);
        d3.select(this.shadowRoot.getElementById("trp-linelayer")).transition().duration(init ? 0 : 650).attr("transform", "translate(138,138) rotate(90) scale(0.2)").style('opacity', 0);
        d3.select(this.shadowRoot.getElementById("trp-outercircle")).transition().duration(init ? 0 : 650).attr("transform", "translate(110,110) scale(0.2)").style('opacity', 0);
        d3.select(this.shadowRoot.getElementById("trp-innercircle")).transition().duration(init ? 0 : 650).attr("transform", "translate(110,110) scale(0.2)").style('opacity', 0);
        this.toggleValueIndicator(false);
    }
  }
  
  getAngleFromPosition(e) {
    var element = this.shadowRoot.getElementById("container");
    var offsets = element.getBoundingClientRect();
    var ox = offsets.left;
    var oy = offsets.top;
    var x = e.x - ox;
    var y = e.y - oy;
    
    var twoPi = 2 * Math.PI;
    var arc = d3.arc()
        .startAngle(0)
        .innerRadius(70)
        .outerRadius(72);
    var center = 138;
    
    // calc angle
    var angle = -((Math.atan2(center-y, x-center)*(180/Math.PI))-90);
    this.value = Math.round(this.maximum*angle/360);
    
    // check boundaries
    if(angle < 0){
        angle = 360 - (angle*-1);
        if(angle > 358){
            angle = 358;
        }
        this.value = Math.round((this.maximum+1)*angle*100/360/100);
        if (this.value > this.maximum) {
            this.value = this.maximum;
            angle = 360;
        }
    }
    if (this.__lastvalue == this.maximum && this.value < (this.maximum * 80/100))
        return;
    if (this.__lastvalue < (this.maximum * 20/100) && this.value > (this.maximum * 80/100))
        return;
    this.__lastvalue = this.value;
    return angle;
  }
  
  drawMarkers(meter, e) {
    var angle = e * 360 / this.maximum;
    var tumb = meter.append("rect")
        .attr("id", "valuetag"+e)
        .attr("class", "tumbBackground")
        .attr("width", 3)
        .attr("height", 6)
        .attr("x", -1)
        .attr("y", -72)
        .attr("transform", "rotate(" + angle + ")");
    var labelRadius = 90;
    var labelRadian = e*360/this.maximum*Math.PI/180;
    var text = meter.append("text")
        .attr("class", "text")
        .attr("id", "trp-valuetext"+e)
        .attr("text-anchor", "middle")
        .attr("dx", labelRadius * Math.sin(labelRadian))
        .attr("dy", ((labelRadius * Math.cos(labelRadian)) * -1))
        .attr("transform", "translate(0,2)");
        text.text(e);
  }

  handleButtonMouseEnter(e) {
    if (this.isOpen) {
        this.toggleValueIndicator(false);
    }
    d3.select(this.shadowRoot.getElementById("trp-symbolcircle")).style("fill", "#f5f5f5");
  }
  
  handleButtonMouseOut(e) {
    this.toggleButtonState(false);
  }

  handleButtonMouseDown(e) {
    this.toggleButtonState(true);
  }
  
  handleButtonMouseUp(e) {
    this.toggleButtonState(false);
    this.toggleOpen(this.isOpen, false);
    this.isOpen = !this.isOpen;
    this.handleButtonMouseEnter();
  }
  
  handleMouseMove(e) {
    if (!this.isOpen) {
      return;
    }
    
    // get the angle from current position
    this._currentAngle  = this.getAngleFromPosition(e);
    
    // rotate line
    var line = d3.select(this.shadowRoot.getElementById("mouseOverLine"))
        .attr("transform", "rotate(" + this._currentAngle + ")");
    
    // change text
    d3.select(this.shadowRoot.getElementById("trp-valuetext")).text(this.value);
    this.toggleValueIndicator(true);

    this.requestUpdate();
  }
  
  handleMouseUp(e) {
    if (!this.isOpen || (e.target.id != "mouseOverLine" && e.target.id != "trp-outercircle")) {
      return;
    }
    
    var arc = d3.arc()
        .startAngle(0)
        .innerRadius(70)
        .outerRadius(72);

    // // get the angle from current position
    this._currentAngle = this.getAngleFromPosition(e);
    
    // change value meter
    var meter = d3.select(this.shadowRoot.getElementById("trp-valuemarker"));
    meter.attr("d", arc.endAngle(Math.PI*2/360*this._currentAngle));
    
    // rotate line
    d3.select(this.shadowRoot.getElementById("trp-valueline"))
        .attr("transform", "rotate(" + this._currentAngle + ")")
        .style("visibility", "visible");
  }
}
