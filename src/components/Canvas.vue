<template>
  <div class="canvas">
    <canvas id="canvas-canvas" width="800px" height="600px"></canvas>
    <div class="canvas-controls">
      <button id="load" @click.stop.prevent="load">Load</button>
      <button id="save" @click.stop.prevent="save">Save</button>
      <button id="clear" @click.stop.prevent="clear">Clear</button>
      <button id="saveFile" @click.stop.prevent="saveFile">Save File</button>
      <button id="loadFile" @click.stop.prevent="clickLoadFile">Load File</button>
      <a id="hidden-download" tabindex="-1"></a>
      <input id="hidden-upload" type="file" />
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

export default {
  name: 'canvas',
  data() {
    return {
      canvas: null,
      ctx: null,
      file: null,
      isActive: false,
      plots: [],
      data: null,
      reader: null,
    };
  },
  props: {
    image: {
      type: Object,
    },
    selectedColor: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.init();
    if (this.image) {
      this.load(null, this.image);
    }
  },
  methods: {
    init() {
      this.data = {
        id: this.id(),
        canvasData: null,
        lines: [],
      };

      if (window.File && window.FileReader && window.FileList && window.Blob) {
          this.reader = new FileReader();
      } else {
          alert('The File APIs are not fully supported by your browser. Fallback required.');
      }

      const upload = document.querySelector('#hidden-upload');
      upload.onchange = this.loadFile;

      this.canvas = document.getElementById('canvas-canvas');
      this.ctx = this.canvas.getContext('2d');

      this.canvas.addEventListener('mousedown', this.startDraw, false);
      this.canvas.addEventListener('mousemove', this.draw, false);
      this.canvas.addEventListener('mouseup', this.endDraw, false);

      window.addEventListener('resize', this.resizeCanvas, false);
      this.resizeCanvas();
    },
    resizeCanvas() {
      const canvasEl = document.querySelector('.canvas');
      this.canvas.width = canvasEl.clientWidth;
      this.canvas.height = canvasEl.clientHeight;

      this.load(null, this.image);
    },
    startDraw() {
      this.isActive = true;
    },
    draw(ev) {
      if(!this.isActive) return;

      // cross-browser canvas coordinates
      const x = ev.offsetX || ev.layerX - this.canvas.offsetLeft;
      const y = ev.offsetY || ev.layerY - this.canvas.offsetTop;

      this.plots.push({x: x, y: y});

      this.drawOnCanvas(this.selectedColor);
    },
    endDraw() {
      this.isActive = false;
      this.saveDraw();
      this.plots = [];
    },
    drawOnCanvas(color) {
      const plots = cloneDeep(this.plots);
      this.ctx.beginPath();

      this.ctx.moveTo(plots[0].x, plots[0].y);

      for (let plot of plots) {
        this.ctx.lineTo(plot.x, plot.y);
      }
      
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1;

      this.ctx.stroke();
    },
    load(ev, file) {
      this.clearCanvas();

      let localData = JSON.parse(localStorage.getItem('canvas'));
      if (file) {
        localData = file;
      }

      this.data = localData;

      for (let line of this.data.lines) {
        this.plots = line.plots;
        this.drawOnCanvas(line.color);
        this.$emit('colorchange', line.color);
      }
      this.save();
    },
    loadFile() {
      const upload = document.querySelector('#hidden-upload');
      let output;
        if (upload.files && upload.files[0]) {           
            this.reader.onload = (e) => {
                output = e.target.result;
                this.load(null, JSON.parse(output));
                upload.value = '';
            };
            this.reader.readAsText(upload.files[0]);
        }
    },
    clickLoadFile() {
      const upload = document.querySelector('#hidden-upload');
      upload.click();
    },
    saveDraw() {
      for (let plot of this.plots) {
        plot.id = this.id();
      }

      this.data.canvasData = this.canvas.toDataURL();
      this.data.lines.push({ color: this.selectedColor, plots: this.plots });
      console.log(this.data);
    },
    save() {
      localStorage.setItem('canvas', JSON.stringify(this.data));
    },
    saveFile() {
      const a = document.querySelector('#hidden-download');
      const data = JSON.stringify(this.data);
      const file = new Blob([data], {type: 'application/json'});
      a.href = URL.createObjectURL(file);
      a.download = 'drawing1.json';
      a.click();
    },
    clear() {
      this.data = {
        canvasData: null,
        lines: [],
      };
      this.clearCanvas();
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    id() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }
  },
};
</script>

<style lang="scss">
.canvas {
  width: 100%;
  height: 100%;

  .canvas-controls {
    position: absolute;
    right: 15px;
    bottom: 15px;

    button {
      border-radius: 4px;
      padding: 7px 14px;
      border: none;
      background-color: #fff;
      color: #fff;
      margin: 0 5px;

      &:hover {
        cursor: pointer;
      }

      &#clear {
        border: 1px solid #e74c3c;
        color: #e74c3c;

        &:hover {
          border: 1px solid #c0392b;
          color: #c0392b;
        }
      }

      &#load {
        background-color: #3498db;
        color: #fff;

        &:hover {
          background-color: #2980b9;
        }
      }

      &#loadFile {
        border: 1px solid #2980b9;
        color: #2980b9;

        &:hover {
          border: 1px solid #2980b9;
          color: #2980b9;
        }
      }

      &#save {
        border: 1px solid #3498db;
        color: #3498db;

        &:hover {
          border: 1px solid #2980b9;
          color: #2980b9;
        }
      }

      &#saveFile {
        border: 1px solid #95a5a6;
        color: #95a5a6;

        &:hover {
          border: 1px solid #95a5a6;
          color: #95a5a6;
        }
      }
    }

    
    #hidden-download,
    #hidden-upload {
      visibility: hidden;
      position: absolute;
      left: -5000px;
      width: 0;
      height: 0;
    }
  }
}
</style>
