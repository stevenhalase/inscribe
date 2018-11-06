<template>
  <div class="color-picker-container">
    <div @click="expand" class="color-picker" :class="{ expanded, invalid }" :style="{ backgroundColor: localSelectedColor }">
      <div v-if="expanded" class="color-picker-content">
        <div class="color-picker-content-item">
          <div class="color-picker-label">RGB</div>
          <input type="text" class="color-picker-input" v-model="rgbColor" />
        </div>
        <div class="color-picker-content-item">
          <div class="color-picker-label">Hex</div>
          <input type="text" class="color-picker-input" v-model="localSelectedColor" />
        </div>
      </div>
      <div class="color-picker-color">{{ localSelectedColor }}</div>
    </div>
    <div v-if="expanded" @click="close" class="color-picker-backdrop"></div>
  </div>
</template>

<script>
export default {
  name: 'color-picker',
  data() {
    return {
      localSelectedColor: '#7f8c8d',
      rgbParts: this.hexToRgb('#7f8c8d'),
      rgbColor: Object.values(this.hexToRgb('#7f8c8d')).join(','),
      expanded: false,
      invalid: false,
    };
  },
  props: {
    selectedColor: {
      type: String,
      required: true,
    },
  },
  methods: {
    expand() {
      this.expanded = true;
    },
    close() {
      this.expanded = false;
    },
    valid(color) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
    },
    isValidRGB(r, g, b, a) {
      a = a || 0;
      if(typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number' || typeof a !== 'number') return false;

      var regex = /\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b/;
      if (
        regex.test(r) &&
        regex.test(g) &&
        regex.test(b) &&
        a >= 0 && a <= 1
      ) return true;

      return false;
    },
    hexToRgb(hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
  },
  watch: {
    selectedColor(newColor) {
      this.localSelectedColor = newColor;
      this.rgbParts = this.hexToRgb(newColor);
      this.rgbColor = Object.values(this.hexToRgb(newColor)).join(',');
    },
    localSelectedColor(newColor) {
      if (this.valid(newColor)) {
        this.invalid = false;
        this.$emit('colorchange', newColor);
      } else {
        this.invalid = true;
      }
    },
    rgbColor(newColor) {
      const newColorRGBParts = newColor.replace(' ', '').split(',');
      const newColorRGB = {
        r: parseInt(newColorRGBParts[0]),
        g: parseInt(newColorRGBParts[1]),
        b: parseInt(newColorRGBParts[2]),
      };
      if (this.isValidRGB(newColorRGB.r, newColorRGB.g, newColorRGB.b)) {
        this.localSelectedColor = this.rgbToHex(newColorRGB.r, newColorRGB.g, newColorRGB.b);
      } else {
        this.invalid = true;
      }
    }
  }
};
</script>

<style lang="scss">
.color-picker-container {
  width: 100%;
  height: 100%;

  .color-picker {
    position: absolute;
    bottom: 15px;
    left: 15px;
    padding: 7px 14px;
    color: #fff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 100;
    box-shadow: 0px 0px 56px -25px rgba(0,0,0,0.75);

    .color-picker-content {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #2d3436;

      .color-picker-content-item {
        margin-bottom: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1c2021;
        color: #fff;
        border-radius: 4px;
        padding: 5px;

        .color-picker-label {
          margin-right: 10px;
          text-transform: uppercase;
        }

        .color-picker-input {
          padding: 5px;
          border: none;
          background-color: #2d3436;
          border-radius: 4px;
          color: #fff;
          outline: none;
        }
      }
    }

    .color-picker-color {
      text-transform: uppercase;
    }

    &.invalid {
      border: 1px solid #d63031;

      .color-picker-content {
        .color-picker-content-item {
          .color-picker-input {
            border: 1px solid #d63031;
          }
        }
      }
    }

    &.expanded {
      cursor: unset;
    }
  }

  .color-picker-backdrop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
  }
}
</style>