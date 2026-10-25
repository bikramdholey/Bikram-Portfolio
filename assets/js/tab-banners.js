// Animated, theme-coloured scenes for each tab (see _includes/tab_banner.liquid).
// Every <canvas data-scene="..."> gets drawn by the matching function in SCENES.
// Colours come from the page's CSS variables, so light/dark mode just works.
// Scenes pause when off screen, and show a still frame for reduced-motion users.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TAU = Math.PI * 2;

  function palette(el) {
    var cs = getComputedStyle(el);
    function v(name, fallback) {
      var x = cs.getPropertyValue(name).trim();
      return x || fallback;
    }
    return {
      accent: v("--accent", "#00695c"),
      strong: v("--accent-strong", "#004d40"),
      tint: v("--tint", "#e0f2f1"),
      text: v("--global-text-color", "#222"),
      muted: v("--global-text-color-light", "#888"),
      warm: "#f0a830",
      blue: "#4a90d9",
      red: "#e05555",
    };
  }

  function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function arrow(ctx, x1, y1, x2, y2, head) {
    line(ctx, x1, y1, x2, y2);
    var a = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a - 0.5), y2 - head * Math.sin(a - 0.5));
    ctx.lineTo(x2 - head * Math.cos(a + 0.5), y2 - head * Math.sin(a + 0.5));
    ctx.closePath();
    ctx.fill();
  }

  var SCENES = {
    // --- Publications ----------------------------------------------------------

    // Shear-horizontal wave travelling through a two-layer medium (particle grid).
    "elastic-waves": function (ctx, w, h, t, c) {
      var cols = 22, rows = 7, mx = 14, my = 14;
      var dx = (w - 2 * mx) / (cols - 1), dy = (h - 2 * my) / (rows - 1);
      var interface_ = Math.floor(rows / 2);
      ctx.fillStyle = c.tint;
      ctx.fillRect(0, my + interface_ * dy, w, h);
      ctx.strokeStyle = c.muted;
      ctx.setLineDash([4, 4]);
      line(ctx, 0, my + interface_ * dy, w, my + interface_ * dy);
      ctx.setLineDash([]);
      for (var j = 0; j < rows; j++) {
        var lower = j >= interface_;
        var amp = (lower ? 0.55 : 1) * dy * 0.55 * Math.exp(-(j / rows) * 0.6);
        var k = lower ? 0.42 : 0.3; // slower, shorter wave in the stiffer layer
        ctx.fillStyle = lower ? c.strong : c.accent;
        for (var i = 0; i < cols; i++) {
          var phase = i * k - t * 3;
          var x = mx + i * dx;
          var y = my + j * dy + amp * Math.sin(phase); // out-of-plane (SH) motion shown vertically
          ctx.beginPath();
          ctx.arc(x, y, 2.6, 0, TAU);
          ctx.fill();
        }
      }
      ctx.strokeStyle = c.warm;
      ctx.fillStyle = c.warm;
      ctx.lineWidth = 2;
      arrow(ctx, w - 58, 9, w - 14, 9, 6);
      ctx.lineWidth = 1;
    },

    // Cantilever beam vibrating in its first bending mode.
    vibrations: function (ctx, w, h, t, c) {
      var x0 = 26, x1 = w - 22, y0 = h * 0.5, len = x1 - x0;
      ctx.fillStyle = c.muted;
      ctx.fillRect(8, y0 - 34, 18, 68); // clamp
      for (var s = -30; s < 34; s += 9) {
        ctx.strokeStyle = c.muted;
        line(ctx, 8, y0 + s, 2, y0 + s + 6);
      }
      var amp = h * 0.32 * Math.sin(t * 5.2);
      function shape(u) {
        // first cantilever mode shape, normalised to 1 at the tip
        var b = 1.875 * u, sig = 0.734;
        var m = Math.cosh(b) - Math.cos(b) - sig * (Math.sinh(b) - Math.sin(b));
        return m / 2.724;
      }
      for (var ghost = 3; ghost >= 0; ghost--) {
        var a = amp * Math.cos(ghost * 0.35);
        ctx.strokeStyle = ghost ? c.tint : c.accent;
        ctx.lineWidth = ghost ? 3 : 6;
        ctx.beginPath();
        for (var i = 0; i <= 40; i++) {
          var u = i / 40;
          var y = y0 + a * shape(u) * (ghost ? (ghost % 2 ? -1 : 1) : 1);
          if (i === 0) ctx.moveTo(x0 + u * len, y);
          else ctx.lineTo(x0 + u * len, y);
        }
        ctx.stroke();
      }
      ctx.lineWidth = 1;
      ctx.fillStyle = c.strong;
      ctx.beginPath();
      ctx.arc(x1, y0 + amp, 7, 0, TAU);
      ctx.fill();
    },

    // Piezoelectric crystal: squeezing makes surface charges and a voltage.
    piezoelectric: function (ctx, w, h, t, c) {
      var s = (Math.sin(t * 3) + 1) / 2; // 0..1 squeeze
      var bw = Math.min(w * 0.36, 120), bh = h * 0.42 * (1 - 0.18 * s);
      var bx = w * 0.32 - bw / 2, by = h / 2 - bh / 2;
      ctx.fillStyle = c.tint;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      roundRect(ctx, bx, by, bw, bh, 6);
      ctx.fill();
      ctx.stroke();
      ctx.lineWidth = 1;
      // lattice inside the crystal
      ctx.fillStyle = c.accent;
      for (var gx = 1; gx < 5; gx++) {
        for (var gy = 1; gy < 4; gy++) {
          ctx.beginPath();
          ctx.arc(bx + (gx * bw) / 5, by + (gy * bh) / 4, 2.2, 0, TAU);
          ctx.fill();
        }
      }
      // force arrows
      ctx.strokeStyle = c.strong;
      ctx.fillStyle = c.strong;
      ctx.lineWidth = 2;
      arrow(ctx, bx + bw / 2, by - 26 - (1 - s) * 6, bx + bw / 2, by - 4, 6);
      arrow(ctx, bx + bw / 2, by + bh + 26 + (1 - s) * 6, bx + bw / 2, by + bh + 4, 6);
      ctx.lineWidth = 1;
      // charges appear with the squeeze
      ctx.globalAlpha = 0.25 + 0.75 * s;
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      for (var q = 0; q < 4; q++) {
        var qx = bx + ((q + 0.5) * bw) / 4;
        ctx.fillStyle = c.red;
        ctx.fillText("+", qx, by + 13);
        ctx.fillStyle = c.blue;
        ctx.fillText("−", qx, by + bh - 4);
      }
      ctx.globalAlpha = 1;
      // voltmeter
      var mx = w * 0.74, my = h * 0.62, r = Math.min(34, w * 0.13);
      ctx.strokeStyle = c.muted;
      ctx.beginPath();
      ctx.arc(mx, my, r, Math.PI, 0);
      ctx.stroke();
      var ang = Math.PI + 0.25 + s * (Math.PI - 0.5);
      ctx.strokeStyle = c.red;
      ctx.lineWidth = 2;
      line(ctx, mx, my, mx + r * 0.9 * Math.cos(ang), my + r * 0.9 * Math.sin(ang));
      ctx.lineWidth = 1;
      ctx.fillStyle = c.text;
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("V", mx, my + 16);
      ctx.strokeStyle = c.accent;
      line(ctx, bx + bw, by + 6, mx - r, my);
      line(ctx, bx + bw, by + bh - 6, mx + r, my);
    },

    // Piezo cantilever harvester charging a battery and lighting an LED.
    "energy-harvesting": function (ctx, w, h, t, c) {
      var x0 = 20, len = Math.min(w * 0.45, 150), y0 = h * 0.55;
      var amp = h * 0.22 * Math.sin(t * 6);
      ctx.fillStyle = c.muted;
      ctx.fillRect(6, y0 - 26, 14, 52);
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (var i = 0; i <= 30; i++) {
        var u = i / 30;
        var y = y0 + amp * u * u * (3 - u) / 2;
        if (i === 0) ctx.moveTo(x0, y);
        else ctx.lineTo(x0 + u * len, y);
      }
      ctx.stroke();
      ctx.strokeStyle = c.warm; // piezo patch near the root
      ctx.lineWidth = 7;
      line(ctx, x0 + 4, y0 + amp * 0.02, x0 + len * 0.35, y0 + amp * 0.08);
      ctx.lineWidth = 1;
      ctx.fillStyle = c.strong;
      ctx.fillRect(x0 + len - 9, y0 + amp - 9, 18, 18); // tip mass
      // battery charging over time
      var bx = w * 0.72, by = h * 0.28, bw = Math.min(46, w * 0.16), bh = h * 0.46;
      var level = (t * 0.12) % 1;
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 2;
      roundRect(ctx, bx, by, bw, bh, 4);
      ctx.stroke();
      ctx.fillStyle = c.text;
      ctx.fillRect(bx + bw / 2 - 6, by - 5, 12, 5);
      ctx.fillStyle = c.accent;
      ctx.fillRect(bx + 3, by + 3 + (bh - 6) * (1 - level), bw - 6, (bh - 6) * level);
      ctx.lineWidth = 1;
      // LED glow pulses with the vibration
      var glow = Math.abs(Math.sin(t * 6));
      var lx = bx + bw + Math.min(26, w * 0.08), ly = by + 8;
      ctx.fillStyle = "rgba(240,168,48," + (0.15 + 0.5 * glow) + ")";
      ctx.beginPath();
      ctx.arc(lx, ly, 12 + 6 * glow, 0, TAU);
      ctx.fill();
      ctx.fillStyle = c.warm;
      ctx.beginPath();
      ctx.arc(lx, ly, 6, 0, TAU);
      ctx.fill();
      // wires with travelling charge dots
      ctx.strokeStyle = c.accent;
      ctx.setLineDash([3, 4]);
      ctx.lineDashOffset = -t * 30;
      line(ctx, x0 + len * 0.35, y0 + 10, bx, by + bh * 0.7);
      ctx.setLineDash([]);
    },

    // Acoustic/elastic metamaterial: a wave enters a lattice of local resonators
    // and decays inside the band gap while the inner masses ring.
    metamaterials: function (ctx, w, h, t, c) {
      var cells = Math.max(3, Math.min(5, Math.round(w / 70)));
      var x0 = w * 0.3, cw = (w - x0 - 10) / cells, ch = Math.min(cw * 0.95, h * 0.66), y0 = h / 2;
      // incoming wave, attenuated once it enters the lattice
      ctx.strokeStyle = c.warm;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (var x = 4; x <= w - 6; x += 3) {
        var inside = Math.max(0, x - x0);
        var amp = h * 0.22 * Math.exp(-inside / (cw * 1.1));
        var y = y0 + amp * Math.sin(x * 0.09 - t * 4);
        if (x === 4) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
      for (var i = 0; i < cells; i++) {
        var cx = x0 + i * cw + cw / 2;
        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 2;
        roundRect(ctx, cx - cw * 0.42, y0 - ch / 2, cw * 0.84, ch, 5);
        ctx.stroke();
        // inner resonator on two springs, ringing with a lag per cell
        var dx = Math.min(cw * 0.18, 8) * Math.sin(t * 5 - i * 0.9) * Math.exp(-i * 0.25);
        var m = Math.min(cw, ch) * 0.24;
        ctx.strokeStyle = c.muted;
        ctx.lineWidth = 1.2;
        [-1, 1].forEach(function (side) {
          var xa = cx + side * cw * 0.42, xb = cx + dx + side * m / 2;
          ctx.beginPath();
          for (var k = 0; k <= 8; k++) {
            var xx = xa + ((xb - xa) * k) / 8;
            var yy = y0 + (k % 2 ? -1 : 1) * (k === 0 || k === 8 ? 0 : m * 0.25);
            if (k === 0) ctx.moveTo(xx, yy);
            else ctx.lineTo(xx, yy);
          }
          ctx.stroke();
        });
        ctx.fillStyle = c.strong;
        ctx.shadowColor = c.accent;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cx + dx, y0, m / 2, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.lineWidth = 1;
    },

    // Thermoelastic medium: a heated bar — heat front, thermal expansion and a
    // vibration that dies out through thermoelastic damping.
    thermoelastic: function (ctx, w, h, t, c) {
      var x0 = 30, x1 = w - 46, y0 = h * 0.52, len = x1 - x0;
      var cycle = (t * 0.35) % 1; // heat front sweeps along, then restarts
      var vib = Math.exp(-((t * 0.35) % 1) * 3.2) * Math.sin(t * 9);
      // flame at the hot end
      var flick = 1 + 0.15 * Math.sin(t * 13);
      ctx.fillStyle = c.warm;
      ctx.beginPath();
      ctx.ellipse(16, y0, 7 * flick, 13 * flick, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = c.red;
      ctx.beginPath();
      ctx.ellipse(16, y0 + 3, 3.5, 7, 0, 0, TAU);
      ctx.fill();
      // bar coloured by temperature; thickness grows where it is hot
      var seg = 40;
      for (var i = 0; i < seg; i++) {
        var u = i / seg;
        var temp = Math.max(0, Math.min(1, (cycle * 1.25 - u) * 3 + 0.15 * (1 - u)));
        var thick = h * (0.16 + 0.07 * temp);
        var bend = vib * h * 0.12 * Math.sin(Math.PI * u);
        var r = Math.round(74 + 170 * temp), g = Math.round(144 - 60 * temp), b = Math.round(217 - 150 * temp);
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x0 + u * len, y0 - thick / 2 + bend, len / seg + 0.6, thick);
      }
      // heat waves rising from the hot part
      ctx.strokeStyle = c.warm;
      ctx.globalAlpha = 0.6;
      for (var k = 0; k < 3; k++) {
        var hx = x0 + len * Math.min(cycle * 1.25, 1) * (0.25 + 0.3 * k);
        var rise = (t * 22 + k * 9) % 22;
        ctx.beginPath();
        for (var s = 0; s <= 10; s++) {
          var yy = y0 - h * 0.17 - rise - s * 1.4;
          var xx = hx + 3 * Math.sin(s * 0.9 + t * 6);
          if (s === 0) ctx.moveTo(xx, yy);
          else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // thermometer
      var tx = w - 22, ty = h * 0.18, th = h * 0.58;
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 2;
      roundRect(ctx, tx - 5, ty, 10, th, 5);
      ctx.stroke();
      ctx.fillStyle = c.red;
      var fill = th * (0.2 + 0.7 * Math.min(cycle * 1.25, 1));
      ctx.fillRect(tx - 2.5, ty + th - fill, 5, fill);
      ctx.beginPath();
      ctx.arc(tx, ty + th + 5, 7, 0, TAU);
      ctx.fill();
      ctx.lineWidth = 1;
    },

    // Publications hero: a wave packet crossing a layered medium, with ripples.
    "pub-hero": function (ctx, w, h, t, c) {
      var layers = 3;
      for (var l = 0; l < layers; l++) {
        ctx.fillStyle = c.accent;
        ctx.globalAlpha = 0.05 + l * 0.05;
        ctx.fillRect(0, (h * l) / layers, w, h / layers);
      }
      ctx.globalAlpha = 1;
      var cols = Math.round(w / 16), rows = 9;
      var centre = ((t * 0.18) % 1.4) * w - 0.2 * w; // packet position
      for (var j = 0; j < rows; j++) {
        var y0 = ((j + 0.5) * h) / rows;
        var layer = Math.floor((j / rows) * layers);
        ctx.fillStyle = layer === 1 ? c.warm : c.accent;
        for (var i = 0; i <= cols; i++) {
          var x = (i * w) / cols;
          var env = Math.exp(-Math.pow((x - centre - layer * 30) / (w * 0.12), 2));
          var y = y0 + env * (h / rows) * 0.9 * Math.sin(x * 0.07 - t * 5 + layer);
          ctx.globalAlpha = 0.35 + 0.65 * env;
          ctx.beginPath();
          ctx.arc(x, y, 1.6 + 1.4 * env, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      // ripples from a point source
      var sx = w * 0.82, sy = h * 0.5;
      for (var k = 0; k < 4; k++) {
        var r = ((t * 40 + k * 35) % 140) + 6;
        ctx.strokeStyle = c.strong;
        ctx.globalAlpha = Math.max(0, 0.6 - r / 230);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
    },

    // --- Other tabs ----------------------------------------------------------------

    // About: two travelling waves and their interference.
    about: function (ctx, w, h, t, c) {
      var waves = [
        { k: 0.018, wv: 1.6, a: 0.22, col: c.accent },
        { k: 0.026, wv: -1.1, a: 0.16, col: c.warm },
      ];
      waves.forEach(function (wave) {
        ctx.strokeStyle = wave.col;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (var x = 0; x <= w; x += 4) {
          var y = h / 2 + h * wave.a * Math.sin(x * wave.k - t * wave.wv);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.strong;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (var x = 0; x <= w; x += 3) {
        var y = h / 2;
        waves.forEach(function (wave) {
          y += h * wave.a * Math.sin(x * wave.k - t * wave.wv);
        });
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
    },

    // Projects: Morse theory — a level plane sweeping through a torus.
    projects: function (ctx, w, h, t, c) {
      var cx = w / 2, cy = h / 2, R = Math.min(w * 0.22, 150), r = h * 0.28;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R + r, r * 1.35, 0, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 3, R - r * 0.6, r * 0.35, 0, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 2, R - r * 0.75, r * 0.25, 0, Math.PI, TAU);
      ctx.stroke();
      // sweeping level set (height function), critical points light up
      var level = cy + r * 1.35 * Math.cos(t * 0.8);
      ctx.strokeStyle = c.warm;
      ctx.setLineDash([6, 5]);
      line(ctx, cx - R - r - 30, level, cx + R + r + 30, level);
      ctx.setLineDash([]);
      var crit = [cy - r * 1.35, cy - r * 0.3, cy + r * 0.32, cy + r * 1.35];
      crit.forEach(function (y) {
        var near = Math.max(0, 1 - Math.abs(level - y) / 10);
        ctx.fillStyle = near > 0 ? c.warm : c.strong;
        ctx.beginPath();
        ctx.arc(cx, y, 3.5 + 4 * near, 0, TAU);
        ctx.fill();
      });
      ctx.lineWidth = 1;
    },

    // Memories: floating photo frames.
    memories: function (ctx, w, h, t, c) {
      var n = Math.max(4, Math.round(w / 110));
      for (var i = 0; i < n; i++) {
        var x = ((i + 0.5) * w) / n;
        var y = h / 2 + Math.sin(t * 1.2 + i * 1.7) * h * 0.12;
        var rot = Math.sin(t * 0.8 + i) * 0.12;
        var fw = Math.min(64, w / n - 14), fh = fw * 0.8;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = 6;
        ctx.fillRect(-fw / 2, -fh / 2, fw, fh);
        ctx.shadowBlur = 0;
        ctx.fillStyle = i % 2 ? c.accent : c.warm;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(-fw / 2 + 4, -fh / 2 + 4, fw - 8, fh - 14);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    },

    // CV: timeline with milestones lighting up in turn.
    cv: function (ctx, w, h, t, c) {
      var y = h / 2, n = 7, m = 30;
      ctx.strokeStyle = c.muted;
      ctx.lineWidth = 3;
      line(ctx, m, y, w - m, y);
      var p = (t * 0.25) % 1;
      ctx.strokeStyle = c.accent;
      line(ctx, m, y, m + (w - 2 * m) * p, y);
      ctx.lineWidth = 1;
      for (var i = 0; i < n; i++) {
        var x = m + ((w - 2 * m) * i) / (n - 1);
        var done = x <= m + (w - 2 * m) * p;
        ctx.fillStyle = done ? c.accent : c.tint;
        ctx.strokeStyle = c.accent;
        ctx.beginPath();
        ctx.arc(x, y, done ? 8 : 6, 0, TAU);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = done ? c.strong : c.muted;
        ctx.fillRect(x - 14, y + (i % 2 ? 16 : -26), 28, 6);
      }
    },

    // Teaching: maths symbols drifting upward.
    teaching: function (ctx, w, h, t, c) {
      var sym = ["∫", "∑", "π", "∂", "∇", "∞", "√", "λ", "dy/dx", "e^{iπ}", "∮", "θ"];
      var n = Math.max(8, Math.round(w / 55));
      ctx.textAlign = "center";
      for (var i = 0; i < n; i++) {
        var speed = 12 + (i % 4) * 6;
        var y = h + 20 - ((t * speed + i * 37) % (h + 40));
        var x = ((i + 0.5) * w) / n + Math.sin(t + i) * 8;
        ctx.globalAlpha = 0.35 + 0.5 * Math.sin((y / h) * Math.PI);
        ctx.fillStyle = i % 3 ? c.accent : c.warm;
        ctx.font = (16 + (i % 3) * 6) + "px serif";
        ctx.fillText(sym[i % sym.length], x, y);
      }
      ctx.globalAlpha = 1;
    },

    // Contact: an envelope sending out signal ripples.
    contact: function (ctx, w, h, t, c) {
      var cx = w / 2, cy = h / 2, ew = 70, eh = 46;
      for (var k = 0; k < 4; k++) {
        var r = ((t * 30 + k * 30) % 120) + 30;
        ctx.strokeStyle = c.accent;
        ctx.globalAlpha = Math.max(0, 1 - (r - 30) / 120);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.tint;
      ctx.strokeStyle = c.strong;
      ctx.lineWidth = 2;
      ctx.fillRect(cx - ew / 2, cy - eh / 2, ew, eh);
      ctx.strokeRect(cx - ew / 2, cy - eh / 2, ew, eh);
      ctx.beginPath();
      ctx.moveTo(cx - ew / 2, cy - eh / 2);
      ctx.lineTo(cx, cy + 4);
      ctx.lineTo(cx + ew / 2, cy - eh / 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    },

    // Admin: turning gears.
    admin: function (ctx, w, h, t, c) {
      function gear(x, y, r, teeth, a, col) {
        ctx.fillStyle = col;
        ctx.beginPath();
        for (var i = 0; i < teeth * 2; i++) {
          var rr = i % 2 ? r : r * 1.22;
          var ang = a + (i * Math.PI) / teeth;
          ctx.lineTo(x + rr * Math.cos(ang), y + rr * Math.sin(ang));
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = c.tint;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.35, 0, TAU);
        ctx.fill();
      }
      var r = h * 0.3;
      gear(w / 2 - r * 1.1, h / 2, r, 10, t * 0.8, c.accent);
      gear(w / 2 + r * 0.95, h / 2 - r * 0.25, r * 0.7, 7, -t * 0.8 * (10 / 7) + 0.2, c.warm);
    },
  };

  // scenes that look right spread across the whole header
  var FULL_WIDTH = { about: true, teaching: true, memories: true, "pub-hero": true };

  function setup(canvas) {
    var name = canvas.getAttribute("data-scene");
    var draw = SCENES[name];
    var hero = canvas.hasAttribute("data-hero");
    if (!draw) return;
    var ctx = canvas.getContext("2d");
    var visible = true;
    var start = performance.now();

    function frame(now) {
      var dpr = window.devicePixelRatio || 1;
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var time = reduceMotion ? 1.3 : (now - start) / 1000;
      // behind a header title, keep the scene's figure clear of the text on wide screens
      if (hero && w > 640 && !FULL_WIDTH[name]) {
        var shift = w * 0.42;
        ctx.translate(shift, 0);
        draw(ctx, w - shift, h, time, palette(canvas));
      } else {
        draw(ctx, w, h, time, palette(canvas));
      }
      if (!reduceMotion && visible) requestAnimationFrame(frame);
    }

    if ("IntersectionObserver" in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        var was = visible;
        visible = entries[0].isIntersecting;
        if (visible && !was) requestAnimationFrame(frame);
      }).observe(canvas);
    }
    requestAnimationFrame(frame);
    if (reduceMotion) {
      // redraw the still frame when the theme or size changes
      window.addEventListener("resize", function () {
        requestAnimationFrame(frame);
      });
      new MutationObserver(function () {
        requestAnimationFrame(frame);
      }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
  }

  // Scroll reveal: cards, lists and buttons fade up as they come into view, and
  // section titles draw their underline. Content stays visible without this script.
  var REVEAL = [
    ".portfolio-page article h2",
    ".portfolio-page article h2 + ul",
    ".portfolio-page article h2 + ol",
    ".portfolio-page article h3 + ul",
    ".pub-page h2.section-title",
    ".paper-box",
    ".quote-box",
    ".highlight-box",
    ".scene-card",
    ".profile-btn",
    ".memory-card",
    ".portfolio-page .cv .card",
    ".admin-login",
  ].join(",");

  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var items = Array.prototype.slice.call(document.querySelectorAll(REVEAL));
    if (!items.length) return;
    document.documentElement.classList.add("reveal-on");
    var io = new IntersectionObserver(
      function (entries) {
        var batch = 0;
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          el.style.transitionDelay = Math.min(batch++, 5) * 90 + "ms";
          el.classList.add("revealed");
          io.unobserve(el);
          // drop the stagger once shown, so hover effects respond instantly
          setTimeout(function () {
            el.style.transitionDelay = "";
          }, 1400);
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  function init() {
    document.querySelectorAll("canvas[data-scene]").forEach(setup);
    initReveal();
  }

  // the script tag can appear more than once on a page (hero + grid): start once
  if (window.__tabScenesStarted) return;
  window.__tabScenesStarted = true;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
