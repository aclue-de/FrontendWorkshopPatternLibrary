import {LitElement, html, css} from 'lit-element';

export class NumberPad extends LitElement {
	static get properties() {
		return {
			maximum: { type: Number },
			minimum: { type: Number },
			value: { type: Number },
			title: { type: String },
		};
	  }
	
	  static get styles() {
		return css`
			::selection {
				background: none;
			}
			::-moz-selection {
				background: none;
			}
			text {
				pointer-events: none;
			}
		`;
	  }
	  
	  constructor() {
		super();
		this.maximum = 100;
		this.minimum = 0;
		this.value = 25;
		this.title = 'Items';
	  }
	
	  render() {
		return html`
			<div class="content-wrapper">
				<content>
					<svg width="210" height="210">
					<g>
						<circle
						style="fill:#bfc5cc;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:10px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
						id="path4142-7"
						cx="80"
						cy="80"
						r="80"></g>
						<path
						style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:#ffffff;stroke-width:0px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
						type="arc"
						cx="80"
						cy="80"
						rx="65"
						ry="65"
						start="2.7246043"
						end="0.40454034"
						d="M 20.569666,106.32557 A 65,65 0 0 1 39.802001,28.920446 65,65 0 0 1 119.55906,28.424031 65,65 0 0 1 139.75342,105.58376"
						open="true"></path>
						<g id="plusArea"
						@mouseover=${this.mouseOver}
						@mouseout=${this.mouseOut}
						@mousedown=${this.mouseDown}
						@mouseup=${this.mouseUp}>
					<path id="plusPad"
							d="M 80.278437,159.9113 A 80,80 0 0 1 4.08031,105.12447 l 76.198127,0 z"
							style="fill:#bfc5cc;fill-opacity:1" />
						<path id="path4156-1"
							d="m 79,104 0,57"
							style="fill:none;fill-rule:evenodd;stroke:#ffffff;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
						<g id="plus-sign">
							<rect style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#ffffff;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
							width="21.338621"
							height="4"
							x="44.156067"
							y="124.99451" />
							<path style="fill:none;fill-rule:evenodd;stroke:#ffffff;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
							d="m 54.825375,136.3622 0,-19.68787"></path>
						</g>
						</g>
						<g id="minusArea"
						@mouseover=${this.mouseOver}
						@mouseout=${this.mouseOut}
						@mousedown=${this.mouseDown}
						@mouseup=${this.mouseUp}>
						
						<path id="minusPad"
							d="m 80.120938,159.9113 a 80,80 0 0 0 76.198122,-54.78683 l -76.198122,0 z"
							style="fill:#bfc5cc;fill-opacity:1"/>
						
						<rect id="minus-sign"
							y="124.99451"
							x="95.505318"
							height="4"
							width="21.338621"
							style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#ffffff;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"></rect>
						</g>
						<text id="titleLabel"
						xml:space="preserve"
						style="font-style:normal;font-weight:bold;font-size:28px;line-height:125%;font-family:Roboto, Noto, 'Segoe UI Semibold', 'Helvetica Neue', Helvetica, Arial, sans-serif;letter-spacing:0px;word-spacing:0px;fill:#800080;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
						x="80"
						y="66.362206"
						text-anchor="middle">${this.value}</text>
						<text id="subText"
						xml:space="preserve"
						style="font-style:normal;font-weight:bold;font-size:16px;line-height:125%;font-family:Roboto, Noto, 'Segoe UI Semibold', 'Helvetica Neue', Helvetica, Arial, sans-serif;letter-spacing:0px;word-spacing:0px;fill:#800080;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
						x="80"
						y="88.362206"
						text-anchor="middle">${this.title}</text>
					</g>
					</svg>
				</content>
			</div>
		`;
	  }
	
	  mouseOver(args) {
			this.getTarget(args).setAttribute("style", "fill:#800080;fill-opacity:0.5");
		  }
		  
	  mouseOut(args) {
	  this.getTarget(args).setAttribute("style", "fill:#bfc5cc;fill-opacity:1");
	  }
	  
	  mouseDown(args) {
		this.getTarget(args).setAttribute("style", "fill:#800080;fill-opacity:1");
		this.isMouseDown = true;
		this.updateValue(args.currentTarget);
	  }
	  
	  updateValue(target) {
		if (!this.isMouseDown) return;
		
		if (this.isIncrement(target) && this.value < this.maximum) {
		  this.value++;
		}
		else if (!this.isIncrement(target) && this.value > this.minimum) {
		  this.value--;
		}
		
		setTimeout(() => this.updateValue(target), 200);
	  }
	  
	  mouseUp(args) {
		this.getTarget(args).setAttribute("style", "fill:#800080;fill-opacity:0.5");
		this.isMouseDown = false;
	  }
	  
	  isIncrement(target) {
		return target.getAttribute("id") == "plusArea";
	  }
	  
	  getTarget(args) {
		return this.isIncrement(args.currentTarget) ?
			this.shadowRoot.getElementById('plusPad') :
			this.shadowRoot.getElementById('minusPad');
	  }
	}
