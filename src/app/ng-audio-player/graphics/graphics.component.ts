import {
    Component, 
    OnInit, 
    ViewChild, 
    ElementRef, 
    Input
} from '@angular/core';
import {OptionsPlayer} from "../classes/interfaces";

/**
 * Graphics section
 */
@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.scss']
})
export class GraphicsComponent implements OnInit {

  @Input() options:OptionsPlayer;
  @Input() type:string;

  @ViewChild('oscChart') oscChart:ElementRef;
  @ViewChild('freqChart') freqChart:ElementRef;

  displayOsc:boolean;
  displayFreq:boolean;

  constructor() {}

  /**
   * Draw the oscilloscope shape
   *
   * @param timeData:Uint8Array Time Domain Data
   */
  drawOscilloscope(timeData:Uint8Array) {

    let canvas = this.oscChart.nativeElement,
        backgroundColor = this.options.oscFillStyle,
        color = this.options.oscStrokeStyle,
        canvasCtx = canvas.getContext('2d'),
        bufferLength = timeData.length;

    let width = this.options.graphicsWidth;
    let height = this.options.graphicsHeight;
    canvas.width = width;
    canvas.height = height;

    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, width, height);

    canvasCtx.lineWidth = 1.3;
    canvasCtx.strokeStyle = color;

    canvasCtx.beginPath();

    // let sliceWidth = width * 1.0 / bufferLength;
    let sliceWidth = width / bufferLength;
    let v;
    let x = 0;
    let y = 0;

    for (let i = 0; i < bufferLength; i++) {

      v = timeData[i] / 128.0;
      y = v * height / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    canvasCtx.lineTo(width, height / 2);
    canvasCtx.stroke();
  }

  /**
   * Draw the shape of equalizer
   *
   * @param freqData:Float32Array Frequency Domain data
   */
  drawFrequency(freqData:Float32Array) {

    let bars = this.options.freqBars || 32;
    let minDb = 100;
    let dbRange = 80;

    let height = this.options.graphicsHeight;
    let width = this.options.graphicsWidth;

    let canvas = this.freqChart.nativeElement,
        color = this.options.freqStrokeStyle,
        canvasCtx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    let heightBar;
    let heightCoef = height / dbRange;
    let barWidth = (width - bars) / bars;
    let samplerate = freqData.length / bars;
    let y = 0;
    let x = 0;
    let sampleAvg = 0;
    canvasCtx.fillStyle = color;

    for (var i = 1; i <= freqData.length; i++) {
      if ((i % samplerate)) {
        sampleAvg += freqData[i - 1];
        continue;
      }
      sampleAvg += freqData[i - 1];
      sampleAvg /= samplerate;

      heightBar = (minDb + sampleAvg ) * heightCoef;
      y = height - heightBar;

      canvasCtx.fillRect(x, y, barWidth, heightBar);
      x += barWidth + 1;
      sampleAvg = 0;
    }
  }

  /**
   * Clear the graphics section
   */
  clear() {
    this.drawOscilloscope(new Uint8Array(0));
    this.drawFrequency(new Float32Array(0));
  }

  /**
   * Toggle the shape
   */
  toggleGraphics() {
    this.displayFreq = !this.displayFreq;
    this.displayOsc = !this.displayOsc;
  }

  ngOnInit() {
    if (this.type === 'osc') {
      this.displayOsc = true;
      this.displayFreq = false;
    } else {
      this.displayOsc = false;
      this.displayFreq = true;
    }
  }
}
