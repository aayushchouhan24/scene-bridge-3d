var SceneBridge3D = (function () {
  'use strict';

  // node_modules/three/build/three.module.js
  var REVISION = "160";
  var FrontSide = 0;
  var BackSide = 1;
  var NormalBlending = 1;
  var AddEquation = 100;
  var SrcAlphaFactor = 204;
  var OneMinusSrcAlphaFactor = 205;
  var LessEqualDepth = 3;
  var MultiplyOperation = 0;
  var UVMapping = 300;
  var RepeatWrapping = 1e3;
  var ClampToEdgeWrapping = 1001;
  var MirroredRepeatWrapping = 1002;
  var NearestFilter = 1003;
  var LinearFilter = 1006;
  var LinearMipmapLinearFilter = 1008;
  var UnsignedByteType = 1009;
  var UnsignedIntType = 1014;
  var FloatType = 1015;
  var UnsignedInt248Type = 1020;
  var RGBAFormat = 1023;
  var DepthFormat = 1026;
  var DepthStencilFormat = 1027;
  var LinearEncoding = 3e3;
  var sRGBEncoding = 3001;
  var NoColorSpace = "";
  var SRGBColorSpace = "srgb";
  var LinearSRGBColorSpace = "srgb-linear";
  var DisplayP3ColorSpace = "display-p3";
  var LinearDisplayP3ColorSpace = "display-p3-linear";
  var LinearTransfer = "linear";
  var SRGBTransfer = "srgb";
  var Rec709Primaries = "rec709";
  var P3Primaries = "p3";
  var KeepStencilOp = 7680;
  var AlwaysStencilFunc = 519;
  var LessEqualCompare = 515;
  var StaticDrawUsage = 35044;
  var WebGLCoordinateSystem = 2e3;
  var WebGPUCoordinateSystem = 2001;
  var EventDispatcher = class {
    addEventListener(type, listener) {
      if (this._listeners === void 0) this._listeners = {};
      const listeners = this._listeners;
      if (listeners[type] === void 0) {
        listeners[type] = [];
      }
      if (listeners[type].indexOf(listener) === -1) {
        listeners[type].push(listener);
      }
    }
    hasEventListener(type, listener) {
      if (this._listeners === void 0) return false;
      const listeners = this._listeners;
      return listeners[type] !== void 0 && listeners[type].indexOf(listener) !== -1;
    }
    removeEventListener(type, listener) {
      if (this._listeners === void 0) return;
      const listeners = this._listeners;
      const listenerArray = listeners[type];
      if (listenerArray !== void 0) {
        const index = listenerArray.indexOf(listener);
        if (index !== -1) {
          listenerArray.splice(index, 1);
        }
      }
    }
    dispatchEvent(event) {
      if (this._listeners === void 0) return;
      const listeners = this._listeners;
      const listenerArray = listeners[event.type];
      if (listenerArray !== void 0) {
        event.target = this;
        const array = listenerArray.slice(0);
        for (let i = 0, l = array.length; i < l; i++) {
          array[i].call(this, event);
        }
        event.target = null;
      }
    }
  };
  var _lut = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
  var DEG2RAD = Math.PI / 180;
  function generateUUID() {
    const d0 = Math.random() * 4294967295 | 0;
    const d1 = Math.random() * 4294967295 | 0;
    const d2 = Math.random() * 4294967295 | 0;
    const d3 = Math.random() * 4294967295 | 0;
    const uuid = _lut[d0 & 255] + _lut[d0 >> 8 & 255] + _lut[d0 >> 16 & 255] + _lut[d0 >> 24 & 255] + "-" + _lut[d1 & 255] + _lut[d1 >> 8 & 255] + "-" + _lut[d1 >> 16 & 15 | 64] + _lut[d1 >> 24 & 255] + "-" + _lut[d2 & 63 | 128] + _lut[d2 >> 8 & 255] + "-" + _lut[d2 >> 16 & 255] + _lut[d2 >> 24 & 255] + _lut[d3 & 255] + _lut[d3 >> 8 & 255] + _lut[d3 >> 16 & 255] + _lut[d3 >> 24 & 255];
    return uuid.toLowerCase();
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function euclideanModulo(n, m) {
    return (n % m + m) % m;
  }
  function lerp(x, y, t) {
    return (1 - t) * x + t * y;
  }
  function denormalize(value, array) {
    switch (array.constructor) {
      case Float32Array:
        return value;
      case Uint32Array:
        return value / 4294967295;
      case Uint16Array:
        return value / 65535;
      case Uint8Array:
        return value / 255;
      case Int32Array:
        return Math.max(value / 2147483647, -1);
      case Int16Array:
        return Math.max(value / 32767, -1);
      case Int8Array:
        return Math.max(value / 127, -1);
      default:
        throw new Error("Invalid component type.");
    }
  }
  function normalize(value, array) {
    switch (array.constructor) {
      case Float32Array:
        return value;
      case Uint32Array:
        return Math.round(value * 4294967295);
      case Uint16Array:
        return Math.round(value * 65535);
      case Uint8Array:
        return Math.round(value * 255);
      case Int32Array:
        return Math.round(value * 2147483647);
      case Int16Array:
        return Math.round(value * 32767);
      case Int8Array:
        return Math.round(value * 127);
      default:
        throw new Error("Invalid component type.");
    }
  }
  var MathUtils = {
    DEG2RAD};
  var Vector2 = class _Vector2 {
    constructor(x = 0, y = 0) {
      _Vector2.prototype.isVector2 = true;
      this.x = x;
      this.y = y;
    }
    get width() {
      return this.x;
    }
    set width(value) {
      this.x = value;
    }
    get height() {
      return this.y;
    }
    set height(value) {
      this.y = value;
    }
    set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    setScalar(scalar) {
      this.x = scalar;
      this.y = scalar;
      return this;
    }
    setX(x) {
      this.x = x;
      return this;
    }
    setY(y) {
      this.y = y;
      return this;
    }
    setComponent(index, value) {
      switch (index) {
        case 0:
          this.x = value;
          break;
        case 1:
          this.y = value;
          break;
        default:
          throw new Error("index is out of range: " + index);
      }
      return this;
    }
    getComponent(index) {
      switch (index) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw new Error("index is out of range: " + index);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(v) {
      this.x = v.x;
      this.y = v.y;
      return this;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    addScalar(s) {
      this.x += s;
      this.y += s;
      return this;
    }
    addVectors(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      return this;
    }
    addScaledVector(v, s) {
      this.x += v.x * s;
      this.y += v.y * s;
      return this;
    }
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }
    subScalar(s) {
      this.x -= s;
      this.y -= s;
      return this;
    }
    subVectors(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      return this;
    }
    multiply(v) {
      this.x *= v.x;
      this.y *= v.y;
      return this;
    }
    multiplyScalar(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    }
    divide(v) {
      this.x /= v.x;
      this.y /= v.y;
      return this;
    }
    divideScalar(scalar) {
      return this.multiplyScalar(1 / scalar);
    }
    applyMatrix3(m) {
      const x = this.x, y = this.y;
      const e = m.elements;
      this.x = e[0] * x + e[3] * y + e[6];
      this.y = e[1] * x + e[4] * y + e[7];
      return this;
    }
    min(v) {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      return this;
    }
    max(v) {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      return this;
    }
    clamp(min, max) {
      this.x = Math.max(min.x, Math.min(max.x, this.x));
      this.y = Math.max(min.y, Math.min(max.y, this.y));
      return this;
    }
    clampScalar(minVal, maxVal) {
      this.x = Math.max(minVal, Math.min(maxVal, this.x));
      this.y = Math.max(minVal, Math.min(maxVal, this.y));
      return this;
    }
    clampLength(min, max) {
      const length = this.length();
      return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    }
    floor() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      return this;
    }
    ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      return this;
    }
    round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      return this;
    }
    roundToZero() {
      this.x = Math.trunc(this.x);
      this.y = Math.trunc(this.y);
      return this;
    }
    negate() {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }
    dot(v) {
      return this.x * v.x + this.y * v.y;
    }
    cross(v) {
      return this.x * v.y - this.y * v.x;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    angle() {
      const angle = Math.atan2(-this.y, -this.x) + Math.PI;
      return angle;
    }
    angleTo(v) {
      const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
      if (denominator === 0) return Math.PI / 2;
      const theta = this.dot(v) / denominator;
      return Math.acos(clamp(theta, -1, 1));
    }
    distanceTo(v) {
      return Math.sqrt(this.distanceToSquared(v));
    }
    distanceToSquared(v) {
      const dx = this.x - v.x, dy = this.y - v.y;
      return dx * dx + dy * dy;
    }
    manhattanDistanceTo(v) {
      return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }
    setLength(length) {
      return this.normalize().multiplyScalar(length);
    }
    lerp(v, alpha) {
      this.x += (v.x - this.x) * alpha;
      this.y += (v.y - this.y) * alpha;
      return this;
    }
    lerpVectors(v1, v2, alpha) {
      this.x = v1.x + (v2.x - v1.x) * alpha;
      this.y = v1.y + (v2.y - v1.y) * alpha;
      return this;
    }
    equals(v) {
      return v.x === this.x && v.y === this.y;
    }
    fromArray(array, offset = 0) {
      this.x = array[offset];
      this.y = array[offset + 1];
      return this;
    }
    toArray(array = [], offset = 0) {
      array[offset] = this.x;
      array[offset + 1] = this.y;
      return array;
    }
    fromBufferAttribute(attribute, index) {
      this.x = attribute.getX(index);
      this.y = attribute.getY(index);
      return this;
    }
    rotateAround(center, angle) {
      const c = Math.cos(angle), s = Math.sin(angle);
      const x = this.x - center.x;
      const y = this.y - center.y;
      this.x = x * c - y * s + center.x;
      this.y = x * s + y * c + center.y;
      return this;
    }
    random() {
      this.x = Math.random();
      this.y = Math.random();
      return this;
    }
    *[Symbol.iterator]() {
      yield this.x;
      yield this.y;
    }
  };
  var Matrix3 = class _Matrix3 {
    constructor(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
      _Matrix3.prototype.isMatrix3 = true;
      this.elements = [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ];
      if (n11 !== void 0) {
        this.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);
      }
    }
    set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
      const te = this.elements;
      te[0] = n11;
      te[1] = n21;
      te[2] = n31;
      te[3] = n12;
      te[4] = n22;
      te[5] = n32;
      te[6] = n13;
      te[7] = n23;
      te[8] = n33;
      return this;
    }
    identity() {
      this.set(
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      );
      return this;
    }
    copy(m) {
      const te = this.elements;
      const me = m.elements;
      te[0] = me[0];
      te[1] = me[1];
      te[2] = me[2];
      te[3] = me[3];
      te[4] = me[4];
      te[5] = me[5];
      te[6] = me[6];
      te[7] = me[7];
      te[8] = me[8];
      return this;
    }
    extractBasis(xAxis, yAxis, zAxis) {
      xAxis.setFromMatrix3Column(this, 0);
      yAxis.setFromMatrix3Column(this, 1);
      zAxis.setFromMatrix3Column(this, 2);
      return this;
    }
    setFromMatrix4(m) {
      const me = m.elements;
      this.set(
        me[0],
        me[4],
        me[8],
        me[1],
        me[5],
        me[9],
        me[2],
        me[6],
        me[10]
      );
      return this;
    }
    multiply(m) {
      return this.multiplyMatrices(this, m);
    }
    premultiply(m) {
      return this.multiplyMatrices(m, this);
    }
    multiplyMatrices(a, b) {
      const ae = a.elements;
      const be = b.elements;
      const te = this.elements;
      const a11 = ae[0], a12 = ae[3], a13 = ae[6];
      const a21 = ae[1], a22 = ae[4], a23 = ae[7];
      const a31 = ae[2], a32 = ae[5], a33 = ae[8];
      const b11 = be[0], b12 = be[3], b13 = be[6];
      const b21 = be[1], b22 = be[4], b23 = be[7];
      const b31 = be[2], b32 = be[5], b33 = be[8];
      te[0] = a11 * b11 + a12 * b21 + a13 * b31;
      te[3] = a11 * b12 + a12 * b22 + a13 * b32;
      te[6] = a11 * b13 + a12 * b23 + a13 * b33;
      te[1] = a21 * b11 + a22 * b21 + a23 * b31;
      te[4] = a21 * b12 + a22 * b22 + a23 * b32;
      te[7] = a21 * b13 + a22 * b23 + a23 * b33;
      te[2] = a31 * b11 + a32 * b21 + a33 * b31;
      te[5] = a31 * b12 + a32 * b22 + a33 * b32;
      te[8] = a31 * b13 + a32 * b23 + a33 * b33;
      return this;
    }
    multiplyScalar(s) {
      const te = this.elements;
      te[0] *= s;
      te[3] *= s;
      te[6] *= s;
      te[1] *= s;
      te[4] *= s;
      te[7] *= s;
      te[2] *= s;
      te[5] *= s;
      te[8] *= s;
      return this;
    }
    determinant() {
      const te = this.elements;
      const a = te[0], b = te[1], c = te[2], d = te[3], e = te[4], f = te[5], g = te[6], h = te[7], i = te[8];
      return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
    }
    invert() {
      const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n12 = te[3], n22 = te[4], n32 = te[5], n13 = te[6], n23 = te[7], n33 = te[8], t11 = n33 * n22 - n32 * n23, t12 = n32 * n13 - n33 * n12, t13 = n23 * n12 - n22 * n13, det = n11 * t11 + n21 * t12 + n31 * t13;
      if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const detInv = 1 / det;
      te[0] = t11 * detInv;
      te[1] = (n31 * n23 - n33 * n21) * detInv;
      te[2] = (n32 * n21 - n31 * n22) * detInv;
      te[3] = t12 * detInv;
      te[4] = (n33 * n11 - n31 * n13) * detInv;
      te[5] = (n31 * n12 - n32 * n11) * detInv;
      te[6] = t13 * detInv;
      te[7] = (n21 * n13 - n23 * n11) * detInv;
      te[8] = (n22 * n11 - n21 * n12) * detInv;
      return this;
    }
    transpose() {
      let tmp;
      const m = this.elements;
      tmp = m[1];
      m[1] = m[3];
      m[3] = tmp;
      tmp = m[2];
      m[2] = m[6];
      m[6] = tmp;
      tmp = m[5];
      m[5] = m[7];
      m[7] = tmp;
      return this;
    }
    getNormalMatrix(matrix4) {
      return this.setFromMatrix4(matrix4).invert().transpose();
    }
    transposeIntoArray(r) {
      const m = this.elements;
      r[0] = m[0];
      r[1] = m[3];
      r[2] = m[6];
      r[3] = m[1];
      r[4] = m[4];
      r[5] = m[7];
      r[6] = m[2];
      r[7] = m[5];
      r[8] = m[8];
      return this;
    }
    setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {
      const c = Math.cos(rotation);
      const s = Math.sin(rotation);
      this.set(
        sx * c,
        sx * s,
        -sx * (c * cx + s * cy) + cx + tx,
        -sy * s,
        sy * c,
        -sy * (-s * cx + c * cy) + cy + ty,
        0,
        0,
        1
      );
      return this;
    }
    //
    scale(sx, sy) {
      this.premultiply(_m3.makeScale(sx, sy));
      return this;
    }
    rotate(theta) {
      this.premultiply(_m3.makeRotation(-theta));
      return this;
    }
    translate(tx, ty) {
      this.premultiply(_m3.makeTranslation(tx, ty));
      return this;
    }
    // for 2D Transforms
    makeTranslation(x, y) {
      if (x.isVector2) {
        this.set(
          1,
          0,
          x.x,
          0,
          1,
          x.y,
          0,
          0,
          1
        );
      } else {
        this.set(
          1,
          0,
          x,
          0,
          1,
          y,
          0,
          0,
          1
        );
      }
      return this;
    }
    makeRotation(theta) {
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      this.set(
        c,
        -s,
        0,
        s,
        c,
        0,
        0,
        0,
        1
      );
      return this;
    }
    makeScale(x, y) {
      this.set(
        x,
        0,
        0,
        0,
        y,
        0,
        0,
        0,
        1
      );
      return this;
    }
    //
    equals(matrix) {
      const te = this.elements;
      const me = matrix.elements;
      for (let i = 0; i < 9; i++) {
        if (te[i] !== me[i]) return false;
      }
      return true;
    }
    fromArray(array, offset = 0) {
      for (let i = 0; i < 9; i++) {
        this.elements[i] = array[i + offset];
      }
      return this;
    }
    toArray(array = [], offset = 0) {
      const te = this.elements;
      array[offset] = te[0];
      array[offset + 1] = te[1];
      array[offset + 2] = te[2];
      array[offset + 3] = te[3];
      array[offset + 4] = te[4];
      array[offset + 5] = te[5];
      array[offset + 6] = te[6];
      array[offset + 7] = te[7];
      array[offset + 8] = te[8];
      return array;
    }
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  };
  var _m3 = /* @__PURE__ */ new Matrix3();
  function arrayNeedsUint32(array) {
    for (let i = array.length - 1; i >= 0; --i) {
      if (array[i] >= 65535) return true;
    }
    return false;
  }
  function createElementNS(name) {
    return document.createElementNS("http://www.w3.org/1999/xhtml", name);
  }
  var _cache = {};
  function warnOnce(message) {
    if (message in _cache) return;
    _cache[message] = true;
    console.warn(message);
  }
  var LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = /* @__PURE__ */ new Matrix3().set(
    0.8224621,
    0.177538,
    0,
    0.0331941,
    0.9668058,
    0,
    0.0170827,
    0.0723974,
    0.9105199
  );
  var LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = /* @__PURE__ */ new Matrix3().set(
    1.2249401,
    -0.2249404,
    0,
    -0.0420569,
    1.0420571,
    0,
    -0.0196376,
    -0.0786361,
    1.0982735
  );
  var COLOR_SPACES = {
    [LinearSRGBColorSpace]: {
      transfer: LinearTransfer,
      primaries: Rec709Primaries,
      toReference: (color) => color,
      fromReference: (color) => color
    },
    [SRGBColorSpace]: {
      transfer: SRGBTransfer,
      primaries: Rec709Primaries,
      toReference: (color) => color.convertSRGBToLinear(),
      fromReference: (color) => color.convertLinearToSRGB()
    },
    [LinearDisplayP3ColorSpace]: {
      transfer: LinearTransfer,
      primaries: P3Primaries,
      toReference: (color) => color.applyMatrix3(LINEAR_DISPLAY_P3_TO_LINEAR_SRGB),
      fromReference: (color) => color.applyMatrix3(LINEAR_SRGB_TO_LINEAR_DISPLAY_P3)
    },
    [DisplayP3ColorSpace]: {
      transfer: SRGBTransfer,
      primaries: P3Primaries,
      toReference: (color) => color.convertSRGBToLinear().applyMatrix3(LINEAR_DISPLAY_P3_TO_LINEAR_SRGB),
      fromReference: (color) => color.applyMatrix3(LINEAR_SRGB_TO_LINEAR_DISPLAY_P3).convertLinearToSRGB()
    }
  };
  var SUPPORTED_WORKING_COLOR_SPACES = /* @__PURE__ */ new Set([LinearSRGBColorSpace, LinearDisplayP3ColorSpace]);
  var ColorManagement = {
    enabled: true,
    _workingColorSpace: LinearSRGBColorSpace,
    get workingColorSpace() {
      return this._workingColorSpace;
    },
    set workingColorSpace(colorSpace) {
      if (!SUPPORTED_WORKING_COLOR_SPACES.has(colorSpace)) {
        throw new Error(`Unsupported working color space, "${colorSpace}".`);
      }
      this._workingColorSpace = colorSpace;
    },
    convert: function(color, sourceColorSpace, targetColorSpace) {
      if (this.enabled === false || sourceColorSpace === targetColorSpace || !sourceColorSpace || !targetColorSpace) {
        return color;
      }
      const sourceToReference = COLOR_SPACES[sourceColorSpace].toReference;
      const targetFromReference = COLOR_SPACES[targetColorSpace].fromReference;
      return targetFromReference(sourceToReference(color));
    },
    fromWorkingColorSpace: function(color, targetColorSpace) {
      return this.convert(color, this._workingColorSpace, targetColorSpace);
    },
    toWorkingColorSpace: function(color, sourceColorSpace) {
      return this.convert(color, sourceColorSpace, this._workingColorSpace);
    },
    getPrimaries: function(colorSpace) {
      return COLOR_SPACES[colorSpace].primaries;
    },
    getTransfer: function(colorSpace) {
      if (colorSpace === NoColorSpace) return LinearTransfer;
      return COLOR_SPACES[colorSpace].transfer;
    }
  };
  function SRGBToLinear(c) {
    return c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
  }
  function LinearToSRGB(c) {
    return c < 31308e-7 ? c * 12.92 : 1.055 * Math.pow(c, 0.41666) - 0.055;
  }
  var _canvas;
  var ImageUtils = class {
    static getDataURL(image) {
      if (/^data:/i.test(image.src)) {
        return image.src;
      }
      if (typeof HTMLCanvasElement === "undefined") {
        return image.src;
      }
      let canvas;
      if (image instanceof HTMLCanvasElement) {
        canvas = image;
      } else {
        if (_canvas === void 0) _canvas = createElementNS("canvas");
        _canvas.width = image.width;
        _canvas.height = image.height;
        const context = _canvas.getContext("2d");
        if (image instanceof ImageData) {
          context.putImageData(image, 0, 0);
        } else {
          context.drawImage(image, 0, 0, image.width, image.height);
        }
        canvas = _canvas;
      }
      if (canvas.width > 2048 || canvas.height > 2048) {
        console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", image);
        return canvas.toDataURL("image/jpeg", 0.6);
      } else {
        return canvas.toDataURL("image/png");
      }
    }
    static sRGBToLinear(image) {
      if (typeof HTMLImageElement !== "undefined" && image instanceof HTMLImageElement || typeof HTMLCanvasElement !== "undefined" && image instanceof HTMLCanvasElement || typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
        const canvas = createElementNS("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        const imageData = context.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i++) {
          data[i] = SRGBToLinear(data[i] / 255) * 255;
        }
        context.putImageData(imageData, 0, 0);
        return canvas;
      } else if (image.data) {
        const data = image.data.slice(0);
        for (let i = 0; i < data.length; i++) {
          if (data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
            data[i] = Math.floor(SRGBToLinear(data[i] / 255) * 255);
          } else {
            data[i] = SRGBToLinear(data[i]);
          }
        }
        return {
          data,
          width: image.width,
          height: image.height
        };
      } else {
        console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.");
        return image;
      }
    }
  };
  var _sourceId = 0;
  var Source = class {
    constructor(data = null) {
      this.isSource = true;
      Object.defineProperty(this, "id", { value: _sourceId++ });
      this.uuid = generateUUID();
      this.data = data;
      this.version = 0;
    }
    set needsUpdate(value) {
      if (value === true) this.version++;
    }
    toJSON(meta) {
      const isRootObject = meta === void 0 || typeof meta === "string";
      if (!isRootObject && meta.images[this.uuid] !== void 0) {
        return meta.images[this.uuid];
      }
      const output = {
        uuid: this.uuid,
        url: ""
      };
      const data = this.data;
      if (data !== null) {
        let url;
        if (Array.isArray(data)) {
          url = [];
          for (let i = 0, l = data.length; i < l; i++) {
            if (data[i].isDataTexture) {
              url.push(serializeImage(data[i].image));
            } else {
              url.push(serializeImage(data[i]));
            }
          }
        } else {
          url = serializeImage(data);
        }
        output.url = url;
      }
      if (!isRootObject) {
        meta.images[this.uuid] = output;
      }
      return output;
    }
  };
  function serializeImage(image) {
    if (typeof HTMLImageElement !== "undefined" && image instanceof HTMLImageElement || typeof HTMLCanvasElement !== "undefined" && image instanceof HTMLCanvasElement || typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
      return ImageUtils.getDataURL(image);
    } else {
      if (image.data) {
        return {
          data: Array.from(image.data),
          width: image.width,
          height: image.height,
          type: image.data.constructor.name
        };
      } else {
        console.warn("THREE.Texture: Unable to serialize Texture.");
        return {};
      }
    }
  }
  var _textureId = 0;
  var Texture = class _Texture extends EventDispatcher {
    constructor(image = _Texture.DEFAULT_IMAGE, mapping = _Texture.DEFAULT_MAPPING, wrapS = ClampToEdgeWrapping, wrapT = ClampToEdgeWrapping, magFilter = LinearFilter, minFilter = LinearMipmapLinearFilter, format = RGBAFormat, type = UnsignedByteType, anisotropy = _Texture.DEFAULT_ANISOTROPY, colorSpace = NoColorSpace) {
      super();
      this.isTexture = true;
      Object.defineProperty(this, "id", { value: _textureId++ });
      this.uuid = generateUUID();
      this.name = "";
      this.source = new Source(image);
      this.mipmaps = [];
      this.mapping = mapping;
      this.channel = 0;
      this.wrapS = wrapS;
      this.wrapT = wrapT;
      this.magFilter = magFilter;
      this.minFilter = minFilter;
      this.anisotropy = anisotropy;
      this.format = format;
      this.internalFormat = null;
      this.type = type;
      this.offset = new Vector2(0, 0);
      this.repeat = new Vector2(1, 1);
      this.center = new Vector2(0, 0);
      this.rotation = 0;
      this.matrixAutoUpdate = true;
      this.matrix = new Matrix3();
      this.generateMipmaps = true;
      this.premultiplyAlpha = false;
      this.flipY = true;
      this.unpackAlignment = 4;
      if (typeof colorSpace === "string") {
        this.colorSpace = colorSpace;
      } else {
        warnOnce("THREE.Texture: Property .encoding has been replaced by .colorSpace.");
        this.colorSpace = colorSpace === sRGBEncoding ? SRGBColorSpace : NoColorSpace;
      }
      this.userData = {};
      this.version = 0;
      this.onUpdate = null;
      this.isRenderTargetTexture = false;
      this.needsPMREMUpdate = false;
    }
    get image() {
      return this.source.data;
    }
    set image(value = null) {
      this.source.data = value;
    }
    updateMatrix() {
      this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(source) {
      this.name = source.name;
      this.source = source.source;
      this.mipmaps = source.mipmaps.slice(0);
      this.mapping = source.mapping;
      this.channel = source.channel;
      this.wrapS = source.wrapS;
      this.wrapT = source.wrapT;
      this.magFilter = source.magFilter;
      this.minFilter = source.minFilter;
      this.anisotropy = source.anisotropy;
      this.format = source.format;
      this.internalFormat = source.internalFormat;
      this.type = source.type;
      this.offset.copy(source.offset);
      this.repeat.copy(source.repeat);
      this.center.copy(source.center);
      this.rotation = source.rotation;
      this.matrixAutoUpdate = source.matrixAutoUpdate;
      this.matrix.copy(source.matrix);
      this.generateMipmaps = source.generateMipmaps;
      this.premultiplyAlpha = source.premultiplyAlpha;
      this.flipY = source.flipY;
      this.unpackAlignment = source.unpackAlignment;
      this.colorSpace = source.colorSpace;
      this.userData = JSON.parse(JSON.stringify(source.userData));
      this.needsUpdate = true;
      return this;
    }
    toJSON(meta) {
      const isRootObject = meta === void 0 || typeof meta === "string";
      if (!isRootObject && meta.textures[this.uuid] !== void 0) {
        return meta.textures[this.uuid];
      }
      const output = {
        metadata: {
          version: 4.6,
          type: "Texture",
          generator: "Texture.toJSON"
        },
        uuid: this.uuid,
        name: this.name,
        image: this.source.toJSON(meta).uuid,
        mapping: this.mapping,
        channel: this.channel,
        repeat: [this.repeat.x, this.repeat.y],
        offset: [this.offset.x, this.offset.y],
        center: [this.center.x, this.center.y],
        rotation: this.rotation,
        wrap: [this.wrapS, this.wrapT],
        format: this.format,
        internalFormat: this.internalFormat,
        type: this.type,
        colorSpace: this.colorSpace,
        minFilter: this.minFilter,
        magFilter: this.magFilter,
        anisotropy: this.anisotropy,
        flipY: this.flipY,
        generateMipmaps: this.generateMipmaps,
        premultiplyAlpha: this.premultiplyAlpha,
        unpackAlignment: this.unpackAlignment
      };
      if (Object.keys(this.userData).length > 0) output.userData = this.userData;
      if (!isRootObject) {
        meta.textures[this.uuid] = output;
      }
      return output;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    transformUv(uv) {
      if (this.mapping !== UVMapping) return uv;
      uv.applyMatrix3(this.matrix);
      if (uv.x < 0 || uv.x > 1) {
        switch (this.wrapS) {
          case RepeatWrapping:
            uv.x = uv.x - Math.floor(uv.x);
            break;
          case ClampToEdgeWrapping:
            uv.x = uv.x < 0 ? 0 : 1;
            break;
          case MirroredRepeatWrapping:
            if (Math.abs(Math.floor(uv.x) % 2) === 1) {
              uv.x = Math.ceil(uv.x) - uv.x;
            } else {
              uv.x = uv.x - Math.floor(uv.x);
            }
            break;
        }
      }
      if (uv.y < 0 || uv.y > 1) {
        switch (this.wrapT) {
          case RepeatWrapping:
            uv.y = uv.y - Math.floor(uv.y);
            break;
          case ClampToEdgeWrapping:
            uv.y = uv.y < 0 ? 0 : 1;
            break;
          case MirroredRepeatWrapping:
            if (Math.abs(Math.floor(uv.y) % 2) === 1) {
              uv.y = Math.ceil(uv.y) - uv.y;
            } else {
              uv.y = uv.y - Math.floor(uv.y);
            }
            break;
        }
      }
      if (this.flipY) {
        uv.y = 1 - uv.y;
      }
      return uv;
    }
    set needsUpdate(value) {
      if (value === true) {
        this.version++;
        this.source.needsUpdate = true;
      }
    }
    get encoding() {
      warnOnce("THREE.Texture: Property .encoding has been replaced by .colorSpace.");
      return this.colorSpace === SRGBColorSpace ? sRGBEncoding : LinearEncoding;
    }
    set encoding(encoding) {
      warnOnce("THREE.Texture: Property .encoding has been replaced by .colorSpace.");
      this.colorSpace = encoding === sRGBEncoding ? SRGBColorSpace : NoColorSpace;
    }
  };
  Texture.DEFAULT_IMAGE = null;
  Texture.DEFAULT_MAPPING = UVMapping;
  Texture.DEFAULT_ANISOTROPY = 1;
  var Quaternion = class {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.isQuaternion = true;
      this._x = x;
      this._y = y;
      this._z = z;
      this._w = w;
    }
    static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
      let x0 = src0[srcOffset0 + 0], y0 = src0[srcOffset0 + 1], z0 = src0[srcOffset0 + 2], w0 = src0[srcOffset0 + 3];
      const x1 = src1[srcOffset1 + 0], y1 = src1[srcOffset1 + 1], z1 = src1[srcOffset1 + 2], w1 = src1[srcOffset1 + 3];
      if (t === 0) {
        dst[dstOffset + 0] = x0;
        dst[dstOffset + 1] = y0;
        dst[dstOffset + 2] = z0;
        dst[dstOffset + 3] = w0;
        return;
      }
      if (t === 1) {
        dst[dstOffset + 0] = x1;
        dst[dstOffset + 1] = y1;
        dst[dstOffset + 2] = z1;
        dst[dstOffset + 3] = w1;
        return;
      }
      if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
        let s = 1 - t;
        const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1, dir = cos >= 0 ? 1 : -1, sqrSin = 1 - cos * cos;
        if (sqrSin > Number.EPSILON) {
          const sin = Math.sqrt(sqrSin), len = Math.atan2(sin, cos * dir);
          s = Math.sin(s * len) / sin;
          t = Math.sin(t * len) / sin;
        }
        const tDir = t * dir;
        x0 = x0 * s + x1 * tDir;
        y0 = y0 * s + y1 * tDir;
        z0 = z0 * s + z1 * tDir;
        w0 = w0 * s + w1 * tDir;
        if (s === 1 - t) {
          const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
          x0 *= f;
          y0 *= f;
          z0 *= f;
          w0 *= f;
        }
      }
      dst[dstOffset] = x0;
      dst[dstOffset + 1] = y0;
      dst[dstOffset + 2] = z0;
      dst[dstOffset + 3] = w0;
    }
    static multiplyQuaternionsFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1) {
      const x0 = src0[srcOffset0];
      const y0 = src0[srcOffset0 + 1];
      const z0 = src0[srcOffset0 + 2];
      const w0 = src0[srcOffset0 + 3];
      const x1 = src1[srcOffset1];
      const y1 = src1[srcOffset1 + 1];
      const z1 = src1[srcOffset1 + 2];
      const w1 = src1[srcOffset1 + 3];
      dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
      dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
      dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
      dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
      return dst;
    }
    get x() {
      return this._x;
    }
    set x(value) {
      this._x = value;
      this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(value) {
      this._y = value;
      this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(value) {
      this._z = value;
      this._onChangeCallback();
    }
    get w() {
      return this._w;
    }
    set w(value) {
      this._w = value;
      this._onChangeCallback();
    }
    set(x, y, z, w) {
      this._x = x;
      this._y = y;
      this._z = z;
      this._w = w;
      this._onChangeCallback();
      return this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._w);
    }
    copy(quaternion) {
      this._x = quaternion.x;
      this._y = quaternion.y;
      this._z = quaternion.z;
      this._w = quaternion.w;
      this._onChangeCallback();
      return this;
    }
    setFromEuler(euler, update = true) {
      const x = euler._x, y = euler._y, z = euler._z, order = euler._order;
      const cos = Math.cos;
      const sin = Math.sin;
      const c1 = cos(x / 2);
      const c2 = cos(y / 2);
      const c3 = cos(z / 2);
      const s1 = sin(x / 2);
      const s2 = sin(y / 2);
      const s3 = sin(z / 2);
      switch (order) {
        case "XYZ":
          this._x = s1 * c2 * c3 + c1 * s2 * s3;
          this._y = c1 * s2 * c3 - s1 * c2 * s3;
          this._z = c1 * c2 * s3 + s1 * s2 * c3;
          this._w = c1 * c2 * c3 - s1 * s2 * s3;
          break;
        case "YXZ":
          this._x = s1 * c2 * c3 + c1 * s2 * s3;
          this._y = c1 * s2 * c3 - s1 * c2 * s3;
          this._z = c1 * c2 * s3 - s1 * s2 * c3;
          this._w = c1 * c2 * c3 + s1 * s2 * s3;
          break;
        case "ZXY":
          this._x = s1 * c2 * c3 - c1 * s2 * s3;
          this._y = c1 * s2 * c3 + s1 * c2 * s3;
          this._z = c1 * c2 * s3 + s1 * s2 * c3;
          this._w = c1 * c2 * c3 - s1 * s2 * s3;
          break;
        case "ZYX":
          this._x = s1 * c2 * c3 - c1 * s2 * s3;
          this._y = c1 * s2 * c3 + s1 * c2 * s3;
          this._z = c1 * c2 * s3 - s1 * s2 * c3;
          this._w = c1 * c2 * c3 + s1 * s2 * s3;
          break;
        case "YZX":
          this._x = s1 * c2 * c3 + c1 * s2 * s3;
          this._y = c1 * s2 * c3 + s1 * c2 * s3;
          this._z = c1 * c2 * s3 - s1 * s2 * c3;
          this._w = c1 * c2 * c3 - s1 * s2 * s3;
          break;
        case "XZY":
          this._x = s1 * c2 * c3 - c1 * s2 * s3;
          this._y = c1 * s2 * c3 - s1 * c2 * s3;
          this._z = c1 * c2 * s3 + s1 * s2 * c3;
          this._w = c1 * c2 * c3 + s1 * s2 * s3;
          break;
        default:
          console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + order);
      }
      if (update === true) this._onChangeCallback();
      return this;
    }
    setFromAxisAngle(axis, angle) {
      const halfAngle = angle / 2, s = Math.sin(halfAngle);
      this._x = axis.x * s;
      this._y = axis.y * s;
      this._z = axis.z * s;
      this._w = Math.cos(halfAngle);
      this._onChangeCallback();
      return this;
    }
    setFromRotationMatrix(m) {
      const te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33;
      if (trace > 0) {
        const s = 0.5 / Math.sqrt(trace + 1);
        this._w = 0.25 / s;
        this._x = (m32 - m23) * s;
        this._y = (m13 - m31) * s;
        this._z = (m21 - m12) * s;
      } else if (m11 > m22 && m11 > m33) {
        const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
        this._w = (m32 - m23) / s;
        this._x = 0.25 * s;
        this._y = (m12 + m21) / s;
        this._z = (m13 + m31) / s;
      } else if (m22 > m33) {
        const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
        this._w = (m13 - m31) / s;
        this._x = (m12 + m21) / s;
        this._y = 0.25 * s;
        this._z = (m23 + m32) / s;
      } else {
        const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
        this._w = (m21 - m12) / s;
        this._x = (m13 + m31) / s;
        this._y = (m23 + m32) / s;
        this._z = 0.25 * s;
      }
      this._onChangeCallback();
      return this;
    }
    setFromUnitVectors(vFrom, vTo) {
      let r = vFrom.dot(vTo) + 1;
      if (r < Number.EPSILON) {
        r = 0;
        if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
          this._x = -vFrom.y;
          this._y = vFrom.x;
          this._z = 0;
          this._w = r;
        } else {
          this._x = 0;
          this._y = -vFrom.z;
          this._z = vFrom.y;
          this._w = r;
        }
      } else {
        this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
        this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
        this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
        this._w = r;
      }
      return this.normalize();
    }
    angleTo(q) {
      return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
    }
    rotateTowards(q, step) {
      const angle = this.angleTo(q);
      if (angle === 0) return this;
      const t = Math.min(1, step / angle);
      this.slerp(q, t);
      return this;
    }
    identity() {
      return this.set(0, 0, 0, 1);
    }
    invert() {
      return this.conjugate();
    }
    conjugate() {
      this._x *= -1;
      this._y *= -1;
      this._z *= -1;
      this._onChangeCallback();
      return this;
    }
    dot(v) {
      return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
    }
    lengthSq() {
      return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }
    length() {
      return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }
    normalize() {
      let l = this.length();
      if (l === 0) {
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._w = 1;
      } else {
        l = 1 / l;
        this._x = this._x * l;
        this._y = this._y * l;
        this._z = this._z * l;
        this._w = this._w * l;
      }
      this._onChangeCallback();
      return this;
    }
    multiply(q) {
      return this.multiplyQuaternions(this, q);
    }
    premultiply(q) {
      return this.multiplyQuaternions(q, this);
    }
    multiplyQuaternions(a, b) {
      const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
      const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
      this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
      this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
      this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
      this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
      this._onChangeCallback();
      return this;
    }
    slerp(qb, t) {
      if (t === 0) return this;
      if (t === 1) return this.copy(qb);
      const x = this._x, y = this._y, z = this._z, w = this._w;
      let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
      if (cosHalfTheta < 0) {
        this._w = -qb._w;
        this._x = -qb._x;
        this._y = -qb._y;
        this._z = -qb._z;
        cosHalfTheta = -cosHalfTheta;
      } else {
        this.copy(qb);
      }
      if (cosHalfTheta >= 1) {
        this._w = w;
        this._x = x;
        this._y = y;
        this._z = z;
        return this;
      }
      const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
      if (sqrSinHalfTheta <= Number.EPSILON) {
        const s = 1 - t;
        this._w = s * w + t * this._w;
        this._x = s * x + t * this._x;
        this._y = s * y + t * this._y;
        this._z = s * z + t * this._z;
        this.normalize();
        return this;
      }
      const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
      const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
      const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
      this._w = w * ratioA + this._w * ratioB;
      this._x = x * ratioA + this._x * ratioB;
      this._y = y * ratioA + this._y * ratioB;
      this._z = z * ratioA + this._z * ratioB;
      this._onChangeCallback();
      return this;
    }
    slerpQuaternions(qa, qb, t) {
      return this.copy(qa).slerp(qb, t);
    }
    random() {
      const u1 = Math.random();
      const sqrt1u1 = Math.sqrt(1 - u1);
      const sqrtu1 = Math.sqrt(u1);
      const u2 = 2 * Math.PI * Math.random();
      const u3 = 2 * Math.PI * Math.random();
      return this.set(
        sqrt1u1 * Math.cos(u2),
        sqrtu1 * Math.sin(u3),
        sqrtu1 * Math.cos(u3),
        sqrt1u1 * Math.sin(u2)
      );
    }
    equals(quaternion) {
      return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
    }
    fromArray(array, offset = 0) {
      this._x = array[offset];
      this._y = array[offset + 1];
      this._z = array[offset + 2];
      this._w = array[offset + 3];
      this._onChangeCallback();
      return this;
    }
    toArray(array = [], offset = 0) {
      array[offset] = this._x;
      array[offset + 1] = this._y;
      array[offset + 2] = this._z;
      array[offset + 3] = this._w;
      return array;
    }
    fromBufferAttribute(attribute, index) {
      this._x = attribute.getX(index);
      this._y = attribute.getY(index);
      this._z = attribute.getZ(index);
      this._w = attribute.getW(index);
      this._onChangeCallback();
      return this;
    }
    toJSON() {
      return this.toArray();
    }
    _onChange(callback) {
      this._onChangeCallback = callback;
      return this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x;
      yield this._y;
      yield this._z;
      yield this._w;
    }
  };
  var Vector3 = class _Vector3 {
    constructor(x = 0, y = 0, z = 0) {
      _Vector3.prototype.isVector3 = true;
      this.x = x;
      this.y = y;
      this.z = z;
    }
    set(x, y, z) {
      if (z === void 0) z = this.z;
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    setScalar(scalar) {
      this.x = scalar;
      this.y = scalar;
      this.z = scalar;
      return this;
    }
    setX(x) {
      this.x = x;
      return this;
    }
    setY(y) {
      this.y = y;
      return this;
    }
    setZ(z) {
      this.z = z;
      return this;
    }
    setComponent(index, value) {
      switch (index) {
        case 0:
          this.x = value;
          break;
        case 1:
          this.y = value;
          break;
        case 2:
          this.z = value;
          break;
        default:
          throw new Error("index is out of range: " + index);
      }
      return this;
    }
    getComponent(index) {
      switch (index) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw new Error("index is out of range: " + index);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z);
    }
    copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      return this;
    }
    addScalar(s) {
      this.x += s;
      this.y += s;
      this.z += s;
      return this;
    }
    addVectors(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      return this;
    }
    addScaledVector(v, s) {
      this.x += v.x * s;
      this.y += v.y * s;
      this.z += v.z * s;
      return this;
    }
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      return this;
    }
    subScalar(s) {
      this.x -= s;
      this.y -= s;
      this.z -= s;
      return this;
    }
    subVectors(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      return this;
    }
    multiply(v) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      return this;
    }
    multiplyScalar(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
    }
    multiplyVectors(a, b) {
      this.x = a.x * b.x;
      this.y = a.y * b.y;
      this.z = a.z * b.z;
      return this;
    }
    applyEuler(euler) {
      return this.applyQuaternion(_quaternion$4.setFromEuler(euler));
    }
    applyAxisAngle(axis, angle) {
      return this.applyQuaternion(_quaternion$4.setFromAxisAngle(axis, angle));
    }
    applyMatrix3(m) {
      const x = this.x, y = this.y, z = this.z;
      const e = m.elements;
      this.x = e[0] * x + e[3] * y + e[6] * z;
      this.y = e[1] * x + e[4] * y + e[7] * z;
      this.z = e[2] * x + e[5] * y + e[8] * z;
      return this;
    }
    applyNormalMatrix(m) {
      return this.applyMatrix3(m).normalize();
    }
    applyMatrix4(m) {
      const x = this.x, y = this.y, z = this.z;
      const e = m.elements;
      const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
      this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
      this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
      this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
      return this;
    }
    applyQuaternion(q) {
      const vx = this.x, vy = this.y, vz = this.z;
      const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
      const tx = 2 * (qy * vz - qz * vy);
      const ty = 2 * (qz * vx - qx * vz);
      const tz = 2 * (qx * vy - qy * vx);
      this.x = vx + qw * tx + qy * tz - qz * ty;
      this.y = vy + qw * ty + qz * tx - qx * tz;
      this.z = vz + qw * tz + qx * ty - qy * tx;
      return this;
    }
    project(camera) {
      return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
    }
    unproject(camera) {
      return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
    }
    transformDirection(m) {
      const x = this.x, y = this.y, z = this.z;
      const e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8] * z;
      this.y = e[1] * x + e[5] * y + e[9] * z;
      this.z = e[2] * x + e[6] * y + e[10] * z;
      return this.normalize();
    }
    divide(v) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
      return this;
    }
    divideScalar(scalar) {
      return this.multiplyScalar(1 / scalar);
    }
    min(v) {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      this.z = Math.min(this.z, v.z);
      return this;
    }
    max(v) {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      this.z = Math.max(this.z, v.z);
      return this;
    }
    clamp(min, max) {
      this.x = Math.max(min.x, Math.min(max.x, this.x));
      this.y = Math.max(min.y, Math.min(max.y, this.y));
      this.z = Math.max(min.z, Math.min(max.z, this.z));
      return this;
    }
    clampScalar(minVal, maxVal) {
      this.x = Math.max(minVal, Math.min(maxVal, this.x));
      this.y = Math.max(minVal, Math.min(maxVal, this.y));
      this.z = Math.max(minVal, Math.min(maxVal, this.z));
      return this;
    }
    clampLength(min, max) {
      const length = this.length();
      return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    }
    floor() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      this.z = Math.floor(this.z);
      return this;
    }
    ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      this.z = Math.ceil(this.z);
      return this;
    }
    round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.z = Math.round(this.z);
      return this;
    }
    roundToZero() {
      this.x = Math.trunc(this.x);
      this.y = Math.trunc(this.y);
      this.z = Math.trunc(this.z);
      return this;
    }
    negate() {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      return this;
    }
    dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    // TODO lengthSquared?
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(length) {
      return this.normalize().multiplyScalar(length);
    }
    lerp(v, alpha) {
      this.x += (v.x - this.x) * alpha;
      this.y += (v.y - this.y) * alpha;
      this.z += (v.z - this.z) * alpha;
      return this;
    }
    lerpVectors(v1, v2, alpha) {
      this.x = v1.x + (v2.x - v1.x) * alpha;
      this.y = v1.y + (v2.y - v1.y) * alpha;
      this.z = v1.z + (v2.z - v1.z) * alpha;
      return this;
    }
    cross(v) {
      return this.crossVectors(this, v);
    }
    crossVectors(a, b) {
      const ax = a.x, ay = a.y, az = a.z;
      const bx = b.x, by = b.y, bz = b.z;
      this.x = ay * bz - az * by;
      this.y = az * bx - ax * bz;
      this.z = ax * by - ay * bx;
      return this;
    }
    projectOnVector(v) {
      const denominator = v.lengthSq();
      if (denominator === 0) return this.set(0, 0, 0);
      const scalar = v.dot(this) / denominator;
      return this.copy(v).multiplyScalar(scalar);
    }
    projectOnPlane(planeNormal) {
      _vector$c.copy(this).projectOnVector(planeNormal);
      return this.sub(_vector$c);
    }
    reflect(normal) {
      return this.sub(_vector$c.copy(normal).multiplyScalar(2 * this.dot(normal)));
    }
    angleTo(v) {
      const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
      if (denominator === 0) return Math.PI / 2;
      const theta = this.dot(v) / denominator;
      return Math.acos(clamp(theta, -1, 1));
    }
    distanceTo(v) {
      return Math.sqrt(this.distanceToSquared(v));
    }
    distanceToSquared(v) {
      const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
      return dx * dx + dy * dy + dz * dz;
    }
    manhattanDistanceTo(v) {
      return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
    }
    setFromSpherical(s) {
      return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
    }
    setFromSphericalCoords(radius, phi, theta) {
      const sinPhiRadius = Math.sin(phi) * radius;
      this.x = sinPhiRadius * Math.sin(theta);
      this.y = Math.cos(phi) * radius;
      this.z = sinPhiRadius * Math.cos(theta);
      return this;
    }
    setFromCylindrical(c) {
      return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
    }
    setFromCylindricalCoords(radius, theta, y) {
      this.x = radius * Math.sin(theta);
      this.y = y;
      this.z = radius * Math.cos(theta);
      return this;
    }
    setFromMatrixPosition(m) {
      const e = m.elements;
      this.x = e[12];
      this.y = e[13];
      this.z = e[14];
      return this;
    }
    setFromMatrixScale(m) {
      const sx = this.setFromMatrixColumn(m, 0).length();
      const sy = this.setFromMatrixColumn(m, 1).length();
      const sz = this.setFromMatrixColumn(m, 2).length();
      this.x = sx;
      this.y = sy;
      this.z = sz;
      return this;
    }
    setFromMatrixColumn(m, index) {
      return this.fromArray(m.elements, index * 4);
    }
    setFromMatrix3Column(m, index) {
      return this.fromArray(m.elements, index * 3);
    }
    setFromEuler(e) {
      this.x = e._x;
      this.y = e._y;
      this.z = e._z;
      return this;
    }
    setFromColor(c) {
      this.x = c.r;
      this.y = c.g;
      this.z = c.b;
      return this;
    }
    equals(v) {
      return v.x === this.x && v.y === this.y && v.z === this.z;
    }
    fromArray(array, offset = 0) {
      this.x = array[offset];
      this.y = array[offset + 1];
      this.z = array[offset + 2];
      return this;
    }
    toArray(array = [], offset = 0) {
      array[offset] = this.x;
      array[offset + 1] = this.y;
      array[offset + 2] = this.z;
      return array;
    }
    fromBufferAttribute(attribute, index) {
      this.x = attribute.getX(index);
      this.y = attribute.getY(index);
      this.z = attribute.getZ(index);
      return this;
    }
    random() {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
      return this;
    }
    randomDirection() {
      const u = (Math.random() - 0.5) * 2;
      const t = Math.random() * Math.PI * 2;
      const f = Math.sqrt(1 - u ** 2);
      this.x = f * Math.cos(t);
      this.y = f * Math.sin(t);
      this.z = u;
      return this;
    }
    *[Symbol.iterator]() {
      yield this.x;
      yield this.y;
      yield this.z;
    }
  };
  var _vector$c = /* @__PURE__ */ new Vector3();
  var _quaternion$4 = /* @__PURE__ */ new Quaternion();
  var Box3 = class {
    constructor(min = new Vector3(Infinity, Infinity, Infinity), max = new Vector3(-Infinity, -Infinity, -Infinity)) {
      this.isBox3 = true;
      this.min = min;
      this.max = max;
    }
    set(min, max) {
      this.min.copy(min);
      this.max.copy(max);
      return this;
    }
    setFromArray(array) {
      this.makeEmpty();
      for (let i = 0, il = array.length; i < il; i += 3) {
        this.expandByPoint(_vector$b.fromArray(array, i));
      }
      return this;
    }
    setFromBufferAttribute(attribute) {
      this.makeEmpty();
      for (let i = 0, il = attribute.count; i < il; i++) {
        this.expandByPoint(_vector$b.fromBufferAttribute(attribute, i));
      }
      return this;
    }
    setFromPoints(points) {
      this.makeEmpty();
      for (let i = 0, il = points.length; i < il; i++) {
        this.expandByPoint(points[i]);
      }
      return this;
    }
    setFromCenterAndSize(center, size) {
      const halfSize = _vector$b.copy(size).multiplyScalar(0.5);
      this.min.copy(center).sub(halfSize);
      this.max.copy(center).add(halfSize);
      return this;
    }
    setFromObject(object, precise = false) {
      this.makeEmpty();
      return this.expandByObject(object, precise);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(box) {
      this.min.copy(box.min);
      this.max.copy(box.max);
      return this;
    }
    makeEmpty() {
      this.min.x = this.min.y = this.min.z = Infinity;
      this.max.x = this.max.y = this.max.z = -Infinity;
      return this;
    }
    isEmpty() {
      return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    }
    getCenter(target) {
      return this.isEmpty() ? target.set(0, 0, 0) : target.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(target) {
      return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min);
    }
    expandByPoint(point) {
      this.min.min(point);
      this.max.max(point);
      return this;
    }
    expandByVector(vector) {
      this.min.sub(vector);
      this.max.add(vector);
      return this;
    }
    expandByScalar(scalar) {
      this.min.addScalar(-scalar);
      this.max.addScalar(scalar);
      return this;
    }
    expandByObject(object, precise = false) {
      object.updateWorldMatrix(false, false);
      const geometry = object.geometry;
      if (geometry !== void 0) {
        const positionAttribute = geometry.getAttribute("position");
        if (precise === true && positionAttribute !== void 0 && object.isInstancedMesh !== true) {
          for (let i = 0, l = positionAttribute.count; i < l; i++) {
            if (object.isMesh === true) {
              object.getVertexPosition(i, _vector$b);
            } else {
              _vector$b.fromBufferAttribute(positionAttribute, i);
            }
            _vector$b.applyMatrix4(object.matrixWorld);
            this.expandByPoint(_vector$b);
          }
        } else {
          if (object.boundingBox !== void 0) {
            if (object.boundingBox === null) {
              object.computeBoundingBox();
            }
            _box$4.copy(object.boundingBox);
          } else {
            if (geometry.boundingBox === null) {
              geometry.computeBoundingBox();
            }
            _box$4.copy(geometry.boundingBox);
          }
          _box$4.applyMatrix4(object.matrixWorld);
          this.union(_box$4);
        }
      }
      const children = object.children;
      for (let i = 0, l = children.length; i < l; i++) {
        this.expandByObject(children[i], precise);
      }
      return this;
    }
    containsPoint(point) {
      return point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y || point.z < this.min.z || point.z > this.max.z ? false : true;
    }
    containsBox(box) {
      return this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y && this.min.z <= box.min.z && box.max.z <= this.max.z;
    }
    getParameter(point, target) {
      return target.set(
        (point.x - this.min.x) / (this.max.x - this.min.x),
        (point.y - this.min.y) / (this.max.y - this.min.y),
        (point.z - this.min.z) / (this.max.z - this.min.z)
      );
    }
    intersectsBox(box) {
      return box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z ? false : true;
    }
    intersectsSphere(sphere) {
      this.clampPoint(sphere.center, _vector$b);
      return _vector$b.distanceToSquared(sphere.center) <= sphere.radius * sphere.radius;
    }
    intersectsPlane(plane) {
      let min, max;
      if (plane.normal.x > 0) {
        min = plane.normal.x * this.min.x;
        max = plane.normal.x * this.max.x;
      } else {
        min = plane.normal.x * this.max.x;
        max = plane.normal.x * this.min.x;
      }
      if (plane.normal.y > 0) {
        min += plane.normal.y * this.min.y;
        max += plane.normal.y * this.max.y;
      } else {
        min += plane.normal.y * this.max.y;
        max += plane.normal.y * this.min.y;
      }
      if (plane.normal.z > 0) {
        min += plane.normal.z * this.min.z;
        max += plane.normal.z * this.max.z;
      } else {
        min += plane.normal.z * this.max.z;
        max += plane.normal.z * this.min.z;
      }
      return min <= -plane.constant && max >= -plane.constant;
    }
    intersectsTriangle(triangle) {
      if (this.isEmpty()) {
        return false;
      }
      this.getCenter(_center);
      _extents.subVectors(this.max, _center);
      _v0$2.subVectors(triangle.a, _center);
      _v1$7.subVectors(triangle.b, _center);
      _v2$4.subVectors(triangle.c, _center);
      _f0.subVectors(_v1$7, _v0$2);
      _f1.subVectors(_v2$4, _v1$7);
      _f2.subVectors(_v0$2, _v2$4);
      let axes = [
        0,
        -_f0.z,
        _f0.y,
        0,
        -_f1.z,
        _f1.y,
        0,
        -_f2.z,
        _f2.y,
        _f0.z,
        0,
        -_f0.x,
        _f1.z,
        0,
        -_f1.x,
        _f2.z,
        0,
        -_f2.x,
        -_f0.y,
        _f0.x,
        0,
        -_f1.y,
        _f1.x,
        0,
        -_f2.y,
        _f2.x,
        0
      ];
      if (!satForAxes(axes, _v0$2, _v1$7, _v2$4, _extents)) {
        return false;
      }
      axes = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      if (!satForAxes(axes, _v0$2, _v1$7, _v2$4, _extents)) {
        return false;
      }
      _triangleNormal.crossVectors(_f0, _f1);
      axes = [_triangleNormal.x, _triangleNormal.y, _triangleNormal.z];
      return satForAxes(axes, _v0$2, _v1$7, _v2$4, _extents);
    }
    clampPoint(point, target) {
      return target.copy(point).clamp(this.min, this.max);
    }
    distanceToPoint(point) {
      return this.clampPoint(point, _vector$b).distanceTo(point);
    }
    getBoundingSphere(target) {
      if (this.isEmpty()) {
        target.makeEmpty();
      } else {
        this.getCenter(target.center);
        target.radius = this.getSize(_vector$b).length() * 0.5;
      }
      return target;
    }
    intersect(box) {
      this.min.max(box.min);
      this.max.min(box.max);
      if (this.isEmpty()) this.makeEmpty();
      return this;
    }
    union(box) {
      this.min.min(box.min);
      this.max.max(box.max);
      return this;
    }
    applyMatrix4(matrix) {
      if (this.isEmpty()) return this;
      _points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix);
      _points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix);
      _points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix);
      _points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix);
      _points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix);
      _points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix);
      _points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix);
      _points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix);
      this.setFromPoints(_points);
      return this;
    }
    translate(offset) {
      this.min.add(offset);
      this.max.add(offset);
      return this;
    }
    equals(box) {
      return box.min.equals(this.min) && box.max.equals(this.max);
    }
  };
  var _points = [
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3()
  ];
  var _vector$b = /* @__PURE__ */ new Vector3();
  var _box$4 = /* @__PURE__ */ new Box3();
  var _v0$2 = /* @__PURE__ */ new Vector3();
  var _v1$7 = /* @__PURE__ */ new Vector3();
  var _v2$4 = /* @__PURE__ */ new Vector3();
  var _f0 = /* @__PURE__ */ new Vector3();
  var _f1 = /* @__PURE__ */ new Vector3();
  var _f2 = /* @__PURE__ */ new Vector3();
  var _center = /* @__PURE__ */ new Vector3();
  var _extents = /* @__PURE__ */ new Vector3();
  var _triangleNormal = /* @__PURE__ */ new Vector3();
  var _testAxis = /* @__PURE__ */ new Vector3();
  function satForAxes(axes, v0, v1, v2, extents) {
    for (let i = 0, j = axes.length - 3; i <= j; i += 3) {
      _testAxis.fromArray(axes, i);
      const r = extents.x * Math.abs(_testAxis.x) + extents.y * Math.abs(_testAxis.y) + extents.z * Math.abs(_testAxis.z);
      const p0 = v0.dot(_testAxis);
      const p1 = v1.dot(_testAxis);
      const p2 = v2.dot(_testAxis);
      if (Math.max(-Math.max(p0, p1, p2), Math.min(p0, p1, p2)) > r) {
        return false;
      }
    }
    return true;
  }
  var _box$3 = /* @__PURE__ */ new Box3();
  var _v1$6 = /* @__PURE__ */ new Vector3();
  var _v2$3 = /* @__PURE__ */ new Vector3();
  var Sphere = class {
    constructor(center = new Vector3(), radius = -1) {
      this.isSphere = true;
      this.center = center;
      this.radius = radius;
    }
    set(center, radius) {
      this.center.copy(center);
      this.radius = radius;
      return this;
    }
    setFromPoints(points, optionalCenter) {
      const center = this.center;
      if (optionalCenter !== void 0) {
        center.copy(optionalCenter);
      } else {
        _box$3.setFromPoints(points).getCenter(center);
      }
      let maxRadiusSq = 0;
      for (let i = 0, il = points.length; i < il; i++) {
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
      }
      this.radius = Math.sqrt(maxRadiusSq);
      return this;
    }
    copy(sphere) {
      this.center.copy(sphere.center);
      this.radius = sphere.radius;
      return this;
    }
    isEmpty() {
      return this.radius < 0;
    }
    makeEmpty() {
      this.center.set(0, 0, 0);
      this.radius = -1;
      return this;
    }
    containsPoint(point) {
      return point.distanceToSquared(this.center) <= this.radius * this.radius;
    }
    distanceToPoint(point) {
      return point.distanceTo(this.center) - this.radius;
    }
    intersectsSphere(sphere) {
      const radiusSum = this.radius + sphere.radius;
      return sphere.center.distanceToSquared(this.center) <= radiusSum * radiusSum;
    }
    intersectsBox(box) {
      return box.intersectsSphere(this);
    }
    intersectsPlane(plane) {
      return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
    }
    clampPoint(point, target) {
      const deltaLengthSq = this.center.distanceToSquared(point);
      target.copy(point);
      if (deltaLengthSq > this.radius * this.radius) {
        target.sub(this.center).normalize();
        target.multiplyScalar(this.radius).add(this.center);
      }
      return target;
    }
    getBoundingBox(target) {
      if (this.isEmpty()) {
        target.makeEmpty();
        return target;
      }
      target.set(this.center, this.center);
      target.expandByScalar(this.radius);
      return target;
    }
    applyMatrix4(matrix) {
      this.center.applyMatrix4(matrix);
      this.radius = this.radius * matrix.getMaxScaleOnAxis();
      return this;
    }
    translate(offset) {
      this.center.add(offset);
      return this;
    }
    expandByPoint(point) {
      if (this.isEmpty()) {
        this.center.copy(point);
        this.radius = 0;
        return this;
      }
      _v1$6.subVectors(point, this.center);
      const lengthSq = _v1$6.lengthSq();
      if (lengthSq > this.radius * this.radius) {
        const length = Math.sqrt(lengthSq);
        const delta = (length - this.radius) * 0.5;
        this.center.addScaledVector(_v1$6, delta / length);
        this.radius += delta;
      }
      return this;
    }
    union(sphere) {
      if (sphere.isEmpty()) {
        return this;
      }
      if (this.isEmpty()) {
        this.copy(sphere);
        return this;
      }
      if (this.center.equals(sphere.center) === true) {
        this.radius = Math.max(this.radius, sphere.radius);
      } else {
        _v2$3.subVectors(sphere.center, this.center).setLength(sphere.radius);
        this.expandByPoint(_v1$6.copy(sphere.center).add(_v2$3));
        this.expandByPoint(_v1$6.copy(sphere.center).sub(_v2$3));
      }
      return this;
    }
    equals(sphere) {
      return sphere.center.equals(this.center) && sphere.radius === this.radius;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var _vector$a = /* @__PURE__ */ new Vector3();
  var _segCenter = /* @__PURE__ */ new Vector3();
  var _segDir = /* @__PURE__ */ new Vector3();
  var _diff = /* @__PURE__ */ new Vector3();
  var _edge1 = /* @__PURE__ */ new Vector3();
  var _edge2 = /* @__PURE__ */ new Vector3();
  var _normal$1 = /* @__PURE__ */ new Vector3();
  var Ray = class {
    constructor(origin = new Vector3(), direction = new Vector3(0, 0, -1)) {
      this.origin = origin;
      this.direction = direction;
    }
    set(origin, direction) {
      this.origin.copy(origin);
      this.direction.copy(direction);
      return this;
    }
    copy(ray) {
      this.origin.copy(ray.origin);
      this.direction.copy(ray.direction);
      return this;
    }
    at(t, target) {
      return target.copy(this.origin).addScaledVector(this.direction, t);
    }
    lookAt(v) {
      this.direction.copy(v).sub(this.origin).normalize();
      return this;
    }
    recast(t) {
      this.origin.copy(this.at(t, _vector$a));
      return this;
    }
    closestPointToPoint(point, target) {
      target.subVectors(point, this.origin);
      const directionDistance = target.dot(this.direction);
      if (directionDistance < 0) {
        return target.copy(this.origin);
      }
      return target.copy(this.origin).addScaledVector(this.direction, directionDistance);
    }
    distanceToPoint(point) {
      return Math.sqrt(this.distanceSqToPoint(point));
    }
    distanceSqToPoint(point) {
      const directionDistance = _vector$a.subVectors(point, this.origin).dot(this.direction);
      if (directionDistance < 0) {
        return this.origin.distanceToSquared(point);
      }
      _vector$a.copy(this.origin).addScaledVector(this.direction, directionDistance);
      return _vector$a.distanceToSquared(point);
    }
    distanceSqToSegment(v0, v1, optionalPointOnRay, optionalPointOnSegment) {
      _segCenter.copy(v0).add(v1).multiplyScalar(0.5);
      _segDir.copy(v1).sub(v0).normalize();
      _diff.copy(this.origin).sub(_segCenter);
      const segExtent = v0.distanceTo(v1) * 0.5;
      const a01 = -this.direction.dot(_segDir);
      const b0 = _diff.dot(this.direction);
      const b1 = -_diff.dot(_segDir);
      const c = _diff.lengthSq();
      const det = Math.abs(1 - a01 * a01);
      let s0, s1, sqrDist, extDet;
      if (det > 0) {
        s0 = a01 * b1 - b0;
        s1 = a01 * b0 - b1;
        extDet = segExtent * det;
        if (s0 >= 0) {
          if (s1 >= -extDet) {
            if (s1 <= extDet) {
              const invDet = 1 / det;
              s0 *= invDet;
              s1 *= invDet;
              sqrDist = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c;
            } else {
              s1 = segExtent;
              s0 = Math.max(0, -(a01 * s1 + b0));
              sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
            }
          } else {
            s1 = -segExtent;
            s0 = Math.max(0, -(a01 * s1 + b0));
            sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
          }
        } else {
          if (s1 <= -extDet) {
            s0 = Math.max(0, -(-a01 * segExtent + b0));
            s1 = s0 > 0 ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
            sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
          } else if (s1 <= extDet) {
            s0 = 0;
            s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
            sqrDist = s1 * (s1 + 2 * b1) + c;
          } else {
            s0 = Math.max(0, -(a01 * segExtent + b0));
            s1 = s0 > 0 ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
            sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
          }
        }
      } else {
        s1 = a01 > 0 ? -segExtent : segExtent;
        s0 = Math.max(0, -(a01 * s1 + b0));
        sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
      }
      if (optionalPointOnRay) {
        optionalPointOnRay.copy(this.origin).addScaledVector(this.direction, s0);
      }
      if (optionalPointOnSegment) {
        optionalPointOnSegment.copy(_segCenter).addScaledVector(_segDir, s1);
      }
      return sqrDist;
    }
    intersectSphere(sphere, target) {
      _vector$a.subVectors(sphere.center, this.origin);
      const tca = _vector$a.dot(this.direction);
      const d2 = _vector$a.dot(_vector$a) - tca * tca;
      const radius2 = sphere.radius * sphere.radius;
      if (d2 > radius2) return null;
      const thc = Math.sqrt(radius2 - d2);
      const t0 = tca - thc;
      const t1 = tca + thc;
      if (t1 < 0) return null;
      if (t0 < 0) return this.at(t1, target);
      return this.at(t0, target);
    }
    intersectsSphere(sphere) {
      return this.distanceSqToPoint(sphere.center) <= sphere.radius * sphere.radius;
    }
    distanceToPlane(plane) {
      const denominator = plane.normal.dot(this.direction);
      if (denominator === 0) {
        if (plane.distanceToPoint(this.origin) === 0) {
          return 0;
        }
        return null;
      }
      const t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;
      return t >= 0 ? t : null;
    }
    intersectPlane(plane, target) {
      const t = this.distanceToPlane(plane);
      if (t === null) {
        return null;
      }
      return this.at(t, target);
    }
    intersectsPlane(plane) {
      const distToPoint = plane.distanceToPoint(this.origin);
      if (distToPoint === 0) {
        return true;
      }
      const denominator = plane.normal.dot(this.direction);
      if (denominator * distToPoint < 0) {
        return true;
      }
      return false;
    }
    intersectBox(box, target) {
      let tmin, tmax, tymin, tymax, tzmin, tzmax;
      const invdirx = 1 / this.direction.x, invdiry = 1 / this.direction.y, invdirz = 1 / this.direction.z;
      const origin = this.origin;
      if (invdirx >= 0) {
        tmin = (box.min.x - origin.x) * invdirx;
        tmax = (box.max.x - origin.x) * invdirx;
      } else {
        tmin = (box.max.x - origin.x) * invdirx;
        tmax = (box.min.x - origin.x) * invdirx;
      }
      if (invdiry >= 0) {
        tymin = (box.min.y - origin.y) * invdiry;
        tymax = (box.max.y - origin.y) * invdiry;
      } else {
        tymin = (box.max.y - origin.y) * invdiry;
        tymax = (box.min.y - origin.y) * invdiry;
      }
      if (tmin > tymax || tymin > tmax) return null;
      if (tymin > tmin || isNaN(tmin)) tmin = tymin;
      if (tymax < tmax || isNaN(tmax)) tmax = tymax;
      if (invdirz >= 0) {
        tzmin = (box.min.z - origin.z) * invdirz;
        tzmax = (box.max.z - origin.z) * invdirz;
      } else {
        tzmin = (box.max.z - origin.z) * invdirz;
        tzmax = (box.min.z - origin.z) * invdirz;
      }
      if (tmin > tzmax || tzmin > tmax) return null;
      if (tzmin > tmin || tmin !== tmin) tmin = tzmin;
      if (tzmax < tmax || tmax !== tmax) tmax = tzmax;
      if (tmax < 0) return null;
      return this.at(tmin >= 0 ? tmin : tmax, target);
    }
    intersectsBox(box) {
      return this.intersectBox(box, _vector$a) !== null;
    }
    intersectTriangle(a, b, c, backfaceCulling, target) {
      _edge1.subVectors(b, a);
      _edge2.subVectors(c, a);
      _normal$1.crossVectors(_edge1, _edge2);
      let DdN = this.direction.dot(_normal$1);
      let sign;
      if (DdN > 0) {
        if (backfaceCulling) return null;
        sign = 1;
      } else if (DdN < 0) {
        sign = -1;
        DdN = -DdN;
      } else {
        return null;
      }
      _diff.subVectors(this.origin, a);
      const DdQxE2 = sign * this.direction.dot(_edge2.crossVectors(_diff, _edge2));
      if (DdQxE2 < 0) {
        return null;
      }
      const DdE1xQ = sign * this.direction.dot(_edge1.cross(_diff));
      if (DdE1xQ < 0) {
        return null;
      }
      if (DdQxE2 + DdE1xQ > DdN) {
        return null;
      }
      const QdN = -sign * _diff.dot(_normal$1);
      if (QdN < 0) {
        return null;
      }
      return this.at(QdN / DdN, target);
    }
    applyMatrix4(matrix4) {
      this.origin.applyMatrix4(matrix4);
      this.direction.transformDirection(matrix4);
      return this;
    }
    equals(ray) {
      return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var Matrix4 = class _Matrix4 {
    constructor(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
      _Matrix4.prototype.isMatrix4 = true;
      this.elements = [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ];
      if (n11 !== void 0) {
        this.set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
      }
    }
    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
      const te = this.elements;
      te[0] = n11;
      te[4] = n12;
      te[8] = n13;
      te[12] = n14;
      te[1] = n21;
      te[5] = n22;
      te[9] = n23;
      te[13] = n24;
      te[2] = n31;
      te[6] = n32;
      te[10] = n33;
      te[14] = n34;
      te[3] = n41;
      te[7] = n42;
      te[11] = n43;
      te[15] = n44;
      return this;
    }
    identity() {
      this.set(
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    clone() {
      return new _Matrix4().fromArray(this.elements);
    }
    copy(m) {
      const te = this.elements;
      const me = m.elements;
      te[0] = me[0];
      te[1] = me[1];
      te[2] = me[2];
      te[3] = me[3];
      te[4] = me[4];
      te[5] = me[5];
      te[6] = me[6];
      te[7] = me[7];
      te[8] = me[8];
      te[9] = me[9];
      te[10] = me[10];
      te[11] = me[11];
      te[12] = me[12];
      te[13] = me[13];
      te[14] = me[14];
      te[15] = me[15];
      return this;
    }
    copyPosition(m) {
      const te = this.elements, me = m.elements;
      te[12] = me[12];
      te[13] = me[13];
      te[14] = me[14];
      return this;
    }
    setFromMatrix3(m) {
      const me = m.elements;
      this.set(
        me[0],
        me[3],
        me[6],
        0,
        me[1],
        me[4],
        me[7],
        0,
        me[2],
        me[5],
        me[8],
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    extractBasis(xAxis, yAxis, zAxis) {
      xAxis.setFromMatrixColumn(this, 0);
      yAxis.setFromMatrixColumn(this, 1);
      zAxis.setFromMatrixColumn(this, 2);
      return this;
    }
    makeBasis(xAxis, yAxis, zAxis) {
      this.set(
        xAxis.x,
        yAxis.x,
        zAxis.x,
        0,
        xAxis.y,
        yAxis.y,
        zAxis.y,
        0,
        xAxis.z,
        yAxis.z,
        zAxis.z,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    extractRotation(m) {
      const te = this.elements;
      const me = m.elements;
      const scaleX = 1 / _v1$5.setFromMatrixColumn(m, 0).length();
      const scaleY = 1 / _v1$5.setFromMatrixColumn(m, 1).length();
      const scaleZ = 1 / _v1$5.setFromMatrixColumn(m, 2).length();
      te[0] = me[0] * scaleX;
      te[1] = me[1] * scaleX;
      te[2] = me[2] * scaleX;
      te[3] = 0;
      te[4] = me[4] * scaleY;
      te[5] = me[5] * scaleY;
      te[6] = me[6] * scaleY;
      te[7] = 0;
      te[8] = me[8] * scaleZ;
      te[9] = me[9] * scaleZ;
      te[10] = me[10] * scaleZ;
      te[11] = 0;
      te[12] = 0;
      te[13] = 0;
      te[14] = 0;
      te[15] = 1;
      return this;
    }
    makeRotationFromEuler(euler) {
      const te = this.elements;
      const x = euler.x, y = euler.y, z = euler.z;
      const a = Math.cos(x), b = Math.sin(x);
      const c = Math.cos(y), d = Math.sin(y);
      const e = Math.cos(z), f = Math.sin(z);
      if (euler.order === "XYZ") {
        const ae = a * e, af = a * f, be = b * e, bf = b * f;
        te[0] = c * e;
        te[4] = -c * f;
        te[8] = d;
        te[1] = af + be * d;
        te[5] = ae - bf * d;
        te[9] = -b * c;
        te[2] = bf - ae * d;
        te[6] = be + af * d;
        te[10] = a * c;
      } else if (euler.order === "YXZ") {
        const ce = c * e, cf = c * f, de = d * e, df = d * f;
        te[0] = ce + df * b;
        te[4] = de * b - cf;
        te[8] = a * d;
        te[1] = a * f;
        te[5] = a * e;
        te[9] = -b;
        te[2] = cf * b - de;
        te[6] = df + ce * b;
        te[10] = a * c;
      } else if (euler.order === "ZXY") {
        const ce = c * e, cf = c * f, de = d * e, df = d * f;
        te[0] = ce - df * b;
        te[4] = -a * f;
        te[8] = de + cf * b;
        te[1] = cf + de * b;
        te[5] = a * e;
        te[9] = df - ce * b;
        te[2] = -a * d;
        te[6] = b;
        te[10] = a * c;
      } else if (euler.order === "ZYX") {
        const ae = a * e, af = a * f, be = b * e, bf = b * f;
        te[0] = c * e;
        te[4] = be * d - af;
        te[8] = ae * d + bf;
        te[1] = c * f;
        te[5] = bf * d + ae;
        te[9] = af * d - be;
        te[2] = -d;
        te[6] = b * c;
        te[10] = a * c;
      } else if (euler.order === "YZX") {
        const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
        te[0] = c * e;
        te[4] = bd - ac * f;
        te[8] = bc * f + ad;
        te[1] = f;
        te[5] = a * e;
        te[9] = -b * e;
        te[2] = -d * e;
        te[6] = ad * f + bc;
        te[10] = ac - bd * f;
      } else if (euler.order === "XZY") {
        const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
        te[0] = c * e;
        te[4] = -f;
        te[8] = d * e;
        te[1] = ac * f + bd;
        te[5] = a * e;
        te[9] = ad * f - bc;
        te[2] = bc * f - ad;
        te[6] = b * e;
        te[10] = bd * f + ac;
      }
      te[3] = 0;
      te[7] = 0;
      te[11] = 0;
      te[12] = 0;
      te[13] = 0;
      te[14] = 0;
      te[15] = 1;
      return this;
    }
    makeRotationFromQuaternion(q) {
      return this.compose(_zero, q, _one);
    }
    lookAt(eye, target, up) {
      const te = this.elements;
      _z.subVectors(eye, target);
      if (_z.lengthSq() === 0) {
        _z.z = 1;
      }
      _z.normalize();
      _x.crossVectors(up, _z);
      if (_x.lengthSq() === 0) {
        if (Math.abs(up.z) === 1) {
          _z.x += 1e-4;
        } else {
          _z.z += 1e-4;
        }
        _z.normalize();
        _x.crossVectors(up, _z);
      }
      _x.normalize();
      _y.crossVectors(_z, _x);
      te[0] = _x.x;
      te[4] = _y.x;
      te[8] = _z.x;
      te[1] = _x.y;
      te[5] = _y.y;
      te[9] = _z.y;
      te[2] = _x.z;
      te[6] = _y.z;
      te[10] = _z.z;
      return this;
    }
    multiply(m) {
      return this.multiplyMatrices(this, m);
    }
    premultiply(m) {
      return this.multiplyMatrices(m, this);
    }
    multiplyMatrices(a, b) {
      const ae = a.elements;
      const be = b.elements;
      const te = this.elements;
      const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
      const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
      const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
      const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
      const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
      const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
      const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
      const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
      te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
      te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
      te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
      te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
      te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
      te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
      te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
      te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
      te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
      te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
      te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
      te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
      te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
      te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
      te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
      te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
      return this;
    }
    multiplyScalar(s) {
      const te = this.elements;
      te[0] *= s;
      te[4] *= s;
      te[8] *= s;
      te[12] *= s;
      te[1] *= s;
      te[5] *= s;
      te[9] *= s;
      te[13] *= s;
      te[2] *= s;
      te[6] *= s;
      te[10] *= s;
      te[14] *= s;
      te[3] *= s;
      te[7] *= s;
      te[11] *= s;
      te[15] *= s;
      return this;
    }
    determinant() {
      const te = this.elements;
      const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
      const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
      const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
      const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
      return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
    }
    transpose() {
      const te = this.elements;
      let tmp;
      tmp = te[1];
      te[1] = te[4];
      te[4] = tmp;
      tmp = te[2];
      te[2] = te[8];
      te[8] = tmp;
      tmp = te[6];
      te[6] = te[9];
      te[9] = tmp;
      tmp = te[3];
      te[3] = te[12];
      te[12] = tmp;
      tmp = te[7];
      te[7] = te[13];
      te[13] = tmp;
      tmp = te[11];
      te[11] = te[14];
      te[14] = tmp;
      return this;
    }
    setPosition(x, y, z) {
      const te = this.elements;
      if (x.isVector3) {
        te[12] = x.x;
        te[13] = x.y;
        te[14] = x.z;
      } else {
        te[12] = x;
        te[13] = y;
        te[14] = z;
      }
      return this;
    }
    invert() {
      const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3], n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7], n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11], n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15], t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44, t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44, t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44, t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
      const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
      if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      const detInv = 1 / det;
      te[0] = t11 * detInv;
      te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
      te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
      te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
      te[4] = t12 * detInv;
      te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
      te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
      te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
      te[8] = t13 * detInv;
      te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
      te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
      te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
      te[12] = t14 * detInv;
      te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
      te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
      te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
      return this;
    }
    scale(v) {
      const te = this.elements;
      const x = v.x, y = v.y, z = v.z;
      te[0] *= x;
      te[4] *= y;
      te[8] *= z;
      te[1] *= x;
      te[5] *= y;
      te[9] *= z;
      te[2] *= x;
      te[6] *= y;
      te[10] *= z;
      te[3] *= x;
      te[7] *= y;
      te[11] *= z;
      return this;
    }
    getMaxScaleOnAxis() {
      const te = this.elements;
      const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
      const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
      const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
      return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
    }
    makeTranslation(x, y, z) {
      if (x.isVector3) {
        this.set(
          1,
          0,
          0,
          x.x,
          0,
          1,
          0,
          x.y,
          0,
          0,
          1,
          x.z,
          0,
          0,
          0,
          1
        );
      } else {
        this.set(
          1,
          0,
          0,
          x,
          0,
          1,
          0,
          y,
          0,
          0,
          1,
          z,
          0,
          0,
          0,
          1
        );
      }
      return this;
    }
    makeRotationX(theta) {
      const c = Math.cos(theta), s = Math.sin(theta);
      this.set(
        1,
        0,
        0,
        0,
        0,
        c,
        -s,
        0,
        0,
        s,
        c,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    makeRotationY(theta) {
      const c = Math.cos(theta), s = Math.sin(theta);
      this.set(
        c,
        0,
        s,
        0,
        0,
        1,
        0,
        0,
        -s,
        0,
        c,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    makeRotationZ(theta) {
      const c = Math.cos(theta), s = Math.sin(theta);
      this.set(
        c,
        -s,
        0,
        0,
        s,
        c,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    makeRotationAxis(axis, angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const t = 1 - c;
      const x = axis.x, y = axis.y, z = axis.z;
      const tx = t * x, ty = t * y;
      this.set(
        tx * x + c,
        tx * y - s * z,
        tx * z + s * y,
        0,
        tx * y + s * z,
        ty * y + c,
        ty * z - s * x,
        0,
        tx * z - s * y,
        ty * z + s * x,
        t * z * z + c,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    makeScale(x, y, z) {
      this.set(
        x,
        0,
        0,
        0,
        0,
        y,
        0,
        0,
        0,
        0,
        z,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    makeShear(xy, xz, yx, yz, zx, zy) {
      this.set(
        1,
        yx,
        zx,
        0,
        xy,
        1,
        zy,
        0,
        xz,
        yz,
        1,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    compose(position, quaternion, scale) {
      const te = this.elements;
      const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
      const x2 = x + x, y2 = y + y, z2 = z + z;
      const xx = x * x2, xy = x * y2, xz = x * z2;
      const yy = y * y2, yz = y * z2, zz = z * z2;
      const wx = w * x2, wy = w * y2, wz = w * z2;
      const sx = scale.x, sy = scale.y, sz = scale.z;
      te[0] = (1 - (yy + zz)) * sx;
      te[1] = (xy + wz) * sx;
      te[2] = (xz - wy) * sx;
      te[3] = 0;
      te[4] = (xy - wz) * sy;
      te[5] = (1 - (xx + zz)) * sy;
      te[6] = (yz + wx) * sy;
      te[7] = 0;
      te[8] = (xz + wy) * sz;
      te[9] = (yz - wx) * sz;
      te[10] = (1 - (xx + yy)) * sz;
      te[11] = 0;
      te[12] = position.x;
      te[13] = position.y;
      te[14] = position.z;
      te[15] = 1;
      return this;
    }
    decompose(position, quaternion, scale) {
      const te = this.elements;
      let sx = _v1$5.set(te[0], te[1], te[2]).length();
      const sy = _v1$5.set(te[4], te[5], te[6]).length();
      const sz = _v1$5.set(te[8], te[9], te[10]).length();
      const det = this.determinant();
      if (det < 0) sx = -sx;
      position.x = te[12];
      position.y = te[13];
      position.z = te[14];
      _m1$2.copy(this);
      const invSX = 1 / sx;
      const invSY = 1 / sy;
      const invSZ = 1 / sz;
      _m1$2.elements[0] *= invSX;
      _m1$2.elements[1] *= invSX;
      _m1$2.elements[2] *= invSX;
      _m1$2.elements[4] *= invSY;
      _m1$2.elements[5] *= invSY;
      _m1$2.elements[6] *= invSY;
      _m1$2.elements[8] *= invSZ;
      _m1$2.elements[9] *= invSZ;
      _m1$2.elements[10] *= invSZ;
      quaternion.setFromRotationMatrix(_m1$2);
      scale.x = sx;
      scale.y = sy;
      scale.z = sz;
      return this;
    }
    makePerspective(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
      const te = this.elements;
      const x = 2 * near / (right - left);
      const y = 2 * near / (top - bottom);
      const a = (right + left) / (right - left);
      const b = (top + bottom) / (top - bottom);
      let c, d;
      if (coordinateSystem === WebGLCoordinateSystem) {
        c = -(far + near) / (far - near);
        d = -2 * far * near / (far - near);
      } else if (coordinateSystem === WebGPUCoordinateSystem) {
        c = -far / (far - near);
        d = -far * near / (far - near);
      } else {
        throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + coordinateSystem);
      }
      te[0] = x;
      te[4] = 0;
      te[8] = a;
      te[12] = 0;
      te[1] = 0;
      te[5] = y;
      te[9] = b;
      te[13] = 0;
      te[2] = 0;
      te[6] = 0;
      te[10] = c;
      te[14] = d;
      te[3] = 0;
      te[7] = 0;
      te[11] = -1;
      te[15] = 0;
      return this;
    }
    makeOrthographic(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
      const te = this.elements;
      const w = 1 / (right - left);
      const h = 1 / (top - bottom);
      const p = 1 / (far - near);
      const x = (right + left) * w;
      const y = (top + bottom) * h;
      let z, zInv;
      if (coordinateSystem === WebGLCoordinateSystem) {
        z = (far + near) * p;
        zInv = -2 * p;
      } else if (coordinateSystem === WebGPUCoordinateSystem) {
        z = near * p;
        zInv = -1 * p;
      } else {
        throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + coordinateSystem);
      }
      te[0] = 2 * w;
      te[4] = 0;
      te[8] = 0;
      te[12] = -x;
      te[1] = 0;
      te[5] = 2 * h;
      te[9] = 0;
      te[13] = -y;
      te[2] = 0;
      te[6] = 0;
      te[10] = zInv;
      te[14] = -z;
      te[3] = 0;
      te[7] = 0;
      te[11] = 0;
      te[15] = 1;
      return this;
    }
    equals(matrix) {
      const te = this.elements;
      const me = matrix.elements;
      for (let i = 0; i < 16; i++) {
        if (te[i] !== me[i]) return false;
      }
      return true;
    }
    fromArray(array, offset = 0) {
      for (let i = 0; i < 16; i++) {
        this.elements[i] = array[i + offset];
      }
      return this;
    }
    toArray(array = [], offset = 0) {
      const te = this.elements;
      array[offset] = te[0];
      array[offset + 1] = te[1];
      array[offset + 2] = te[2];
      array[offset + 3] = te[3];
      array[offset + 4] = te[4];
      array[offset + 5] = te[5];
      array[offset + 6] = te[6];
      array[offset + 7] = te[7];
      array[offset + 8] = te[8];
      array[offset + 9] = te[9];
      array[offset + 10] = te[10];
      array[offset + 11] = te[11];
      array[offset + 12] = te[12];
      array[offset + 13] = te[13];
      array[offset + 14] = te[14];
      array[offset + 15] = te[15];
      return array;
    }
  };
  var _v1$5 = /* @__PURE__ */ new Vector3();
  var _m1$2 = /* @__PURE__ */ new Matrix4();
  var _zero = /* @__PURE__ */ new Vector3(0, 0, 0);
  var _one = /* @__PURE__ */ new Vector3(1, 1, 1);
  var _x = /* @__PURE__ */ new Vector3();
  var _y = /* @__PURE__ */ new Vector3();
  var _z = /* @__PURE__ */ new Vector3();
  var _matrix$1 = /* @__PURE__ */ new Matrix4();
  var _quaternion$3 = /* @__PURE__ */ new Quaternion();
  var Euler = class _Euler {
    constructor(x = 0, y = 0, z = 0, order = _Euler.DEFAULT_ORDER) {
      this.isEuler = true;
      this._x = x;
      this._y = y;
      this._z = z;
      this._order = order;
    }
    get x() {
      return this._x;
    }
    set x(value) {
      this._x = value;
      this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(value) {
      this._y = value;
      this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(value) {
      this._z = value;
      this._onChangeCallback();
    }
    get order() {
      return this._order;
    }
    set order(value) {
      this._order = value;
      this._onChangeCallback();
    }
    set(x, y, z, order = this._order) {
      this._x = x;
      this._y = y;
      this._z = z;
      this._order = order;
      this._onChangeCallback();
      return this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._order);
    }
    copy(euler) {
      this._x = euler._x;
      this._y = euler._y;
      this._z = euler._z;
      this._order = euler._order;
      this._onChangeCallback();
      return this;
    }
    setFromRotationMatrix(m, order = this._order, update = true) {
      const te = m.elements;
      const m11 = te[0], m12 = te[4], m13 = te[8];
      const m21 = te[1], m22 = te[5], m23 = te[9];
      const m31 = te[2], m32 = te[6], m33 = te[10];
      switch (order) {
        case "XYZ":
          this._y = Math.asin(clamp(m13, -1, 1));
          if (Math.abs(m13) < 0.9999999) {
            this._x = Math.atan2(-m23, m33);
            this._z = Math.atan2(-m12, m11);
          } else {
            this._x = Math.atan2(m32, m22);
            this._z = 0;
          }
          break;
        case "YXZ":
          this._x = Math.asin(-clamp(m23, -1, 1));
          if (Math.abs(m23) < 0.9999999) {
            this._y = Math.atan2(m13, m33);
            this._z = Math.atan2(m21, m22);
          } else {
            this._y = Math.atan2(-m31, m11);
            this._z = 0;
          }
          break;
        case "ZXY":
          this._x = Math.asin(clamp(m32, -1, 1));
          if (Math.abs(m32) < 0.9999999) {
            this._y = Math.atan2(-m31, m33);
            this._z = Math.atan2(-m12, m22);
          } else {
            this._y = 0;
            this._z = Math.atan2(m21, m11);
          }
          break;
        case "ZYX":
          this._y = Math.asin(-clamp(m31, -1, 1));
          if (Math.abs(m31) < 0.9999999) {
            this._x = Math.atan2(m32, m33);
            this._z = Math.atan2(m21, m11);
          } else {
            this._x = 0;
            this._z = Math.atan2(-m12, m22);
          }
          break;
        case "YZX":
          this._z = Math.asin(clamp(m21, -1, 1));
          if (Math.abs(m21) < 0.9999999) {
            this._x = Math.atan2(-m23, m22);
            this._y = Math.atan2(-m31, m11);
          } else {
            this._x = 0;
            this._y = Math.atan2(m13, m33);
          }
          break;
        case "XZY":
          this._z = Math.asin(-clamp(m12, -1, 1));
          if (Math.abs(m12) < 0.9999999) {
            this._x = Math.atan2(m32, m22);
            this._y = Math.atan2(m13, m11);
          } else {
            this._x = Math.atan2(-m23, m33);
            this._y = 0;
          }
          break;
        default:
          console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + order);
      }
      this._order = order;
      if (update === true) this._onChangeCallback();
      return this;
    }
    setFromQuaternion(q, order, update) {
      _matrix$1.makeRotationFromQuaternion(q);
      return this.setFromRotationMatrix(_matrix$1, order, update);
    }
    setFromVector3(v, order = this._order) {
      return this.set(v.x, v.y, v.z, order);
    }
    reorder(newOrder) {
      _quaternion$3.setFromEuler(this);
      return this.setFromQuaternion(_quaternion$3, newOrder);
    }
    equals(euler) {
      return euler._x === this._x && euler._y === this._y && euler._z === this._z && euler._order === this._order;
    }
    fromArray(array) {
      this._x = array[0];
      this._y = array[1];
      this._z = array[2];
      if (array[3] !== void 0) this._order = array[3];
      this._onChangeCallback();
      return this;
    }
    toArray(array = [], offset = 0) {
      array[offset] = this._x;
      array[offset + 1] = this._y;
      array[offset + 2] = this._z;
      array[offset + 3] = this._order;
      return array;
    }
    _onChange(callback) {
      this._onChangeCallback = callback;
      return this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x;
      yield this._y;
      yield this._z;
      yield this._order;
    }
  };
  Euler.DEFAULT_ORDER = "XYZ";
  var Layers = class {
    constructor() {
      this.mask = 1 | 0;
    }
    set(channel) {
      this.mask = (1 << channel | 0) >>> 0;
    }
    enable(channel) {
      this.mask |= 1 << channel | 0;
    }
    enableAll() {
      this.mask = 4294967295 | 0;
    }
    toggle(channel) {
      this.mask ^= 1 << channel | 0;
    }
    disable(channel) {
      this.mask &= ~(1 << channel | 0);
    }
    disableAll() {
      this.mask = 0;
    }
    test(layers) {
      return (this.mask & layers.mask) !== 0;
    }
    isEnabled(channel) {
      return (this.mask & (1 << channel | 0)) !== 0;
    }
  };
  var _object3DId = 0;
  var _v1$4 = /* @__PURE__ */ new Vector3();
  var _q1 = /* @__PURE__ */ new Quaternion();
  var _m1$1 = /* @__PURE__ */ new Matrix4();
  var _target = /* @__PURE__ */ new Vector3();
  var _position$3 = /* @__PURE__ */ new Vector3();
  var _scale$2 = /* @__PURE__ */ new Vector3();
  var _quaternion$2 = /* @__PURE__ */ new Quaternion();
  var _xAxis = /* @__PURE__ */ new Vector3(1, 0, 0);
  var _yAxis = /* @__PURE__ */ new Vector3(0, 1, 0);
  var _zAxis = /* @__PURE__ */ new Vector3(0, 0, 1);
  var _addedEvent = { type: "added" };
  var _removedEvent = { type: "removed" };
  var Object3D = class _Object3D extends EventDispatcher {
    constructor() {
      super();
      this.isObject3D = true;
      Object.defineProperty(this, "id", { value: _object3DId++ });
      this.uuid = generateUUID();
      this.name = "";
      this.type = "Object3D";
      this.parent = null;
      this.children = [];
      this.up = _Object3D.DEFAULT_UP.clone();
      const position = new Vector3();
      const rotation = new Euler();
      const quaternion = new Quaternion();
      const scale = new Vector3(1, 1, 1);
      function onRotationChange() {
        quaternion.setFromEuler(rotation, false);
      }
      function onQuaternionChange() {
        rotation.setFromQuaternion(quaternion, void 0, false);
      }
      rotation._onChange(onRotationChange);
      quaternion._onChange(onQuaternionChange);
      Object.defineProperties(this, {
        position: {
          configurable: true,
          enumerable: true,
          value: position
        },
        rotation: {
          configurable: true,
          enumerable: true,
          value: rotation
        },
        quaternion: {
          configurable: true,
          enumerable: true,
          value: quaternion
        },
        scale: {
          configurable: true,
          enumerable: true,
          value: scale
        },
        modelViewMatrix: {
          value: new Matrix4()
        },
        normalMatrix: {
          value: new Matrix3()
        }
      });
      this.matrix = new Matrix4();
      this.matrixWorld = new Matrix4();
      this.matrixAutoUpdate = _Object3D.DEFAULT_MATRIX_AUTO_UPDATE;
      this.matrixWorldAutoUpdate = _Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE;
      this.matrixWorldNeedsUpdate = false;
      this.layers = new Layers();
      this.visible = true;
      this.castShadow = false;
      this.receiveShadow = false;
      this.frustumCulled = true;
      this.renderOrder = 0;
      this.animations = [];
      this.userData = {};
    }
    onBeforeShadow() {
    }
    onAfterShadow() {
    }
    onBeforeRender() {
    }
    onAfterRender() {
    }
    applyMatrix4(matrix) {
      if (this.matrixAutoUpdate) this.updateMatrix();
      this.matrix.premultiply(matrix);
      this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    applyQuaternion(q) {
      this.quaternion.premultiply(q);
      return this;
    }
    setRotationFromAxisAngle(axis, angle) {
      this.quaternion.setFromAxisAngle(axis, angle);
    }
    setRotationFromEuler(euler) {
      this.quaternion.setFromEuler(euler, true);
    }
    setRotationFromMatrix(m) {
      this.quaternion.setFromRotationMatrix(m);
    }
    setRotationFromQuaternion(q) {
      this.quaternion.copy(q);
    }
    rotateOnAxis(axis, angle) {
      _q1.setFromAxisAngle(axis, angle);
      this.quaternion.multiply(_q1);
      return this;
    }
    rotateOnWorldAxis(axis, angle) {
      _q1.setFromAxisAngle(axis, angle);
      this.quaternion.premultiply(_q1);
      return this;
    }
    rotateX(angle) {
      return this.rotateOnAxis(_xAxis, angle);
    }
    rotateY(angle) {
      return this.rotateOnAxis(_yAxis, angle);
    }
    rotateZ(angle) {
      return this.rotateOnAxis(_zAxis, angle);
    }
    translateOnAxis(axis, distance) {
      _v1$4.copy(axis).applyQuaternion(this.quaternion);
      this.position.add(_v1$4.multiplyScalar(distance));
      return this;
    }
    translateX(distance) {
      return this.translateOnAxis(_xAxis, distance);
    }
    translateY(distance) {
      return this.translateOnAxis(_yAxis, distance);
    }
    translateZ(distance) {
      return this.translateOnAxis(_zAxis, distance);
    }
    localToWorld(vector) {
      this.updateWorldMatrix(true, false);
      return vector.applyMatrix4(this.matrixWorld);
    }
    worldToLocal(vector) {
      this.updateWorldMatrix(true, false);
      return vector.applyMatrix4(_m1$1.copy(this.matrixWorld).invert());
    }
    lookAt(x, y, z) {
      if (x.isVector3) {
        _target.copy(x);
      } else {
        _target.set(x, y, z);
      }
      const parent = this.parent;
      this.updateWorldMatrix(true, false);
      _position$3.setFromMatrixPosition(this.matrixWorld);
      if (this.isCamera || this.isLight) {
        _m1$1.lookAt(_position$3, _target, this.up);
      } else {
        _m1$1.lookAt(_target, _position$3, this.up);
      }
      this.quaternion.setFromRotationMatrix(_m1$1);
      if (parent) {
        _m1$1.extractRotation(parent.matrixWorld);
        _q1.setFromRotationMatrix(_m1$1);
        this.quaternion.premultiply(_q1.invert());
      }
    }
    add(object) {
      if (arguments.length > 1) {
        for (let i = 0; i < arguments.length; i++) {
          this.add(arguments[i]);
        }
        return this;
      }
      if (object === this) {
        console.error("THREE.Object3D.add: object can't be added as a child of itself.", object);
        return this;
      }
      if (object && object.isObject3D) {
        if (object.parent !== null) {
          object.parent.remove(object);
        }
        object.parent = this;
        this.children.push(object);
        object.dispatchEvent(_addedEvent);
      } else {
        console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object);
      }
      return this;
    }
    remove(object) {
      if (arguments.length > 1) {
        for (let i = 0; i < arguments.length; i++) {
          this.remove(arguments[i]);
        }
        return this;
      }
      const index = this.children.indexOf(object);
      if (index !== -1) {
        object.parent = null;
        this.children.splice(index, 1);
        object.dispatchEvent(_removedEvent);
      }
      return this;
    }
    removeFromParent() {
      const parent = this.parent;
      if (parent !== null) {
        parent.remove(this);
      }
      return this;
    }
    clear() {
      return this.remove(...this.children);
    }
    attach(object) {
      this.updateWorldMatrix(true, false);
      _m1$1.copy(this.matrixWorld).invert();
      if (object.parent !== null) {
        object.parent.updateWorldMatrix(true, false);
        _m1$1.multiply(object.parent.matrixWorld);
      }
      object.applyMatrix4(_m1$1);
      this.add(object);
      object.updateWorldMatrix(false, true);
      return this;
    }
    getObjectById(id) {
      return this.getObjectByProperty("id", id);
    }
    getObjectByName(name) {
      return this.getObjectByProperty("name", name);
    }
    getObjectByProperty(name, value) {
      if (this[name] === value) return this;
      for (let i = 0, l = this.children.length; i < l; i++) {
        const child = this.children[i];
        const object = child.getObjectByProperty(name, value);
        if (object !== void 0) {
          return object;
        }
      }
      return void 0;
    }
    getObjectsByProperty(name, value, result = []) {
      if (this[name] === value) result.push(this);
      const children = this.children;
      for (let i = 0, l = children.length; i < l; i++) {
        children[i].getObjectsByProperty(name, value, result);
      }
      return result;
    }
    getWorldPosition(target) {
      this.updateWorldMatrix(true, false);
      return target.setFromMatrixPosition(this.matrixWorld);
    }
    getWorldQuaternion(target) {
      this.updateWorldMatrix(true, false);
      this.matrixWorld.decompose(_position$3, target, _scale$2);
      return target;
    }
    getWorldScale(target) {
      this.updateWorldMatrix(true, false);
      this.matrixWorld.decompose(_position$3, _quaternion$2, target);
      return target;
    }
    getWorldDirection(target) {
      this.updateWorldMatrix(true, false);
      const e = this.matrixWorld.elements;
      return target.set(e[8], e[9], e[10]).normalize();
    }
    raycast() {
    }
    traverse(callback) {
      callback(this);
      const children = this.children;
      for (let i = 0, l = children.length; i < l; i++) {
        children[i].traverse(callback);
      }
    }
    traverseVisible(callback) {
      if (this.visible === false) return;
      callback(this);
      const children = this.children;
      for (let i = 0, l = children.length; i < l; i++) {
        children[i].traverseVisible(callback);
      }
    }
    traverseAncestors(callback) {
      const parent = this.parent;
      if (parent !== null) {
        callback(parent);
        parent.traverseAncestors(callback);
      }
    }
    updateMatrix() {
      this.matrix.compose(this.position, this.quaternion, this.scale);
      this.matrixWorldNeedsUpdate = true;
    }
    updateMatrixWorld(force) {
      if (this.matrixAutoUpdate) this.updateMatrix();
      if (this.matrixWorldNeedsUpdate || force) {
        if (this.parent === null) {
          this.matrixWorld.copy(this.matrix);
        } else {
          this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
        }
        this.matrixWorldNeedsUpdate = false;
        force = true;
      }
      const children = this.children;
      for (let i = 0, l = children.length; i < l; i++) {
        const child = children[i];
        if (child.matrixWorldAutoUpdate === true || force === true) {
          child.updateMatrixWorld(force);
        }
      }
    }
    updateWorldMatrix(updateParents, updateChildren) {
      const parent = this.parent;
      if (updateParents === true && parent !== null && parent.matrixWorldAutoUpdate === true) {
        parent.updateWorldMatrix(true, false);
      }
      if (this.matrixAutoUpdate) this.updateMatrix();
      if (this.parent === null) {
        this.matrixWorld.copy(this.matrix);
      } else {
        this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
      }
      if (updateChildren === true) {
        const children = this.children;
        for (let i = 0, l = children.length; i < l; i++) {
          const child = children[i];
          if (child.matrixWorldAutoUpdate === true) {
            child.updateWorldMatrix(false, true);
          }
        }
      }
    }
    toJSON(meta) {
      const isRootObject = meta === void 0 || typeof meta === "string";
      const output = {};
      if (isRootObject) {
        meta = {
          geometries: {},
          materials: {},
          textures: {},
          images: {},
          shapes: {},
          skeletons: {},
          animations: {},
          nodes: {}
        };
        output.metadata = {
          version: 4.6,
          type: "Object",
          generator: "Object3D.toJSON"
        };
      }
      const object = {};
      object.uuid = this.uuid;
      object.type = this.type;
      if (this.name !== "") object.name = this.name;
      if (this.castShadow === true) object.castShadow = true;
      if (this.receiveShadow === true) object.receiveShadow = true;
      if (this.visible === false) object.visible = false;
      if (this.frustumCulled === false) object.frustumCulled = false;
      if (this.renderOrder !== 0) object.renderOrder = this.renderOrder;
      if (Object.keys(this.userData).length > 0) object.userData = this.userData;
      object.layers = this.layers.mask;
      object.matrix = this.matrix.toArray();
      object.up = this.up.toArray();
      if (this.matrixAutoUpdate === false) object.matrixAutoUpdate = false;
      if (this.isInstancedMesh) {
        object.type = "InstancedMesh";
        object.count = this.count;
        object.instanceMatrix = this.instanceMatrix.toJSON();
        if (this.instanceColor !== null) object.instanceColor = this.instanceColor.toJSON();
      }
      if (this.isBatchedMesh) {
        object.type = "BatchedMesh";
        object.perObjectFrustumCulled = this.perObjectFrustumCulled;
        object.sortObjects = this.sortObjects;
        object.drawRanges = this._drawRanges;
        object.reservedRanges = this._reservedRanges;
        object.visibility = this._visibility;
        object.active = this._active;
        object.bounds = this._bounds.map((bound) => ({
          boxInitialized: bound.boxInitialized,
          boxMin: bound.box.min.toArray(),
          boxMax: bound.box.max.toArray(),
          sphereInitialized: bound.sphereInitialized,
          sphereRadius: bound.sphere.radius,
          sphereCenter: bound.sphere.center.toArray()
        }));
        object.maxGeometryCount = this._maxGeometryCount;
        object.maxVertexCount = this._maxVertexCount;
        object.maxIndexCount = this._maxIndexCount;
        object.geometryInitialized = this._geometryInitialized;
        object.geometryCount = this._geometryCount;
        object.matricesTexture = this._matricesTexture.toJSON(meta);
        if (this.boundingSphere !== null) {
          object.boundingSphere = {
            center: object.boundingSphere.center.toArray(),
            radius: object.boundingSphere.radius
          };
        }
        if (this.boundingBox !== null) {
          object.boundingBox = {
            min: object.boundingBox.min.toArray(),
            max: object.boundingBox.max.toArray()
          };
        }
      }
      function serialize(library, element) {
        if (library[element.uuid] === void 0) {
          library[element.uuid] = element.toJSON(meta);
        }
        return element.uuid;
      }
      if (this.isScene) {
        if (this.background) {
          if (this.background.isColor) {
            object.background = this.background.toJSON();
          } else if (this.background.isTexture) {
            object.background = this.background.toJSON(meta).uuid;
          }
        }
        if (this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true) {
          object.environment = this.environment.toJSON(meta).uuid;
        }
      } else if (this.isMesh || this.isLine || this.isPoints) {
        object.geometry = serialize(meta.geometries, this.geometry);
        const parameters = this.geometry.parameters;
        if (parameters !== void 0 && parameters.shapes !== void 0) {
          const shapes = parameters.shapes;
          if (Array.isArray(shapes)) {
            for (let i = 0, l = shapes.length; i < l; i++) {
              const shape = shapes[i];
              serialize(meta.shapes, shape);
            }
          } else {
            serialize(meta.shapes, shapes);
          }
        }
      }
      if (this.isSkinnedMesh) {
        object.bindMode = this.bindMode;
        object.bindMatrix = this.bindMatrix.toArray();
        if (this.skeleton !== void 0) {
          serialize(meta.skeletons, this.skeleton);
          object.skeleton = this.skeleton.uuid;
        }
      }
      if (this.material !== void 0) {
        if (Array.isArray(this.material)) {
          const uuids = [];
          for (let i = 0, l = this.material.length; i < l; i++) {
            uuids.push(serialize(meta.materials, this.material[i]));
          }
          object.material = uuids;
        } else {
          object.material = serialize(meta.materials, this.material);
        }
      }
      if (this.children.length > 0) {
        object.children = [];
        for (let i = 0; i < this.children.length; i++) {
          object.children.push(this.children[i].toJSON(meta).object);
        }
      }
      if (this.animations.length > 0) {
        object.animations = [];
        for (let i = 0; i < this.animations.length; i++) {
          const animation = this.animations[i];
          object.animations.push(serialize(meta.animations, animation));
        }
      }
      if (isRootObject) {
        const geometries = extractFromCache(meta.geometries);
        const materials = extractFromCache(meta.materials);
        const textures = extractFromCache(meta.textures);
        const images = extractFromCache(meta.images);
        const shapes = extractFromCache(meta.shapes);
        const skeletons = extractFromCache(meta.skeletons);
        const animations = extractFromCache(meta.animations);
        const nodes = extractFromCache(meta.nodes);
        if (geometries.length > 0) output.geometries = geometries;
        if (materials.length > 0) output.materials = materials;
        if (textures.length > 0) output.textures = textures;
        if (images.length > 0) output.images = images;
        if (shapes.length > 0) output.shapes = shapes;
        if (skeletons.length > 0) output.skeletons = skeletons;
        if (animations.length > 0) output.animations = animations;
        if (nodes.length > 0) output.nodes = nodes;
      }
      output.object = object;
      return output;
      function extractFromCache(cache) {
        const values = [];
        for (const key in cache) {
          const data = cache[key];
          delete data.metadata;
          values.push(data);
        }
        return values;
      }
    }
    clone(recursive) {
      return new this.constructor().copy(this, recursive);
    }
    copy(source, recursive = true) {
      this.name = source.name;
      this.up.copy(source.up);
      this.position.copy(source.position);
      this.rotation.order = source.rotation.order;
      this.quaternion.copy(source.quaternion);
      this.scale.copy(source.scale);
      this.matrix.copy(source.matrix);
      this.matrixWorld.copy(source.matrixWorld);
      this.matrixAutoUpdate = source.matrixAutoUpdate;
      this.matrixWorldAutoUpdate = source.matrixWorldAutoUpdate;
      this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;
      this.layers.mask = source.layers.mask;
      this.visible = source.visible;
      this.castShadow = source.castShadow;
      this.receiveShadow = source.receiveShadow;
      this.frustumCulled = source.frustumCulled;
      this.renderOrder = source.renderOrder;
      this.animations = source.animations.slice();
      this.userData = JSON.parse(JSON.stringify(source.userData));
      if (recursive === true) {
        for (let i = 0; i < source.children.length; i++) {
          const child = source.children[i];
          this.add(child.clone());
        }
      }
      return this;
    }
  };
  Object3D.DEFAULT_UP = /* @__PURE__ */ new Vector3(0, 1, 0);
  Object3D.DEFAULT_MATRIX_AUTO_UPDATE = true;
  Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
  var _v0$1 = /* @__PURE__ */ new Vector3();
  var _v1$3 = /* @__PURE__ */ new Vector3();
  var _v2$2 = /* @__PURE__ */ new Vector3();
  var _v3$1 = /* @__PURE__ */ new Vector3();
  var _vab = /* @__PURE__ */ new Vector3();
  var _vac = /* @__PURE__ */ new Vector3();
  var _vbc = /* @__PURE__ */ new Vector3();
  var _vap = /* @__PURE__ */ new Vector3();
  var _vbp = /* @__PURE__ */ new Vector3();
  var _vcp = /* @__PURE__ */ new Vector3();
  var warnedGetUV = false;
  var Triangle = class _Triangle {
    constructor(a = new Vector3(), b = new Vector3(), c = new Vector3()) {
      this.a = a;
      this.b = b;
      this.c = c;
    }
    static getNormal(a, b, c, target) {
      target.subVectors(c, b);
      _v0$1.subVectors(a, b);
      target.cross(_v0$1);
      const targetLengthSq = target.lengthSq();
      if (targetLengthSq > 0) {
        return target.multiplyScalar(1 / Math.sqrt(targetLengthSq));
      }
      return target.set(0, 0, 0);
    }
    // static/instance method to calculate barycentric coordinates
    // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
    static getBarycoord(point, a, b, c, target) {
      _v0$1.subVectors(c, a);
      _v1$3.subVectors(b, a);
      _v2$2.subVectors(point, a);
      const dot00 = _v0$1.dot(_v0$1);
      const dot01 = _v0$1.dot(_v1$3);
      const dot02 = _v0$1.dot(_v2$2);
      const dot11 = _v1$3.dot(_v1$3);
      const dot12 = _v1$3.dot(_v2$2);
      const denom = dot00 * dot11 - dot01 * dot01;
      if (denom === 0) {
        target.set(0, 0, 0);
        return null;
      }
      const invDenom = 1 / denom;
      const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
      return target.set(1 - u - v, v, u);
    }
    static containsPoint(point, a, b, c) {
      if (this.getBarycoord(point, a, b, c, _v3$1) === null) {
        return false;
      }
      return _v3$1.x >= 0 && _v3$1.y >= 0 && _v3$1.x + _v3$1.y <= 1;
    }
    static getUV(point, p1, p2, p3, uv1, uv2, uv3, target) {
      if (warnedGetUV === false) {
        console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation().");
        warnedGetUV = true;
      }
      return this.getInterpolation(point, p1, p2, p3, uv1, uv2, uv3, target);
    }
    static getInterpolation(point, p1, p2, p3, v1, v2, v3, target) {
      if (this.getBarycoord(point, p1, p2, p3, _v3$1) === null) {
        target.x = 0;
        target.y = 0;
        if ("z" in target) target.z = 0;
        if ("w" in target) target.w = 0;
        return null;
      }
      target.setScalar(0);
      target.addScaledVector(v1, _v3$1.x);
      target.addScaledVector(v2, _v3$1.y);
      target.addScaledVector(v3, _v3$1.z);
      return target;
    }
    static isFrontFacing(a, b, c, direction) {
      _v0$1.subVectors(c, b);
      _v1$3.subVectors(a, b);
      return _v0$1.cross(_v1$3).dot(direction) < 0 ? true : false;
    }
    set(a, b, c) {
      this.a.copy(a);
      this.b.copy(b);
      this.c.copy(c);
      return this;
    }
    setFromPointsAndIndices(points, i0, i1, i2) {
      this.a.copy(points[i0]);
      this.b.copy(points[i1]);
      this.c.copy(points[i2]);
      return this;
    }
    setFromAttributeAndIndices(attribute, i0, i1, i2) {
      this.a.fromBufferAttribute(attribute, i0);
      this.b.fromBufferAttribute(attribute, i1);
      this.c.fromBufferAttribute(attribute, i2);
      return this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(triangle) {
      this.a.copy(triangle.a);
      this.b.copy(triangle.b);
      this.c.copy(triangle.c);
      return this;
    }
    getArea() {
      _v0$1.subVectors(this.c, this.b);
      _v1$3.subVectors(this.a, this.b);
      return _v0$1.cross(_v1$3).length() * 0.5;
    }
    getMidpoint(target) {
      return target.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    }
    getNormal(target) {
      return _Triangle.getNormal(this.a, this.b, this.c, target);
    }
    getPlane(target) {
      return target.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    getBarycoord(point, target) {
      return _Triangle.getBarycoord(point, this.a, this.b, this.c, target);
    }
    getUV(point, uv1, uv2, uv3, target) {
      if (warnedGetUV === false) {
        console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation().");
        warnedGetUV = true;
      }
      return _Triangle.getInterpolation(point, this.a, this.b, this.c, uv1, uv2, uv3, target);
    }
    getInterpolation(point, v1, v2, v3, target) {
      return _Triangle.getInterpolation(point, this.a, this.b, this.c, v1, v2, v3, target);
    }
    containsPoint(point) {
      return _Triangle.containsPoint(point, this.a, this.b, this.c);
    }
    isFrontFacing(direction) {
      return _Triangle.isFrontFacing(this.a, this.b, this.c, direction);
    }
    intersectsBox(box) {
      return box.intersectsTriangle(this);
    }
    closestPointToPoint(p, target) {
      const a = this.a, b = this.b, c = this.c;
      let v, w;
      _vab.subVectors(b, a);
      _vac.subVectors(c, a);
      _vap.subVectors(p, a);
      const d1 = _vab.dot(_vap);
      const d2 = _vac.dot(_vap);
      if (d1 <= 0 && d2 <= 0) {
        return target.copy(a);
      }
      _vbp.subVectors(p, b);
      const d3 = _vab.dot(_vbp);
      const d4 = _vac.dot(_vbp);
      if (d3 >= 0 && d4 <= d3) {
        return target.copy(b);
      }
      const vc = d1 * d4 - d3 * d2;
      if (vc <= 0 && d1 >= 0 && d3 <= 0) {
        v = d1 / (d1 - d3);
        return target.copy(a).addScaledVector(_vab, v);
      }
      _vcp.subVectors(p, c);
      const d5 = _vab.dot(_vcp);
      const d6 = _vac.dot(_vcp);
      if (d6 >= 0 && d5 <= d6) {
        return target.copy(c);
      }
      const vb = d5 * d2 - d1 * d6;
      if (vb <= 0 && d2 >= 0 && d6 <= 0) {
        w = d2 / (d2 - d6);
        return target.copy(a).addScaledVector(_vac, w);
      }
      const va = d3 * d6 - d5 * d4;
      if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) {
        _vbc.subVectors(c, b);
        w = (d4 - d3) / (d4 - d3 + (d5 - d6));
        return target.copy(b).addScaledVector(_vbc, w);
      }
      const denom = 1 / (va + vb + vc);
      v = vb * denom;
      w = vc * denom;
      return target.copy(a).addScaledVector(_vab, v).addScaledVector(_vac, w);
    }
    equals(triangle) {
      return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
    }
  };
  var _colorKeywords = {
    "aliceblue": 15792383,
    "antiquewhite": 16444375,
    "aqua": 65535,
    "aquamarine": 8388564,
    "azure": 15794175,
    "beige": 16119260,
    "bisque": 16770244,
    "black": 0,
    "blanchedalmond": 16772045,
    "blue": 255,
    "blueviolet": 9055202,
    "brown": 10824234,
    "burlywood": 14596231,
    "cadetblue": 6266528,
    "chartreuse": 8388352,
    "chocolate": 13789470,
    "coral": 16744272,
    "cornflowerblue": 6591981,
    "cornsilk": 16775388,
    "crimson": 14423100,
    "cyan": 65535,
    "darkblue": 139,
    "darkcyan": 35723,
    "darkgoldenrod": 12092939,
    "darkgray": 11119017,
    "darkgreen": 25600,
    "darkgrey": 11119017,
    "darkkhaki": 12433259,
    "darkmagenta": 9109643,
    "darkolivegreen": 5597999,
    "darkorange": 16747520,
    "darkorchid": 10040012,
    "darkred": 9109504,
    "darksalmon": 15308410,
    "darkseagreen": 9419919,
    "darkslateblue": 4734347,
    "darkslategray": 3100495,
    "darkslategrey": 3100495,
    "darkturquoise": 52945,
    "darkviolet": 9699539,
    "deeppink": 16716947,
    "deepskyblue": 49151,
    "dimgray": 6908265,
    "dimgrey": 6908265,
    "dodgerblue": 2003199,
    "firebrick": 11674146,
    "floralwhite": 16775920,
    "forestgreen": 2263842,
    "fuchsia": 16711935,
    "gainsboro": 14474460,
    "ghostwhite": 16316671,
    "gold": 16766720,
    "goldenrod": 14329120,
    "gray": 8421504,
    "green": 32768,
    "greenyellow": 11403055,
    "grey": 8421504,
    "honeydew": 15794160,
    "hotpink": 16738740,
    "indianred": 13458524,
    "indigo": 4915330,
    "ivory": 16777200,
    "khaki": 15787660,
    "lavender": 15132410,
    "lavenderblush": 16773365,
    "lawngreen": 8190976,
    "lemonchiffon": 16775885,
    "lightblue": 11393254,
    "lightcoral": 15761536,
    "lightcyan": 14745599,
    "lightgoldenrodyellow": 16448210,
    "lightgray": 13882323,
    "lightgreen": 9498256,
    "lightgrey": 13882323,
    "lightpink": 16758465,
    "lightsalmon": 16752762,
    "lightseagreen": 2142890,
    "lightskyblue": 8900346,
    "lightslategray": 7833753,
    "lightslategrey": 7833753,
    "lightsteelblue": 11584734,
    "lightyellow": 16777184,
    "lime": 65280,
    "limegreen": 3329330,
    "linen": 16445670,
    "magenta": 16711935,
    "maroon": 8388608,
    "mediumaquamarine": 6737322,
    "mediumblue": 205,
    "mediumorchid": 12211667,
    "mediumpurple": 9662683,
    "mediumseagreen": 3978097,
    "mediumslateblue": 8087790,
    "mediumspringgreen": 64154,
    "mediumturquoise": 4772300,
    "mediumvioletred": 13047173,
    "midnightblue": 1644912,
    "mintcream": 16121850,
    "mistyrose": 16770273,
    "moccasin": 16770229,
    "navajowhite": 16768685,
    "navy": 128,
    "oldlace": 16643558,
    "olive": 8421376,
    "olivedrab": 7048739,
    "orange": 16753920,
    "orangered": 16729344,
    "orchid": 14315734,
    "palegoldenrod": 15657130,
    "palegreen": 10025880,
    "paleturquoise": 11529966,
    "palevioletred": 14381203,
    "papayawhip": 16773077,
    "peachpuff": 16767673,
    "peru": 13468991,
    "pink": 16761035,
    "plum": 14524637,
    "powderblue": 11591910,
    "purple": 8388736,
    "rebeccapurple": 6697881,
    "red": 16711680,
    "rosybrown": 12357519,
    "royalblue": 4286945,
    "saddlebrown": 9127187,
    "salmon": 16416882,
    "sandybrown": 16032864,
    "seagreen": 3050327,
    "seashell": 16774638,
    "sienna": 10506797,
    "silver": 12632256,
    "skyblue": 8900331,
    "slateblue": 6970061,
    "slategray": 7372944,
    "slategrey": 7372944,
    "snow": 16775930,
    "springgreen": 65407,
    "steelblue": 4620980,
    "tan": 13808780,
    "teal": 32896,
    "thistle": 14204888,
    "tomato": 16737095,
    "turquoise": 4251856,
    "violet": 15631086,
    "wheat": 16113331,
    "white": 16777215,
    "whitesmoke": 16119285,
    "yellow": 16776960,
    "yellowgreen": 10145074
  };
  var _hslA = { h: 0, s: 0, l: 0 };
  var _hslB = { h: 0, s: 0, l: 0 };
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
    return p;
  }
  var Color = class {
    constructor(r, g, b) {
      this.isColor = true;
      this.r = 1;
      this.g = 1;
      this.b = 1;
      return this.set(r, g, b);
    }
    set(r, g, b) {
      if (g === void 0 && b === void 0) {
        const value = r;
        if (value && value.isColor) {
          this.copy(value);
        } else if (typeof value === "number") {
          this.setHex(value);
        } else if (typeof value === "string") {
          this.setStyle(value);
        }
      } else {
        this.setRGB(r, g, b);
      }
      return this;
    }
    setScalar(scalar) {
      this.r = scalar;
      this.g = scalar;
      this.b = scalar;
      return this;
    }
    setHex(hex, colorSpace = SRGBColorSpace) {
      hex = Math.floor(hex);
      this.r = (hex >> 16 & 255) / 255;
      this.g = (hex >> 8 & 255) / 255;
      this.b = (hex & 255) / 255;
      ColorManagement.toWorkingColorSpace(this, colorSpace);
      return this;
    }
    setRGB(r, g, b, colorSpace = ColorManagement.workingColorSpace) {
      this.r = r;
      this.g = g;
      this.b = b;
      ColorManagement.toWorkingColorSpace(this, colorSpace);
      return this;
    }
    setHSL(h, s, l, colorSpace = ColorManagement.workingColorSpace) {
      h = euclideanModulo(h, 1);
      s = clamp(s, 0, 1);
      l = clamp(l, 0, 1);
      if (s === 0) {
        this.r = this.g = this.b = l;
      } else {
        const p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
        const q = 2 * l - p;
        this.r = hue2rgb(q, p, h + 1 / 3);
        this.g = hue2rgb(q, p, h);
        this.b = hue2rgb(q, p, h - 1 / 3);
      }
      ColorManagement.toWorkingColorSpace(this, colorSpace);
      return this;
    }
    setStyle(style, colorSpace = SRGBColorSpace) {
      function handleAlpha(string) {
        if (string === void 0) return;
        if (parseFloat(string) < 1) {
          console.warn("THREE.Color: Alpha component of " + style + " will be ignored.");
        }
      }
      let m;
      if (m = /^(\w+)\(([^\)]*)\)/.exec(style)) {
        let color;
        const name = m[1];
        const components = m[2];
        switch (name) {
          case "rgb":
          case "rgba":
            if (color = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components)) {
              handleAlpha(color[4]);
              return this.setRGB(
                Math.min(255, parseInt(color[1], 10)) / 255,
                Math.min(255, parseInt(color[2], 10)) / 255,
                Math.min(255, parseInt(color[3], 10)) / 255,
                colorSpace
              );
            }
            if (color = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components)) {
              handleAlpha(color[4]);
              return this.setRGB(
                Math.min(100, parseInt(color[1], 10)) / 100,
                Math.min(100, parseInt(color[2], 10)) / 100,
                Math.min(100, parseInt(color[3], 10)) / 100,
                colorSpace
              );
            }
            break;
          case "hsl":
          case "hsla":
            if (color = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components)) {
              handleAlpha(color[4]);
              return this.setHSL(
                parseFloat(color[1]) / 360,
                parseFloat(color[2]) / 100,
                parseFloat(color[3]) / 100,
                colorSpace
              );
            }
            break;
          default:
            console.warn("THREE.Color: Unknown color model " + style);
        }
      } else if (m = /^\#([A-Fa-f\d]+)$/.exec(style)) {
        const hex = m[1];
        const size = hex.length;
        if (size === 3) {
          return this.setRGB(
            parseInt(hex.charAt(0), 16) / 15,
            parseInt(hex.charAt(1), 16) / 15,
            parseInt(hex.charAt(2), 16) / 15,
            colorSpace
          );
        } else if (size === 6) {
          return this.setHex(parseInt(hex, 16), colorSpace);
        } else {
          console.warn("THREE.Color: Invalid hex color " + style);
        }
      } else if (style && style.length > 0) {
        return this.setColorName(style, colorSpace);
      }
      return this;
    }
    setColorName(style, colorSpace = SRGBColorSpace) {
      const hex = _colorKeywords[style.toLowerCase()];
      if (hex !== void 0) {
        this.setHex(hex, colorSpace);
      } else {
        console.warn("THREE.Color: Unknown color " + style);
      }
      return this;
    }
    clone() {
      return new this.constructor(this.r, this.g, this.b);
    }
    copy(color) {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
      return this;
    }
    copySRGBToLinear(color) {
      this.r = SRGBToLinear(color.r);
      this.g = SRGBToLinear(color.g);
      this.b = SRGBToLinear(color.b);
      return this;
    }
    copyLinearToSRGB(color) {
      this.r = LinearToSRGB(color.r);
      this.g = LinearToSRGB(color.g);
      this.b = LinearToSRGB(color.b);
      return this;
    }
    convertSRGBToLinear() {
      this.copySRGBToLinear(this);
      return this;
    }
    convertLinearToSRGB() {
      this.copyLinearToSRGB(this);
      return this;
    }
    getHex(colorSpace = SRGBColorSpace) {
      ColorManagement.fromWorkingColorSpace(_color.copy(this), colorSpace);
      return Math.round(clamp(_color.r * 255, 0, 255)) * 65536 + Math.round(clamp(_color.g * 255, 0, 255)) * 256 + Math.round(clamp(_color.b * 255, 0, 255));
    }
    getHexString(colorSpace = SRGBColorSpace) {
      return ("000000" + this.getHex(colorSpace).toString(16)).slice(-6);
    }
    getHSL(target, colorSpace = ColorManagement.workingColorSpace) {
      ColorManagement.fromWorkingColorSpace(_color.copy(this), colorSpace);
      const r = _color.r, g = _color.g, b = _color.b;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let hue, saturation;
      const lightness = (min + max) / 2;
      if (min === max) {
        hue = 0;
        saturation = 0;
      } else {
        const delta = max - min;
        saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);
        switch (max) {
          case r:
            hue = (g - b) / delta + (g < b ? 6 : 0);
            break;
          case g:
            hue = (b - r) / delta + 2;
            break;
          case b:
            hue = (r - g) / delta + 4;
            break;
        }
        hue /= 6;
      }
      target.h = hue;
      target.s = saturation;
      target.l = lightness;
      return target;
    }
    getRGB(target, colorSpace = ColorManagement.workingColorSpace) {
      ColorManagement.fromWorkingColorSpace(_color.copy(this), colorSpace);
      target.r = _color.r;
      target.g = _color.g;
      target.b = _color.b;
      return target;
    }
    getStyle(colorSpace = SRGBColorSpace) {
      ColorManagement.fromWorkingColorSpace(_color.copy(this), colorSpace);
      const r = _color.r, g = _color.g, b = _color.b;
      if (colorSpace !== SRGBColorSpace) {
        return `color(${colorSpace} ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)})`;
      }
      return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
    }
    offsetHSL(h, s, l) {
      this.getHSL(_hslA);
      return this.setHSL(_hslA.h + h, _hslA.s + s, _hslA.l + l);
    }
    add(color) {
      this.r += color.r;
      this.g += color.g;
      this.b += color.b;
      return this;
    }
    addColors(color1, color2) {
      this.r = color1.r + color2.r;
      this.g = color1.g + color2.g;
      this.b = color1.b + color2.b;
      return this;
    }
    addScalar(s) {
      this.r += s;
      this.g += s;
      this.b += s;
      return this;
    }
    sub(color) {
      this.r = Math.max(0, this.r - color.r);
      this.g = Math.max(0, this.g - color.g);
      this.b = Math.max(0, this.b - color.b);
      return this;
    }
    multiply(color) {
      this.r *= color.r;
      this.g *= color.g;
      this.b *= color.b;
      return this;
    }
    multiplyScalar(s) {
      this.r *= s;
      this.g *= s;
      this.b *= s;
      return this;
    }
    lerp(color, alpha) {
      this.r += (color.r - this.r) * alpha;
      this.g += (color.g - this.g) * alpha;
      this.b += (color.b - this.b) * alpha;
      return this;
    }
    lerpColors(color1, color2, alpha) {
      this.r = color1.r + (color2.r - color1.r) * alpha;
      this.g = color1.g + (color2.g - color1.g) * alpha;
      this.b = color1.b + (color2.b - color1.b) * alpha;
      return this;
    }
    lerpHSL(color, alpha) {
      this.getHSL(_hslA);
      color.getHSL(_hslB);
      const h = lerp(_hslA.h, _hslB.h, alpha);
      const s = lerp(_hslA.s, _hslB.s, alpha);
      const l = lerp(_hslA.l, _hslB.l, alpha);
      this.setHSL(h, s, l);
      return this;
    }
    setFromVector3(v) {
      this.r = v.x;
      this.g = v.y;
      this.b = v.z;
      return this;
    }
    applyMatrix3(m) {
      const r = this.r, g = this.g, b = this.b;
      const e = m.elements;
      this.r = e[0] * r + e[3] * g + e[6] * b;
      this.g = e[1] * r + e[4] * g + e[7] * b;
      this.b = e[2] * r + e[5] * g + e[8] * b;
      return this;
    }
    equals(c) {
      return c.r === this.r && c.g === this.g && c.b === this.b;
    }
    fromArray(array, offset = 0) {
      this.r = array[offset];
      this.g = array[offset + 1];
      this.b = array[offset + 2];
      return this;
    }
    toArray(array = [], offset = 0) {
      array[offset] = this.r;
      array[offset + 1] = this.g;
      array[offset + 2] = this.b;
      return array;
    }
    fromBufferAttribute(attribute, index) {
      this.r = attribute.getX(index);
      this.g = attribute.getY(index);
      this.b = attribute.getZ(index);
      return this;
    }
    toJSON() {
      return this.getHex();
    }
    *[Symbol.iterator]() {
      yield this.r;
      yield this.g;
      yield this.b;
    }
  };
  var _color = /* @__PURE__ */ new Color();
  Color.NAMES = _colorKeywords;
  var _materialId = 0;
  var Material = class extends EventDispatcher {
    constructor() {
      super();
      this.isMaterial = true;
      Object.defineProperty(this, "id", { value: _materialId++ });
      this.uuid = generateUUID();
      this.name = "";
      this.type = "Material";
      this.blending = NormalBlending;
      this.side = FrontSide;
      this.vertexColors = false;
      this.opacity = 1;
      this.transparent = false;
      this.alphaHash = false;
      this.blendSrc = SrcAlphaFactor;
      this.blendDst = OneMinusSrcAlphaFactor;
      this.blendEquation = AddEquation;
      this.blendSrcAlpha = null;
      this.blendDstAlpha = null;
      this.blendEquationAlpha = null;
      this.blendColor = new Color(0, 0, 0);
      this.blendAlpha = 0;
      this.depthFunc = LessEqualDepth;
      this.depthTest = true;
      this.depthWrite = true;
      this.stencilWriteMask = 255;
      this.stencilFunc = AlwaysStencilFunc;
      this.stencilRef = 0;
      this.stencilFuncMask = 255;
      this.stencilFail = KeepStencilOp;
      this.stencilZFail = KeepStencilOp;
      this.stencilZPass = KeepStencilOp;
      this.stencilWrite = false;
      this.clippingPlanes = null;
      this.clipIntersection = false;
      this.clipShadows = false;
      this.shadowSide = null;
      this.colorWrite = true;
      this.precision = null;
      this.polygonOffset = false;
      this.polygonOffsetFactor = 0;
      this.polygonOffsetUnits = 0;
      this.dithering = false;
      this.alphaToCoverage = false;
      this.premultipliedAlpha = false;
      this.forceSinglePass = false;
      this.visible = true;
      this.toneMapped = true;
      this.userData = {};
      this.version = 0;
      this._alphaTest = 0;
    }
    get alphaTest() {
      return this._alphaTest;
    }
    set alphaTest(value) {
      if (this._alphaTest > 0 !== value > 0) {
        this.version++;
      }
      this._alphaTest = value;
    }
    onBuild() {
    }
    onBeforeRender() {
    }
    onBeforeCompile() {
    }
    customProgramCacheKey() {
      return this.onBeforeCompile.toString();
    }
    setValues(values) {
      if (values === void 0) return;
      for (const key in values) {
        const newValue = values[key];
        if (newValue === void 0) {
          console.warn(`THREE.Material: parameter '${key}' has value of undefined.`);
          continue;
        }
        const currentValue = this[key];
        if (currentValue === void 0) {
          console.warn(`THREE.Material: '${key}' is not a property of THREE.${this.type}.`);
          continue;
        }
        if (currentValue && currentValue.isColor) {
          currentValue.set(newValue);
        } else if (currentValue && currentValue.isVector3 && (newValue && newValue.isVector3)) {
          currentValue.copy(newValue);
        } else {
          this[key] = newValue;
        }
      }
    }
    toJSON(meta) {
      const isRootObject = meta === void 0 || typeof meta === "string";
      if (isRootObject) {
        meta = {
          textures: {},
          images: {}
        };
      }
      const data = {
        metadata: {
          version: 4.6,
          type: "Material",
          generator: "Material.toJSON"
        }
      };
      data.uuid = this.uuid;
      data.type = this.type;
      if (this.name !== "") data.name = this.name;
      if (this.color && this.color.isColor) data.color = this.color.getHex();
      if (this.roughness !== void 0) data.roughness = this.roughness;
      if (this.metalness !== void 0) data.metalness = this.metalness;
      if (this.sheen !== void 0) data.sheen = this.sheen;
      if (this.sheenColor && this.sheenColor.isColor) data.sheenColor = this.sheenColor.getHex();
      if (this.sheenRoughness !== void 0) data.sheenRoughness = this.sheenRoughness;
      if (this.emissive && this.emissive.isColor) data.emissive = this.emissive.getHex();
      if (this.emissiveIntensity && this.emissiveIntensity !== 1) data.emissiveIntensity = this.emissiveIntensity;
      if (this.specular && this.specular.isColor) data.specular = this.specular.getHex();
      if (this.specularIntensity !== void 0) data.specularIntensity = this.specularIntensity;
      if (this.specularColor && this.specularColor.isColor) data.specularColor = this.specularColor.getHex();
      if (this.shininess !== void 0) data.shininess = this.shininess;
      if (this.clearcoat !== void 0) data.clearcoat = this.clearcoat;
      if (this.clearcoatRoughness !== void 0) data.clearcoatRoughness = this.clearcoatRoughness;
      if (this.clearcoatMap && this.clearcoatMap.isTexture) {
        data.clearcoatMap = this.clearcoatMap.toJSON(meta).uuid;
      }
      if (this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture) {
        data.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(meta).uuid;
      }
      if (this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture) {
        data.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(meta).uuid;
        data.clearcoatNormalScale = this.clearcoatNormalScale.toArray();
      }
      if (this.iridescence !== void 0) data.iridescence = this.iridescence;
      if (this.iridescenceIOR !== void 0) data.iridescenceIOR = this.iridescenceIOR;
      if (this.iridescenceThicknessRange !== void 0) data.iridescenceThicknessRange = this.iridescenceThicknessRange;
      if (this.iridescenceMap && this.iridescenceMap.isTexture) {
        data.iridescenceMap = this.iridescenceMap.toJSON(meta).uuid;
      }
      if (this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture) {
        data.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(meta).uuid;
      }
      if (this.anisotropy !== void 0) data.anisotropy = this.anisotropy;
      if (this.anisotropyRotation !== void 0) data.anisotropyRotation = this.anisotropyRotation;
      if (this.anisotropyMap && this.anisotropyMap.isTexture) {
        data.anisotropyMap = this.anisotropyMap.toJSON(meta).uuid;
      }
      if (this.map && this.map.isTexture) data.map = this.map.toJSON(meta).uuid;
      if (this.matcap && this.matcap.isTexture) data.matcap = this.matcap.toJSON(meta).uuid;
      if (this.alphaMap && this.alphaMap.isTexture) data.alphaMap = this.alphaMap.toJSON(meta).uuid;
      if (this.lightMap && this.lightMap.isTexture) {
        data.lightMap = this.lightMap.toJSON(meta).uuid;
        data.lightMapIntensity = this.lightMapIntensity;
      }
      if (this.aoMap && this.aoMap.isTexture) {
        data.aoMap = this.aoMap.toJSON(meta).uuid;
        data.aoMapIntensity = this.aoMapIntensity;
      }
      if (this.bumpMap && this.bumpMap.isTexture) {
        data.bumpMap = this.bumpMap.toJSON(meta).uuid;
        data.bumpScale = this.bumpScale;
      }
      if (this.normalMap && this.normalMap.isTexture) {
        data.normalMap = this.normalMap.toJSON(meta).uuid;
        data.normalMapType = this.normalMapType;
        data.normalScale = this.normalScale.toArray();
      }
      if (this.displacementMap && this.displacementMap.isTexture) {
        data.displacementMap = this.displacementMap.toJSON(meta).uuid;
        data.displacementScale = this.displacementScale;
        data.displacementBias = this.displacementBias;
      }
      if (this.roughnessMap && this.roughnessMap.isTexture) data.roughnessMap = this.roughnessMap.toJSON(meta).uuid;
      if (this.metalnessMap && this.metalnessMap.isTexture) data.metalnessMap = this.metalnessMap.toJSON(meta).uuid;
      if (this.emissiveMap && this.emissiveMap.isTexture) data.emissiveMap = this.emissiveMap.toJSON(meta).uuid;
      if (this.specularMap && this.specularMap.isTexture) data.specularMap = this.specularMap.toJSON(meta).uuid;
      if (this.specularIntensityMap && this.specularIntensityMap.isTexture) data.specularIntensityMap = this.specularIntensityMap.toJSON(meta).uuid;
      if (this.specularColorMap && this.specularColorMap.isTexture) data.specularColorMap = this.specularColorMap.toJSON(meta).uuid;
      if (this.envMap && this.envMap.isTexture) {
        data.envMap = this.envMap.toJSON(meta).uuid;
        if (this.combine !== void 0) data.combine = this.combine;
      }
      if (this.envMapIntensity !== void 0) data.envMapIntensity = this.envMapIntensity;
      if (this.reflectivity !== void 0) data.reflectivity = this.reflectivity;
      if (this.refractionRatio !== void 0) data.refractionRatio = this.refractionRatio;
      if (this.gradientMap && this.gradientMap.isTexture) {
        data.gradientMap = this.gradientMap.toJSON(meta).uuid;
      }
      if (this.transmission !== void 0) data.transmission = this.transmission;
      if (this.transmissionMap && this.transmissionMap.isTexture) data.transmissionMap = this.transmissionMap.toJSON(meta).uuid;
      if (this.thickness !== void 0) data.thickness = this.thickness;
      if (this.thicknessMap && this.thicknessMap.isTexture) data.thicknessMap = this.thicknessMap.toJSON(meta).uuid;
      if (this.attenuationDistance !== void 0 && this.attenuationDistance !== Infinity) data.attenuationDistance = this.attenuationDistance;
      if (this.attenuationColor !== void 0) data.attenuationColor = this.attenuationColor.getHex();
      if (this.size !== void 0) data.size = this.size;
      if (this.shadowSide !== null) data.shadowSide = this.shadowSide;
      if (this.sizeAttenuation !== void 0) data.sizeAttenuation = this.sizeAttenuation;
      if (this.blending !== NormalBlending) data.blending = this.blending;
      if (this.side !== FrontSide) data.side = this.side;
      if (this.vertexColors === true) data.vertexColors = true;
      if (this.opacity < 1) data.opacity = this.opacity;
      if (this.transparent === true) data.transparent = true;
      if (this.blendSrc !== SrcAlphaFactor) data.blendSrc = this.blendSrc;
      if (this.blendDst !== OneMinusSrcAlphaFactor) data.blendDst = this.blendDst;
      if (this.blendEquation !== AddEquation) data.blendEquation = this.blendEquation;
      if (this.blendSrcAlpha !== null) data.blendSrcAlpha = this.blendSrcAlpha;
      if (this.blendDstAlpha !== null) data.blendDstAlpha = this.blendDstAlpha;
      if (this.blendEquationAlpha !== null) data.blendEquationAlpha = this.blendEquationAlpha;
      if (this.blendColor && this.blendColor.isColor) data.blendColor = this.blendColor.getHex();
      if (this.blendAlpha !== 0) data.blendAlpha = this.blendAlpha;
      if (this.depthFunc !== LessEqualDepth) data.depthFunc = this.depthFunc;
      if (this.depthTest === false) data.depthTest = this.depthTest;
      if (this.depthWrite === false) data.depthWrite = this.depthWrite;
      if (this.colorWrite === false) data.colorWrite = this.colorWrite;
      if (this.stencilWriteMask !== 255) data.stencilWriteMask = this.stencilWriteMask;
      if (this.stencilFunc !== AlwaysStencilFunc) data.stencilFunc = this.stencilFunc;
      if (this.stencilRef !== 0) data.stencilRef = this.stencilRef;
      if (this.stencilFuncMask !== 255) data.stencilFuncMask = this.stencilFuncMask;
      if (this.stencilFail !== KeepStencilOp) data.stencilFail = this.stencilFail;
      if (this.stencilZFail !== KeepStencilOp) data.stencilZFail = this.stencilZFail;
      if (this.stencilZPass !== KeepStencilOp) data.stencilZPass = this.stencilZPass;
      if (this.stencilWrite === true) data.stencilWrite = this.stencilWrite;
      if (this.rotation !== void 0 && this.rotation !== 0) data.rotation = this.rotation;
      if (this.polygonOffset === true) data.polygonOffset = true;
      if (this.polygonOffsetFactor !== 0) data.polygonOffsetFactor = this.polygonOffsetFactor;
      if (this.polygonOffsetUnits !== 0) data.polygonOffsetUnits = this.polygonOffsetUnits;
      if (this.linewidth !== void 0 && this.linewidth !== 1) data.linewidth = this.linewidth;
      if (this.dashSize !== void 0) data.dashSize = this.dashSize;
      if (this.gapSize !== void 0) data.gapSize = this.gapSize;
      if (this.scale !== void 0) data.scale = this.scale;
      if (this.dithering === true) data.dithering = true;
      if (this.alphaTest > 0) data.alphaTest = this.alphaTest;
      if (this.alphaHash === true) data.alphaHash = true;
      if (this.alphaToCoverage === true) data.alphaToCoverage = true;
      if (this.premultipliedAlpha === true) data.premultipliedAlpha = true;
      if (this.forceSinglePass === true) data.forceSinglePass = true;
      if (this.wireframe === true) data.wireframe = true;
      if (this.wireframeLinewidth > 1) data.wireframeLinewidth = this.wireframeLinewidth;
      if (this.wireframeLinecap !== "round") data.wireframeLinecap = this.wireframeLinecap;
      if (this.wireframeLinejoin !== "round") data.wireframeLinejoin = this.wireframeLinejoin;
      if (this.flatShading === true) data.flatShading = true;
      if (this.visible === false) data.visible = false;
      if (this.toneMapped === false) data.toneMapped = false;
      if (this.fog === false) data.fog = false;
      if (Object.keys(this.userData).length > 0) data.userData = this.userData;
      function extractFromCache(cache) {
        const values = [];
        for (const key in cache) {
          const data2 = cache[key];
          delete data2.metadata;
          values.push(data2);
        }
        return values;
      }
      if (isRootObject) {
        const textures = extractFromCache(meta.textures);
        const images = extractFromCache(meta.images);
        if (textures.length > 0) data.textures = textures;
        if (images.length > 0) data.images = images;
      }
      return data;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(source) {
      this.name = source.name;
      this.blending = source.blending;
      this.side = source.side;
      this.vertexColors = source.vertexColors;
      this.opacity = source.opacity;
      this.transparent = source.transparent;
      this.blendSrc = source.blendSrc;
      this.blendDst = source.blendDst;
      this.blendEquation = source.blendEquation;
      this.blendSrcAlpha = source.blendSrcAlpha;
      this.blendDstAlpha = source.blendDstAlpha;
      this.blendEquationAlpha = source.blendEquationAlpha;
      this.blendColor.copy(source.blendColor);
      this.blendAlpha = source.blendAlpha;
      this.depthFunc = source.depthFunc;
      this.depthTest = source.depthTest;
      this.depthWrite = source.depthWrite;
      this.stencilWriteMask = source.stencilWriteMask;
      this.stencilFunc = source.stencilFunc;
      this.stencilRef = source.stencilRef;
      this.stencilFuncMask = source.stencilFuncMask;
      this.stencilFail = source.stencilFail;
      this.stencilZFail = source.stencilZFail;
      this.stencilZPass = source.stencilZPass;
      this.stencilWrite = source.stencilWrite;
      const srcPlanes = source.clippingPlanes;
      let dstPlanes = null;
      if (srcPlanes !== null) {
        const n = srcPlanes.length;
        dstPlanes = new Array(n);
        for (let i = 0; i !== n; ++i) {
          dstPlanes[i] = srcPlanes[i].clone();
        }
      }
      this.clippingPlanes = dstPlanes;
      this.clipIntersection = source.clipIntersection;
      this.clipShadows = source.clipShadows;
      this.shadowSide = source.shadowSide;
      this.colorWrite = source.colorWrite;
      this.precision = source.precision;
      this.polygonOffset = source.polygonOffset;
      this.polygonOffsetFactor = source.polygonOffsetFactor;
      this.polygonOffsetUnits = source.polygonOffsetUnits;
      this.dithering = source.dithering;
      this.alphaTest = source.alphaTest;
      this.alphaHash = source.alphaHash;
      this.alphaToCoverage = source.alphaToCoverage;
      this.premultipliedAlpha = source.premultipliedAlpha;
      this.forceSinglePass = source.forceSinglePass;
      this.visible = source.visible;
      this.toneMapped = source.toneMapped;
      this.userData = JSON.parse(JSON.stringify(source.userData));
      return this;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    set needsUpdate(value) {
      if (value === true) this.version++;
    }
  };
  var MeshBasicMaterial = class extends Material {
    constructor(parameters) {
      super();
      this.isMeshBasicMaterial = true;
      this.type = "MeshBasicMaterial";
      this.color = new Color(16777215);
      this.map = null;
      this.lightMap = null;
      this.lightMapIntensity = 1;
      this.aoMap = null;
      this.aoMapIntensity = 1;
      this.specularMap = null;
      this.alphaMap = null;
      this.envMap = null;
      this.combine = MultiplyOperation;
      this.reflectivity = 1;
      this.refractionRatio = 0.98;
      this.wireframe = false;
      this.wireframeLinewidth = 1;
      this.wireframeLinecap = "round";
      this.wireframeLinejoin = "round";
      this.fog = true;
      this.setValues(parameters);
    }
    copy(source) {
      super.copy(source);
      this.color.copy(source.color);
      this.map = source.map;
      this.lightMap = source.lightMap;
      this.lightMapIntensity = source.lightMapIntensity;
      this.aoMap = source.aoMap;
      this.aoMapIntensity = source.aoMapIntensity;
      this.specularMap = source.specularMap;
      this.alphaMap = source.alphaMap;
      this.envMap = source.envMap;
      this.combine = source.combine;
      this.reflectivity = source.reflectivity;
      this.refractionRatio = source.refractionRatio;
      this.wireframe = source.wireframe;
      this.wireframeLinewidth = source.wireframeLinewidth;
      this.wireframeLinecap = source.wireframeLinecap;
      this.wireframeLinejoin = source.wireframeLinejoin;
      this.fog = source.fog;
      return this;
    }
  };
  var _vector$9 = /* @__PURE__ */ new Vector3();
  var _vector2$1 = /* @__PURE__ */ new Vector2();
  var BufferAttribute = class {
    constructor(array, itemSize, normalized = false) {
      if (Array.isArray(array)) {
        throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
      }
      this.isBufferAttribute = true;
      this.name = "";
      this.array = array;
      this.itemSize = itemSize;
      this.count = array !== void 0 ? array.length / itemSize : 0;
      this.normalized = normalized;
      this.usage = StaticDrawUsage;
      this._updateRange = { offset: 0, count: -1 };
      this.updateRanges = [];
      this.gpuType = FloatType;
      this.version = 0;
    }
    onUploadCallback() {
    }
    set needsUpdate(value) {
      if (value === true) this.version++;
    }
    get updateRange() {
      console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead.");
      return this._updateRange;
    }
    setUsage(value) {
      this.usage = value;
      return this;
    }
    addUpdateRange(start, count) {
      this.updateRanges.push({ start, count });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(source) {
      this.name = source.name;
      this.array = new source.array.constructor(source.array);
      this.itemSize = source.itemSize;
      this.count = source.count;
      this.normalized = source.normalized;
      this.usage = source.usage;
      this.gpuType = source.gpuType;
      return this;
    }
    copyAt(index1, attribute, index2) {
      index1 *= this.itemSize;
      index2 *= attribute.itemSize;
      for (let i = 0, l = this.itemSize; i < l; i++) {
        this.array[index1 + i] = attribute.array[index2 + i];
      }
      return this;
    }
    copyArray(array) {
      this.array.set(array);
      return this;
    }
    applyMatrix3(m) {
      if (this.itemSize === 2) {
        for (let i = 0, l = this.count; i < l; i++) {
          _vector2$1.fromBufferAttribute(this, i);
          _vector2$1.applyMatrix3(m);
          this.setXY(i, _vector2$1.x, _vector2$1.y);
        }
      } else if (this.itemSize === 3) {
        for (let i = 0, l = this.count; i < l; i++) {
          _vector$9.fromBufferAttribute(this, i);
          _vector$9.applyMatrix3(m);
          this.setXYZ(i, _vector$9.x, _vector$9.y, _vector$9.z);
        }
      }
      return this;
    }
    applyMatrix4(m) {
      for (let i = 0, l = this.count; i < l; i++) {
        _vector$9.fromBufferAttribute(this, i);
        _vector$9.applyMatrix4(m);
        this.setXYZ(i, _vector$9.x, _vector$9.y, _vector$9.z);
      }
      return this;
    }
    applyNormalMatrix(m) {
      for (let i = 0, l = this.count; i < l; i++) {
        _vector$9.fromBufferAttribute(this, i);
        _vector$9.applyNormalMatrix(m);
        this.setXYZ(i, _vector$9.x, _vector$9.y, _vector$9.z);
      }
      return this;
    }
    transformDirection(m) {
      for (let i = 0, l = this.count; i < l; i++) {
        _vector$9.fromBufferAttribute(this, i);
        _vector$9.transformDirection(m);
        this.setXYZ(i, _vector$9.x, _vector$9.y, _vector$9.z);
      }
      return this;
    }
    set(value, offset = 0) {
      this.array.set(value, offset);
      return this;
    }
    getComponent(index, component) {
      let value = this.array[index * this.itemSize + component];
      if (this.normalized) value = denormalize(value, this.array);
      return value;
    }
    setComponent(index, component, value) {
      if (this.normalized) value = normalize(value, this.array);
      this.array[index * this.itemSize + component] = value;
      return this;
    }
    getX(index) {
      let x = this.array[index * this.itemSize];
      if (this.normalized) x = denormalize(x, this.array);
      return x;
    }
    setX(index, x) {
      if (this.normalized) x = normalize(x, this.array);
      this.array[index * this.itemSize] = x;
      return this;
    }
    getY(index) {
      let y = this.array[index * this.itemSize + 1];
      if (this.normalized) y = denormalize(y, this.array);
      return y;
    }
    setY(index, y) {
      if (this.normalized) y = normalize(y, this.array);
      this.array[index * this.itemSize + 1] = y;
      return this;
    }
    getZ(index) {
      let z = this.array[index * this.itemSize + 2];
      if (this.normalized) z = denormalize(z, this.array);
      return z;
    }
    setZ(index, z) {
      if (this.normalized) z = normalize(z, this.array);
      this.array[index * this.itemSize + 2] = z;
      return this;
    }
    getW(index) {
      let w = this.array[index * this.itemSize + 3];
      if (this.normalized) w = denormalize(w, this.array);
      return w;
    }
    setW(index, w) {
      if (this.normalized) w = normalize(w, this.array);
      this.array[index * this.itemSize + 3] = w;
      return this;
    }
    setXY(index, x, y) {
      index *= this.itemSize;
      if (this.normalized) {
        x = normalize(x, this.array);
        y = normalize(y, this.array);
      }
      this.array[index + 0] = x;
      this.array[index + 1] = y;
      return this;
    }
    setXYZ(index, x, y, z) {
      index *= this.itemSize;
      if (this.normalized) {
        x = normalize(x, this.array);
        y = normalize(y, this.array);
        z = normalize(z, this.array);
      }
      this.array[index + 0] = x;
      this.array[index + 1] = y;
      this.array[index + 2] = z;
      return this;
    }
    setXYZW(index, x, y, z, w) {
      index *= this.itemSize;
      if (this.normalized) {
        x = normalize(x, this.array);
        y = normalize(y, this.array);
        z = normalize(z, this.array);
        w = normalize(w, this.array);
      }
      this.array[index + 0] = x;
      this.array[index + 1] = y;
      this.array[index + 2] = z;
      this.array[index + 3] = w;
      return this;
    }
    onUpload(callback) {
      this.onUploadCallback = callback;
      return this;
    }
    clone() {
      return new this.constructor(this.array, this.itemSize).copy(this);
    }
    toJSON() {
      const data = {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: Array.from(this.array),
        normalized: this.normalized
      };
      if (this.name !== "") data.name = this.name;
      if (this.usage !== StaticDrawUsage) data.usage = this.usage;
      return data;
    }
  };
  var Uint16BufferAttribute = class extends BufferAttribute {
    constructor(array, itemSize, normalized) {
      super(new Uint16Array(array), itemSize, normalized);
    }
  };
  var Uint32BufferAttribute = class extends BufferAttribute {
    constructor(array, itemSize, normalized) {
      super(new Uint32Array(array), itemSize, normalized);
    }
  };
  var Float32BufferAttribute = class extends BufferAttribute {
    constructor(array, itemSize, normalized) {
      super(new Float32Array(array), itemSize, normalized);
    }
  };
  var _id$2 = 0;
  var _m1 = /* @__PURE__ */ new Matrix4();
  var _obj = /* @__PURE__ */ new Object3D();
  var _offset = /* @__PURE__ */ new Vector3();
  var _box$2 = /* @__PURE__ */ new Box3();
  var _boxMorphTargets = /* @__PURE__ */ new Box3();
  var _vector$8 = /* @__PURE__ */ new Vector3();
  var BufferGeometry = class _BufferGeometry extends EventDispatcher {
    constructor() {
      super();
      this.isBufferGeometry = true;
      Object.defineProperty(this, "id", { value: _id$2++ });
      this.uuid = generateUUID();
      this.name = "";
      this.type = "BufferGeometry";
      this.index = null;
      this.attributes = {};
      this.morphAttributes = {};
      this.morphTargetsRelative = false;
      this.groups = [];
      this.boundingBox = null;
      this.boundingSphere = null;
      this.drawRange = { start: 0, count: Infinity };
      this.userData = {};
    }
    getIndex() {
      return this.index;
    }
    setIndex(index) {
      if (Array.isArray(index)) {
        this.index = new (arrayNeedsUint32(index) ? Uint32BufferAttribute : Uint16BufferAttribute)(index, 1);
      } else {
        this.index = index;
      }
      return this;
    }
    getAttribute(name) {
      return this.attributes[name];
    }
    setAttribute(name, attribute) {
      this.attributes[name] = attribute;
      return this;
    }
    deleteAttribute(name) {
      delete this.attributes[name];
      return this;
    }
    hasAttribute(name) {
      return this.attributes[name] !== void 0;
    }
    addGroup(start, count, materialIndex = 0) {
      this.groups.push({
        start,
        count,
        materialIndex
      });
    }
    clearGroups() {
      this.groups = [];
    }
    setDrawRange(start, count) {
      this.drawRange.start = start;
      this.drawRange.count = count;
    }
    applyMatrix4(matrix) {
      const position = this.attributes.position;
      if (position !== void 0) {
        position.applyMatrix4(matrix);
        position.needsUpdate = true;
      }
      const normal = this.attributes.normal;
      if (normal !== void 0) {
        const normalMatrix = new Matrix3().getNormalMatrix(matrix);
        normal.applyNormalMatrix(normalMatrix);
        normal.needsUpdate = true;
      }
      const tangent = this.attributes.tangent;
      if (tangent !== void 0) {
        tangent.transformDirection(matrix);
        tangent.needsUpdate = true;
      }
      if (this.boundingBox !== null) {
        this.computeBoundingBox();
      }
      if (this.boundingSphere !== null) {
        this.computeBoundingSphere();
      }
      return this;
    }
    applyQuaternion(q) {
      _m1.makeRotationFromQuaternion(q);
      this.applyMatrix4(_m1);
      return this;
    }
    rotateX(angle) {
      _m1.makeRotationX(angle);
      this.applyMatrix4(_m1);
      return this;
    }
    rotateY(angle) {
      _m1.makeRotationY(angle);
      this.applyMatrix4(_m1);
      return this;
    }
    rotateZ(angle) {
      _m1.makeRotationZ(angle);
      this.applyMatrix4(_m1);
      return this;
    }
    translate(x, y, z) {
      _m1.makeTranslation(x, y, z);
      this.applyMatrix4(_m1);
      return this;
    }
    scale(x, y, z) {
      _m1.makeScale(x, y, z);
      this.applyMatrix4(_m1);
      return this;
    }
    lookAt(vector) {
      _obj.lookAt(vector);
      _obj.updateMatrix();
      this.applyMatrix4(_obj.matrix);
      return this;
    }
    center() {
      this.computeBoundingBox();
      this.boundingBox.getCenter(_offset).negate();
      this.translate(_offset.x, _offset.y, _offset.z);
      return this;
    }
    setFromPoints(points) {
      const position = [];
      for (let i = 0, l = points.length; i < l; i++) {
        const point = points[i];
        position.push(point.x, point.y, point.z || 0);
      }
      this.setAttribute("position", new Float32BufferAttribute(position, 3));
      return this;
    }
    computeBoundingBox() {
      if (this.boundingBox === null) {
        this.boundingBox = new Box3();
      }
      const position = this.attributes.position;
      const morphAttributesPosition = this.morphAttributes.position;
      if (position && position.isGLBufferAttribute) {
        console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".', this);
        this.boundingBox.set(
          new Vector3(-Infinity, -Infinity, -Infinity),
          new Vector3(Infinity, Infinity, Infinity)
        );
        return;
      }
      if (position !== void 0) {
        this.boundingBox.setFromBufferAttribute(position);
        if (morphAttributesPosition) {
          for (let i = 0, il = morphAttributesPosition.length; i < il; i++) {
            const morphAttribute = morphAttributesPosition[i];
            _box$2.setFromBufferAttribute(morphAttribute);
            if (this.morphTargetsRelative) {
              _vector$8.addVectors(this.boundingBox.min, _box$2.min);
              this.boundingBox.expandByPoint(_vector$8);
              _vector$8.addVectors(this.boundingBox.max, _box$2.max);
              this.boundingBox.expandByPoint(_vector$8);
            } else {
              this.boundingBox.expandByPoint(_box$2.min);
              this.boundingBox.expandByPoint(_box$2.max);
            }
          }
        }
      } else {
        this.boundingBox.makeEmpty();
      }
      if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
        console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
      }
    }
    computeBoundingSphere() {
      if (this.boundingSphere === null) {
        this.boundingSphere = new Sphere();
      }
      const position = this.attributes.position;
      const morphAttributesPosition = this.morphAttributes.position;
      if (position && position.isGLBufferAttribute) {
        console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".', this);
        this.boundingSphere.set(new Vector3(), Infinity);
        return;
      }
      if (position) {
        const center = this.boundingSphere.center;
        _box$2.setFromBufferAttribute(position);
        if (morphAttributesPosition) {
          for (let i = 0, il = morphAttributesPosition.length; i < il; i++) {
            const morphAttribute = morphAttributesPosition[i];
            _boxMorphTargets.setFromBufferAttribute(morphAttribute);
            if (this.morphTargetsRelative) {
              _vector$8.addVectors(_box$2.min, _boxMorphTargets.min);
              _box$2.expandByPoint(_vector$8);
              _vector$8.addVectors(_box$2.max, _boxMorphTargets.max);
              _box$2.expandByPoint(_vector$8);
            } else {
              _box$2.expandByPoint(_boxMorphTargets.min);
              _box$2.expandByPoint(_boxMorphTargets.max);
            }
          }
        }
        _box$2.getCenter(center);
        let maxRadiusSq = 0;
        for (let i = 0, il = position.count; i < il; i++) {
          _vector$8.fromBufferAttribute(position, i);
          maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector$8));
        }
        if (morphAttributesPosition) {
          for (let i = 0, il = morphAttributesPosition.length; i < il; i++) {
            const morphAttribute = morphAttributesPosition[i];
            const morphTargetsRelative = this.morphTargetsRelative;
            for (let j = 0, jl = morphAttribute.count; j < jl; j++) {
              _vector$8.fromBufferAttribute(morphAttribute, j);
              if (morphTargetsRelative) {
                _offset.fromBufferAttribute(position, j);
                _vector$8.add(_offset);
              }
              maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector$8));
            }
          }
        }
        this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
        if (isNaN(this.boundingSphere.radius)) {
          console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
        }
      }
    }
    computeTangents() {
      const index = this.index;
      const attributes = this.attributes;
      if (index === null || attributes.position === void 0 || attributes.normal === void 0 || attributes.uv === void 0) {
        console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
        return;
      }
      const indices = index.array;
      const positions = attributes.position.array;
      const normals = attributes.normal.array;
      const uvs = attributes.uv.array;
      const nVertices = positions.length / 3;
      if (this.hasAttribute("tangent") === false) {
        this.setAttribute("tangent", new BufferAttribute(new Float32Array(4 * nVertices), 4));
      }
      const tangents = this.getAttribute("tangent").array;
      const tan1 = [], tan2 = [];
      for (let i = 0; i < nVertices; i++) {
        tan1[i] = new Vector3();
        tan2[i] = new Vector3();
      }
      const vA = new Vector3(), vB = new Vector3(), vC = new Vector3(), uvA = new Vector2(), uvB = new Vector2(), uvC = new Vector2(), sdir = new Vector3(), tdir = new Vector3();
      function handleTriangle(a, b, c) {
        vA.fromArray(positions, a * 3);
        vB.fromArray(positions, b * 3);
        vC.fromArray(positions, c * 3);
        uvA.fromArray(uvs, a * 2);
        uvB.fromArray(uvs, b * 2);
        uvC.fromArray(uvs, c * 2);
        vB.sub(vA);
        vC.sub(vA);
        uvB.sub(uvA);
        uvC.sub(uvA);
        const r = 1 / (uvB.x * uvC.y - uvC.x * uvB.y);
        if (!isFinite(r)) return;
        sdir.copy(vB).multiplyScalar(uvC.y).addScaledVector(vC, -uvB.y).multiplyScalar(r);
        tdir.copy(vC).multiplyScalar(uvB.x).addScaledVector(vB, -uvC.x).multiplyScalar(r);
        tan1[a].add(sdir);
        tan1[b].add(sdir);
        tan1[c].add(sdir);
        tan2[a].add(tdir);
        tan2[b].add(tdir);
        tan2[c].add(tdir);
      }
      let groups = this.groups;
      if (groups.length === 0) {
        groups = [{
          start: 0,
          count: indices.length
        }];
      }
      for (let i = 0, il = groups.length; i < il; ++i) {
        const group = groups[i];
        const start = group.start;
        const count = group.count;
        for (let j = start, jl = start + count; j < jl; j += 3) {
          handleTriangle(
            indices[j + 0],
            indices[j + 1],
            indices[j + 2]
          );
        }
      }
      const tmp = new Vector3(), tmp2 = new Vector3();
      const n = new Vector3(), n2 = new Vector3();
      function handleVertex(v) {
        n.fromArray(normals, v * 3);
        n2.copy(n);
        const t = tan1[v];
        tmp.copy(t);
        tmp.sub(n.multiplyScalar(n.dot(t))).normalize();
        tmp2.crossVectors(n2, t);
        const test = tmp2.dot(tan2[v]);
        const w = test < 0 ? -1 : 1;
        tangents[v * 4] = tmp.x;
        tangents[v * 4 + 1] = tmp.y;
        tangents[v * 4 + 2] = tmp.z;
        tangents[v * 4 + 3] = w;
      }
      for (let i = 0, il = groups.length; i < il; ++i) {
        const group = groups[i];
        const start = group.start;
        const count = group.count;
        for (let j = start, jl = start + count; j < jl; j += 3) {
          handleVertex(indices[j + 0]);
          handleVertex(indices[j + 1]);
          handleVertex(indices[j + 2]);
        }
      }
    }
    computeVertexNormals() {
      const index = this.index;
      const positionAttribute = this.getAttribute("position");
      if (positionAttribute !== void 0) {
        let normalAttribute = this.getAttribute("normal");
        if (normalAttribute === void 0) {
          normalAttribute = new BufferAttribute(new Float32Array(positionAttribute.count * 3), 3);
          this.setAttribute("normal", normalAttribute);
        } else {
          for (let i = 0, il = normalAttribute.count; i < il; i++) {
            normalAttribute.setXYZ(i, 0, 0, 0);
          }
        }
        const pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
        const nA = new Vector3(), nB = new Vector3(), nC = new Vector3();
        const cb = new Vector3(), ab = new Vector3();
        if (index) {
          for (let i = 0, il = index.count; i < il; i += 3) {
            const vA = index.getX(i + 0);
            const vB = index.getX(i + 1);
            const vC = index.getX(i + 2);
            pA.fromBufferAttribute(positionAttribute, vA);
            pB.fromBufferAttribute(positionAttribute, vB);
            pC.fromBufferAttribute(positionAttribute, vC);
            cb.subVectors(pC, pB);
            ab.subVectors(pA, pB);
            cb.cross(ab);
            nA.fromBufferAttribute(normalAttribute, vA);
            nB.fromBufferAttribute(normalAttribute, vB);
            nC.fromBufferAttribute(normalAttribute, vC);
            nA.add(cb);
            nB.add(cb);
            nC.add(cb);
            normalAttribute.setXYZ(vA, nA.x, nA.y, nA.z);
            normalAttribute.setXYZ(vB, nB.x, nB.y, nB.z);
            normalAttribute.setXYZ(vC, nC.x, nC.y, nC.z);
          }
        } else {
          for (let i = 0, il = positionAttribute.count; i < il; i += 3) {
            pA.fromBufferAttribute(positionAttribute, i + 0);
            pB.fromBufferAttribute(positionAttribute, i + 1);
            pC.fromBufferAttribute(positionAttribute, i + 2);
            cb.subVectors(pC, pB);
            ab.subVectors(pA, pB);
            cb.cross(ab);
            normalAttribute.setXYZ(i + 0, cb.x, cb.y, cb.z);
            normalAttribute.setXYZ(i + 1, cb.x, cb.y, cb.z);
            normalAttribute.setXYZ(i + 2, cb.x, cb.y, cb.z);
          }
        }
        this.normalizeNormals();
        normalAttribute.needsUpdate = true;
      }
    }
    normalizeNormals() {
      const normals = this.attributes.normal;
      for (let i = 0, il = normals.count; i < il; i++) {
        _vector$8.fromBufferAttribute(normals, i);
        _vector$8.normalize();
        normals.setXYZ(i, _vector$8.x, _vector$8.y, _vector$8.z);
      }
    }
    toNonIndexed() {
      function convertBufferAttribute(attribute, indices2) {
        const array = attribute.array;
        const itemSize = attribute.itemSize;
        const normalized = attribute.normalized;
        const array2 = new array.constructor(indices2.length * itemSize);
        let index = 0, index2 = 0;
        for (let i = 0, l = indices2.length; i < l; i++) {
          if (attribute.isInterleavedBufferAttribute) {
            index = indices2[i] * attribute.data.stride + attribute.offset;
          } else {
            index = indices2[i] * itemSize;
          }
          for (let j = 0; j < itemSize; j++) {
            array2[index2++] = array[index++];
          }
        }
        return new BufferAttribute(array2, itemSize, normalized);
      }
      if (this.index === null) {
        console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.");
        return this;
      }
      const geometry2 = new _BufferGeometry();
      const indices = this.index.array;
      const attributes = this.attributes;
      for (const name in attributes) {
        const attribute = attributes[name];
        const newAttribute = convertBufferAttribute(attribute, indices);
        geometry2.setAttribute(name, newAttribute);
      }
      const morphAttributes = this.morphAttributes;
      for (const name in morphAttributes) {
        const morphArray = [];
        const morphAttribute = morphAttributes[name];
        for (let i = 0, il = morphAttribute.length; i < il; i++) {
          const attribute = morphAttribute[i];
          const newAttribute = convertBufferAttribute(attribute, indices);
          morphArray.push(newAttribute);
        }
        geometry2.morphAttributes[name] = morphArray;
      }
      geometry2.morphTargetsRelative = this.morphTargetsRelative;
      const groups = this.groups;
      for (let i = 0, l = groups.length; i < l; i++) {
        const group = groups[i];
        geometry2.addGroup(group.start, group.count, group.materialIndex);
      }
      return geometry2;
    }
    toJSON() {
      const data = {
        metadata: {
          version: 4.6,
          type: "BufferGeometry",
          generator: "BufferGeometry.toJSON"
        }
      };
      data.uuid = this.uuid;
      data.type = this.type;
      if (this.name !== "") data.name = this.name;
      if (Object.keys(this.userData).length > 0) data.userData = this.userData;
      if (this.parameters !== void 0) {
        const parameters = this.parameters;
        for (const key in parameters) {
          if (parameters[key] !== void 0) data[key] = parameters[key];
        }
        return data;
      }
      data.data = { attributes: {} };
      const index = this.index;
      if (index !== null) {
        data.data.index = {
          type: index.array.constructor.name,
          array: Array.prototype.slice.call(index.array)
        };
      }
      const attributes = this.attributes;
      for (const key in attributes) {
        const attribute = attributes[key];
        data.data.attributes[key] = attribute.toJSON(data.data);
      }
      const morphAttributes = {};
      let hasMorphAttributes = false;
      for (const key in this.morphAttributes) {
        const attributeArray = this.morphAttributes[key];
        const array = [];
        for (let i = 0, il = attributeArray.length; i < il; i++) {
          const attribute = attributeArray[i];
          array.push(attribute.toJSON(data.data));
        }
        if (array.length > 0) {
          morphAttributes[key] = array;
          hasMorphAttributes = true;
        }
      }
      if (hasMorphAttributes) {
        data.data.morphAttributes = morphAttributes;
        data.data.morphTargetsRelative = this.morphTargetsRelative;
      }
      const groups = this.groups;
      if (groups.length > 0) {
        data.data.groups = JSON.parse(JSON.stringify(groups));
      }
      const boundingSphere = this.boundingSphere;
      if (boundingSphere !== null) {
        data.data.boundingSphere = {
          center: boundingSphere.center.toArray(),
          radius: boundingSphere.radius
        };
      }
      return data;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(source) {
      this.index = null;
      this.attributes = {};
      this.morphAttributes = {};
      this.groups = [];
      this.boundingBox = null;
      this.boundingSphere = null;
      const data = {};
      this.name = source.name;
      const index = source.index;
      if (index !== null) {
        this.setIndex(index.clone(data));
      }
      const attributes = source.attributes;
      for (const name in attributes) {
        const attribute = attributes[name];
        this.setAttribute(name, attribute.clone(data));
      }
      const morphAttributes = source.morphAttributes;
      for (const name in morphAttributes) {
        const array = [];
        const morphAttribute = morphAttributes[name];
        for (let i = 0, l = morphAttribute.length; i < l; i++) {
          array.push(morphAttribute[i].clone(data));
        }
        this.morphAttributes[name] = array;
      }
      this.morphTargetsRelative = source.morphTargetsRelative;
      const groups = source.groups;
      for (let i = 0, l = groups.length; i < l; i++) {
        const group = groups[i];
        this.addGroup(group.start, group.count, group.materialIndex);
      }
      const boundingBox = source.boundingBox;
      if (boundingBox !== null) {
        this.boundingBox = boundingBox.clone();
      }
      const boundingSphere = source.boundingSphere;
      if (boundingSphere !== null) {
        this.boundingSphere = boundingSphere.clone();
      }
      this.drawRange.start = source.drawRange.start;
      this.drawRange.count = source.drawRange.count;
      this.userData = source.userData;
      return this;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
  };
  var _inverseMatrix$3 = /* @__PURE__ */ new Matrix4();
  var _ray$3 = /* @__PURE__ */ new Ray();
  var _sphere$6 = /* @__PURE__ */ new Sphere();
  var _sphereHitAt = /* @__PURE__ */ new Vector3();
  var _vA$1 = /* @__PURE__ */ new Vector3();
  var _vB$1 = /* @__PURE__ */ new Vector3();
  var _vC$1 = /* @__PURE__ */ new Vector3();
  var _tempA = /* @__PURE__ */ new Vector3();
  var _morphA = /* @__PURE__ */ new Vector3();
  var _uvA$1 = /* @__PURE__ */ new Vector2();
  var _uvB$1 = /* @__PURE__ */ new Vector2();
  var _uvC$1 = /* @__PURE__ */ new Vector2();
  var _normalA = /* @__PURE__ */ new Vector3();
  var _normalB = /* @__PURE__ */ new Vector3();
  var _normalC = /* @__PURE__ */ new Vector3();
  var _intersectionPoint = /* @__PURE__ */ new Vector3();
  var _intersectionPointWorld = /* @__PURE__ */ new Vector3();
  var Mesh = class extends Object3D {
    constructor(geometry = new BufferGeometry(), material = new MeshBasicMaterial()) {
      super();
      this.isMesh = true;
      this.type = "Mesh";
      this.geometry = geometry;
      this.material = material;
      this.updateMorphTargets();
    }
    copy(source, recursive) {
      super.copy(source, recursive);
      if (source.morphTargetInfluences !== void 0) {
        this.morphTargetInfluences = source.morphTargetInfluences.slice();
      }
      if (source.morphTargetDictionary !== void 0) {
        this.morphTargetDictionary = Object.assign({}, source.morphTargetDictionary);
      }
      this.material = Array.isArray(source.material) ? source.material.slice() : source.material;
      this.geometry = source.geometry;
      return this;
    }
    updateMorphTargets() {
      const geometry = this.geometry;
      const morphAttributes = geometry.morphAttributes;
      const keys = Object.keys(morphAttributes);
      if (keys.length > 0) {
        const morphAttribute = morphAttributes[keys[0]];
        if (morphAttribute !== void 0) {
          this.morphTargetInfluences = [];
          this.morphTargetDictionary = {};
          for (let m = 0, ml = morphAttribute.length; m < ml; m++) {
            const name = morphAttribute[m].name || String(m);
            this.morphTargetInfluences.push(0);
            this.morphTargetDictionary[name] = m;
          }
        }
      }
    }
    getVertexPosition(index, target) {
      const geometry = this.geometry;
      const position = geometry.attributes.position;
      const morphPosition = geometry.morphAttributes.position;
      const morphTargetsRelative = geometry.morphTargetsRelative;
      target.fromBufferAttribute(position, index);
      const morphInfluences = this.morphTargetInfluences;
      if (morphPosition && morphInfluences) {
        _morphA.set(0, 0, 0);
        for (let i = 0, il = morphPosition.length; i < il; i++) {
          const influence = morphInfluences[i];
          const morphAttribute = morphPosition[i];
          if (influence === 0) continue;
          _tempA.fromBufferAttribute(morphAttribute, index);
          if (morphTargetsRelative) {
            _morphA.addScaledVector(_tempA, influence);
          } else {
            _morphA.addScaledVector(_tempA.sub(target), influence);
          }
        }
        target.add(_morphA);
      }
      return target;
    }
    raycast(raycaster, intersects) {
      const geometry = this.geometry;
      const material = this.material;
      const matrixWorld = this.matrixWorld;
      if (material === void 0) return;
      if (geometry.boundingSphere === null) geometry.computeBoundingSphere();
      _sphere$6.copy(geometry.boundingSphere);
      _sphere$6.applyMatrix4(matrixWorld);
      _ray$3.copy(raycaster.ray).recast(raycaster.near);
      if (_sphere$6.containsPoint(_ray$3.origin) === false) {
        if (_ray$3.intersectSphere(_sphere$6, _sphereHitAt) === null) return;
        if (_ray$3.origin.distanceToSquared(_sphereHitAt) > (raycaster.far - raycaster.near) ** 2) return;
      }
      _inverseMatrix$3.copy(matrixWorld).invert();
      _ray$3.copy(raycaster.ray).applyMatrix4(_inverseMatrix$3);
      if (geometry.boundingBox !== null) {
        if (_ray$3.intersectsBox(geometry.boundingBox) === false) return;
      }
      this._computeIntersections(raycaster, intersects, _ray$3);
    }
    _computeIntersections(raycaster, intersects, rayLocalSpace) {
      let intersection;
      const geometry = this.geometry;
      const material = this.material;
      const index = geometry.index;
      const position = geometry.attributes.position;
      const uv = geometry.attributes.uv;
      const uv1 = geometry.attributes.uv1;
      const normal = geometry.attributes.normal;
      const groups = geometry.groups;
      const drawRange = geometry.drawRange;
      if (index !== null) {
        if (Array.isArray(material)) {
          for (let i = 0, il = groups.length; i < il; i++) {
            const group = groups[i];
            const groupMaterial = material[group.materialIndex];
            const start = Math.max(group.start, drawRange.start);
            const end = Math.min(index.count, Math.min(group.start + group.count, drawRange.start + drawRange.count));
            for (let j = start, jl = end; j < jl; j += 3) {
              const a = index.getX(j);
              const b = index.getX(j + 1);
              const c = index.getX(j + 2);
              intersection = checkGeometryIntersection(this, groupMaterial, raycaster, rayLocalSpace, uv, uv1, normal, a, b, c);
              if (intersection) {
                intersection.faceIndex = Math.floor(j / 3);
                intersection.face.materialIndex = group.materialIndex;
                intersects.push(intersection);
              }
            }
          }
        } else {
          const start = Math.max(0, drawRange.start);
          const end = Math.min(index.count, drawRange.start + drawRange.count);
          for (let i = start, il = end; i < il; i += 3) {
            const a = index.getX(i);
            const b = index.getX(i + 1);
            const c = index.getX(i + 2);
            intersection = checkGeometryIntersection(this, material, raycaster, rayLocalSpace, uv, uv1, normal, a, b, c);
            if (intersection) {
              intersection.faceIndex = Math.floor(i / 3);
              intersects.push(intersection);
            }
          }
        }
      } else if (position !== void 0) {
        if (Array.isArray(material)) {
          for (let i = 0, il = groups.length; i < il; i++) {
            const group = groups[i];
            const groupMaterial = material[group.materialIndex];
            const start = Math.max(group.start, drawRange.start);
            const end = Math.min(position.count, Math.min(group.start + group.count, drawRange.start + drawRange.count));
            for (let j = start, jl = end; j < jl; j += 3) {
              const a = j;
              const b = j + 1;
              const c = j + 2;
              intersection = checkGeometryIntersection(this, groupMaterial, raycaster, rayLocalSpace, uv, uv1, normal, a, b, c);
              if (intersection) {
                intersection.faceIndex = Math.floor(j / 3);
                intersection.face.materialIndex = group.materialIndex;
                intersects.push(intersection);
              }
            }
          }
        } else {
          const start = Math.max(0, drawRange.start);
          const end = Math.min(position.count, drawRange.start + drawRange.count);
          for (let i = start, il = end; i < il; i += 3) {
            const a = i;
            const b = i + 1;
            const c = i + 2;
            intersection = checkGeometryIntersection(this, material, raycaster, rayLocalSpace, uv, uv1, normal, a, b, c);
            if (intersection) {
              intersection.faceIndex = Math.floor(i / 3);
              intersects.push(intersection);
            }
          }
        }
      }
    }
  };
  function checkIntersection(object, material, raycaster, ray, pA, pB, pC, point) {
    let intersect;
    if (material.side === BackSide) {
      intersect = ray.intersectTriangle(pC, pB, pA, true, point);
    } else {
      intersect = ray.intersectTriangle(pA, pB, pC, material.side === FrontSide, point);
    }
    if (intersect === null) return null;
    _intersectionPointWorld.copy(point);
    _intersectionPointWorld.applyMatrix4(object.matrixWorld);
    const distance = raycaster.ray.origin.distanceTo(_intersectionPointWorld);
    if (distance < raycaster.near || distance > raycaster.far) return null;
    return {
      distance,
      point: _intersectionPointWorld.clone(),
      object
    };
  }
  function checkGeometryIntersection(object, material, raycaster, ray, uv, uv1, normal, a, b, c) {
    object.getVertexPosition(a, _vA$1);
    object.getVertexPosition(b, _vB$1);
    object.getVertexPosition(c, _vC$1);
    const intersection = checkIntersection(object, material, raycaster, ray, _vA$1, _vB$1, _vC$1, _intersectionPoint);
    if (intersection) {
      if (uv) {
        _uvA$1.fromBufferAttribute(uv, a);
        _uvB$1.fromBufferAttribute(uv, b);
        _uvC$1.fromBufferAttribute(uv, c);
        intersection.uv = Triangle.getInterpolation(_intersectionPoint, _vA$1, _vB$1, _vC$1, _uvA$1, _uvB$1, _uvC$1, new Vector2());
      }
      if (uv1) {
        _uvA$1.fromBufferAttribute(uv1, a);
        _uvB$1.fromBufferAttribute(uv1, b);
        _uvC$1.fromBufferAttribute(uv1, c);
        intersection.uv1 = Triangle.getInterpolation(_intersectionPoint, _vA$1, _vB$1, _vC$1, _uvA$1, _uvB$1, _uvC$1, new Vector2());
        intersection.uv2 = intersection.uv1;
      }
      if (normal) {
        _normalA.fromBufferAttribute(normal, a);
        _normalB.fromBufferAttribute(normal, b);
        _normalC.fromBufferAttribute(normal, c);
        intersection.normal = Triangle.getInterpolation(_intersectionPoint, _vA$1, _vB$1, _vC$1, _normalA, _normalB, _normalC, new Vector3());
        if (intersection.normal.dot(ray.direction) > 0) {
          intersection.normal.multiplyScalar(-1);
        }
      }
      const face = {
        a,
        b,
        c,
        normal: new Vector3(),
        materialIndex: 0
      };
      Triangle.getNormal(_vA$1, _vB$1, _vC$1, face.normal);
      intersection.face = face;
    }
    return intersection;
  }
  var _vector1 = /* @__PURE__ */ new Vector3();
  var _vector2 = /* @__PURE__ */ new Vector3();
  var _normalMatrix = /* @__PURE__ */ new Matrix3();
  var Plane = class {
    constructor(normal = new Vector3(1, 0, 0), constant = 0) {
      this.isPlane = true;
      this.normal = normal;
      this.constant = constant;
    }
    set(normal, constant) {
      this.normal.copy(normal);
      this.constant = constant;
      return this;
    }
    setComponents(x, y, z, w) {
      this.normal.set(x, y, z);
      this.constant = w;
      return this;
    }
    setFromNormalAndCoplanarPoint(normal, point) {
      this.normal.copy(normal);
      this.constant = -point.dot(this.normal);
      return this;
    }
    setFromCoplanarPoints(a, b, c) {
      const normal = _vector1.subVectors(c, b).cross(_vector2.subVectors(a, b)).normalize();
      this.setFromNormalAndCoplanarPoint(normal, a);
      return this;
    }
    copy(plane) {
      this.normal.copy(plane.normal);
      this.constant = plane.constant;
      return this;
    }
    normalize() {
      const inverseNormalLength = 1 / this.normal.length();
      this.normal.multiplyScalar(inverseNormalLength);
      this.constant *= inverseNormalLength;
      return this;
    }
    negate() {
      this.constant *= -1;
      this.normal.negate();
      return this;
    }
    distanceToPoint(point) {
      return this.normal.dot(point) + this.constant;
    }
    distanceToSphere(sphere) {
      return this.distanceToPoint(sphere.center) - sphere.radius;
    }
    projectPoint(point, target) {
      return target.copy(point).addScaledVector(this.normal, -this.distanceToPoint(point));
    }
    intersectLine(line, target) {
      const direction = line.delta(_vector1);
      const denominator = this.normal.dot(direction);
      if (denominator === 0) {
        if (this.distanceToPoint(line.start) === 0) {
          return target.copy(line.start);
        }
        return null;
      }
      const t = -(line.start.dot(this.normal) + this.constant) / denominator;
      if (t < 0 || t > 1) {
        return null;
      }
      return target.copy(line.start).addScaledVector(direction, t);
    }
    intersectsLine(line) {
      const startSign = this.distanceToPoint(line.start);
      const endSign = this.distanceToPoint(line.end);
      return startSign < 0 && endSign > 0 || endSign < 0 && startSign > 0;
    }
    intersectsBox(box) {
      return box.intersectsPlane(this);
    }
    intersectsSphere(sphere) {
      return sphere.intersectsPlane(this);
    }
    coplanarPoint(target) {
      return target.copy(this.normal).multiplyScalar(-this.constant);
    }
    applyMatrix4(matrix, optionalNormalMatrix) {
      const normalMatrix = optionalNormalMatrix || _normalMatrix.getNormalMatrix(matrix);
      const referencePoint = this.coplanarPoint(_vector1).applyMatrix4(matrix);
      const normal = this.normal.applyMatrix3(normalMatrix).normalize();
      this.constant = -referencePoint.dot(normal);
      return this;
    }
    translate(offset) {
      this.constant -= offset.dot(this.normal);
      return this;
    }
    equals(plane) {
      return plane.normal.equals(this.normal) && plane.constant === this.constant;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var DepthTexture = class extends Texture {
    constructor(width, height, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, format) {
      format = format !== void 0 ? format : DepthFormat;
      if (format !== DepthFormat && format !== DepthStencilFormat) {
        throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
      }
      if (type === void 0 && format === DepthFormat) type = UnsignedIntType;
      if (type === void 0 && format === DepthStencilFormat) type = UnsignedInt248Type;
      super(null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);
      this.isDepthTexture = true;
      this.image = { width, height };
      this.magFilter = magFilter !== void 0 ? magFilter : NearestFilter;
      this.minFilter = minFilter !== void 0 ? minFilter : NearestFilter;
      this.flipY = false;
      this.generateMipmaps = false;
      this.compareFunction = null;
    }
    copy(source) {
      super.copy(source);
      this.compareFunction = source.compareFunction;
      return this;
    }
    toJSON(meta) {
      const data = super.toJSON(meta);
      if (this.compareFunction !== null) data.compareFunction = this.compareFunction;
      return data;
    }
  };
  var emptyShadowTexture = /* @__PURE__ */ new DepthTexture(1, 1);
  emptyShadowTexture.compareFunction = LessEqualCompare;
  var Scene = class extends Object3D {
    constructor() {
      super();
      this.isScene = true;
      this.type = "Scene";
      this.background = null;
      this.environment = null;
      this.fog = null;
      this.backgroundBlurriness = 0;
      this.backgroundIntensity = 1;
      this.overrideMaterial = null;
      if (typeof __THREE_DEVTOOLS__ !== "undefined") {
        __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
      }
    }
    copy(source, recursive) {
      super.copy(source, recursive);
      if (source.background !== null) this.background = source.background.clone();
      if (source.environment !== null) this.environment = source.environment.clone();
      if (source.fog !== null) this.fog = source.fog.clone();
      this.backgroundBlurriness = source.backgroundBlurriness;
      this.backgroundIntensity = source.backgroundIntensity;
      if (source.overrideMaterial !== null) this.overrideMaterial = source.overrideMaterial.clone();
      this.matrixAutoUpdate = source.matrixAutoUpdate;
      return this;
    }
    toJSON(meta) {
      const data = super.toJSON(meta);
      if (this.fog !== null) data.object.fog = this.fog.toJSON();
      if (this.backgroundBlurriness > 0) data.object.backgroundBlurriness = this.backgroundBlurriness;
      if (this.backgroundIntensity !== 1) data.object.backgroundIntensity = this.backgroundIntensity;
      return data;
    }
  };
  if (typeof __THREE_DEVTOOLS__ !== "undefined") {
    __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
      revision: REVISION
    } }));
  }
  if (typeof window !== "undefined") {
    if (window.__THREE__) {
      console.warn("WARNING: Multiple instances of Three.js being imported.");
    } else {
      window.__THREE__ = REVISION;
    }
  }

  // src/DomObject.ts
  function computeBox(o) {
    let hasMesh = false;
    const box = new Box3();
    o.traverse((child) => {
      if (child instanceof Mesh && child.geometry) {
        hasMesh = true;
        child.geometry.computeBoundingBox();
      }
    });
    if (hasMesh) box.expandByObject(o);
    return box;
  }
  var DomObject = class {
    constructor(node, element, camera) {
      this.node = node;
      this.element = element;
      this.camera = camera;
      this.center = new Vector3();
      this.size = new Vector3();
      this.world = new Vector3();
      this.dir = new Vector3();
      this.ray = new Ray();
      this.plane = new Plane(new Vector3(0, 0, 1), 0);
      this.tempV1 = new Vector3();
      // reuse temp vectors
      this.tempV2 = new Vector3();
      const wb = new Box3().setFromObject(node);
      this.center.copy(wb.getCenter(this.tempV1));
      this.size.copy(computeBox(node).getSize(this.tempV2));
    }
    update() {
      const r = this.element.getBoundingClientRect();
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ndcX = (r.left + r.width * 0.5) / w * 2 - 1;
      const ndcY = -(r.top + r.height * 0.5) / h * 2 + 1;
      this.world.set(ndcX, ndcY, 0.5).unproject(this.camera);
      this.dir.copy(this.world).sub(this.camera.position).normalize();
      this.ray.origin.copy(this.camera.position);
      this.ray.direction.copy(this.dir);
      this.ray.intersectPlane(this.plane, this.node.position);
      const dist = this.camera.position.distanceTo(this.node.position);
      const vh = 2 * Math.tan(MathUtils.DEG2RAD * 0.5 * this.camera.fov) * dist;
      const vw = vh * this.camera.aspect;
      const pixelToWorldX = vw / w;
      const pixelToWorldY = vh / h;
      const dz = this.element.hasAttribute("data-z") ? parseFloat(this.element.getAttribute("data-z") ?? "0") : 0;
      const rotX = this.element.hasAttribute("data-rot-x") ? MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-x") ?? "0") : 0;
      const rotY = this.element.hasAttribute("data-rot-y") ? MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-y") ?? "0") : 0;
      const rotZ = this.element.hasAttribute("data-rot-z") ? MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-z") ?? "0") : 0;
      if (this.element.hasAttribute("data-z")) this.node.position.z += dz * pixelToWorldY;
      const sx = r.width * pixelToWorldX / this.size.x;
      const sy = r.height * pixelToWorldY / this.size.y;
      const s = Math.min(sx, sy);
      this.node.scale.set(s, s, s * this.size.z / this.size.y);
      this.node.position.x -= this.center.x * s;
      this.node.position.y -= this.center.y * s;
      this.node.position.z -= this.center.z * s;
      if (this.element.hasAttribute("data-rot-x") || this.element.hasAttribute("data-rot-y") || this.element.hasAttribute("data-rot-z"))
        this.node.rotation.set(rotX, rotY, rotZ);
    }
  };

  // src/index.ts
  var Scene2 = class extends Scene {
    constructor(camera) {
      super();
      this.camera = camera;
      this.aligned = [];
    }
    add(...args) {
      if (args.length === 2 && args[1] instanceof Element) {
        const [object, el] = args;
        const domObj = new DomObject(object, el, this.camera);
        this.aligned.push(domObj);
        super.add(object);
        return this;
      }
      super.add(...args);
      return this;
    }
    update() {
      this.aligned.forEach((o) => o.update());
    }
  };
  /*! Bundled license information:

  three/build/three.module.js:
    (**
     * @license
     * Copyright 2010-2023 Three.js Authors
     * SPDX-License-Identifier: MIT
     *)
  */

  return Scene2;

})();
//# sourceMappingURL=index.global.js.map
//# sourceMappingURL=index.global.js.map