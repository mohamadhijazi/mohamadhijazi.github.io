function SVGBuilder() {
    this.overlay = document.getElementById('svg-builder-overlay');
    this.canvas = document.getElementById('svg-builder-canvas');
    this.isDrawing = false;
    this.currentTool = 'rectangle';
    this.fillColor = '#ffffff';
    this.strokeColor = '#000000';
    this.strokeWidth = 2;
    this.startPoint = null;
    this.currentPath = null;
    this.shapes = [];
    this.history = [];
    this.editingActorId = null;
    this.textFont = 'Arial';
    this.textSize = 24;

    this.bindEvents();
}

SVGBuilder.prototype.bindEvents = function () {
    var self = this;
    var toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            toolButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            self.currentTool = btn.dataset.tool;
            self.updateCanvasCursor();
        });
    });

    document.getElementById('svg-fill-color').addEventListener('input', function (e) {
        self.fillColor = e.target.value;
    });

    document.getElementById('svg-stroke-color').addEventListener('input', function (e) {
        self.strokeColor = e.target.value;
    });

    document.getElementById('svg-stroke-width').addEventListener('input', function (e) {
        self.strokeWidth = parseInt(e.target.value) || 0;
    });

    document.getElementById('svg-font-family').addEventListener('change', function (e) {
        self.textFont = e.target.value;
    });

    document.getElementById('svg-font-size').addEventListener('input', function (e) {
        self.textSize = parseInt(e.target.value) || 24;
    });

    this.canvas.addEventListener('mousedown', function (e) { self.startDraw(e); });
    this.canvas.addEventListener('mousemove', function (e) { self.draw(e); });
    this.canvas.addEventListener('mouseup', function (e) { self.endDraw(e); });
    this.canvas.addEventListener('mouseleave', function (e) { self.endDraw(e); });

    this.canvas.addEventListener('paste', function (e) { self.handlePaste(e); });

    document.getElementById('btn-undo-svg').addEventListener('click', function () { self.undo(); });
};

SVGBuilder.prototype.updateCanvasCursor = function () {
    this.canvas.classList.remove('text-mode', 'eraser-mode', 'fill-mode');
    if (this.currentTool === 'text') {
        this.canvas.classList.add('text-mode');
    } else if (this.currentTool === 'eraser') {
        this.canvas.classList.add('eraser-mode');
    } else if (this.currentTool === 'fill') {
        this.canvas.classList.add('fill-mode');
    }
};

SVGBuilder.prototype.getCanvasCoords = function (e) {
    var rect = this.canvas.getBoundingClientRect();
    return {
        x: ((e.clientX - rect.left) / rect.width) * 400,
        y: ((e.clientY - rect.top) / rect.height) * 400
    };
};

SVGBuilder.prototype.saveState = function () {
    this.history.push(this.canvas.innerHTML);
    if (this.history.length > 50) {
        this.history.shift();
    }
};

SVGBuilder.prototype.undo = function () {
    if (this.history.length === 0) return;
    var prev = this.history.pop();
    this.canvas.innerHTML = prev;
    this.shapes = this.extractShapesFromCanvas();
};

SVGBuilder.prototype.handlePaste = function (e) {
    e.preventDefault();
    var clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;

    var html = clipboardData.getData('text/html');
    var text = clipboardData.getData('text/plain');
    var svgString = html || text;
    if (!svgString) return;

    var parser = new DOMParser();
    var doc = parser.parseFromString(svgString, 'image/svg+xml');
    var svgEl = doc.documentElement;

    if (svgEl.tagName === 'parsererror') {
        var wrapped = '<svg xmlns="http://www.w3.org/2000/svg">' + svgString + '</svg>';
        doc = parser.parseFromString(wrapped, 'image/svg+xml');
        svgEl = doc.documentElement;
    }

    if (svgEl.tagName === 'parsererror') {
        alert('Invalid SVG data');
        return;
    }

    var inner = '';
    svgEl.childNodes.forEach(function (node) {
        if (node.nodeType === 1) {
            inner += node.outerHTML;
        }
    });
    if (!inner) return;

    this.saveState();
    this.canvas.innerHTML += inner;
    this.shapes = this.extractShapesFromCanvas();
};

SVGBuilder.prototype.extractShapesFromCanvas = function () {
    var shapes = [];
    var nodes = this.canvas.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.nodeType === 1) {
            shapes.push(node.outerHTML);
        }
    }
    return shapes;
};

SVGBuilder.prototype.startDraw = function (e) {
    var coords = this.getCanvasCoords(e);

    if (this.currentTool === 'text') {
        this.addText(coords.x, coords.y);
        return;
    }

    if (this.currentTool === 'eraser') {
        this.eraseAt(coords.x, coords.y);
        return;
    }

    if (this.currentTool === 'fill') {
        this.fillAt(coords.x, coords.y);
        return;
    }

    this.isDrawing = true;
    this.startPoint = coords;

    if (this.currentTool === 'path') {
        this.currentPath = {
            type: 'path',
            d: 'M ' + this.startPoint.x + ' ' + this.startPoint.y,
            fill: this.fillColor,
            stroke: this.strokeColor,
            strokeWidth: this.strokeWidth
        };
        this.shapes.push(this.currentPath);
    }
};

SVGBuilder.prototype.draw = function (e) {
    if (!this.isDrawing) return;
    var current = this.getCanvasCoords(e);

    if (this.currentTool === 'rectangle' && this.startPoint) {
        var previewRect = {
            type: 'rect',
            x: Math.min(this.startPoint.x, current.x),
            y: Math.min(this.startPoint.y, current.y),
            width: Math.abs(current.x - this.startPoint.x),
            height: Math.abs(current.y - this.startPoint.y),
            fill: this.fillColor,
            stroke: this.strokeColor,
            strokeWidth: this.strokeWidth
        };
        this.renderPreview(this.shapes.concat([previewRect]));
    } else if (this.currentTool === 'ellipse' && this.startPoint) {
        var cx = (this.startPoint.x + current.x) / 2;
        var cy = (this.startPoint.y + current.y) / 2;
        var rx = Math.abs(current.x - this.startPoint.x) / 2;
        var ry = Math.abs(current.y - this.startPoint.y) / 2;
        var previewEllipse = {
            type: 'ellipse',
            cx: cx, cy: cy, rx: rx, ry: ry,
            fill: this.fillColor,
            stroke: this.strokeColor,
            strokeWidth: this.strokeWidth
        };
        this.renderPreview(this.shapes.concat([previewEllipse]));
    } else if (this.currentTool === 'path' && this.currentPath) {
        this.currentPath.d += ' L ' + current.x + ' ' + current.y;
        this.renderPreview(this.shapes);
    }
};

SVGBuilder.prototype.endDraw = function (e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    if (this.currentTool !== 'path' && this.startPoint) {
        var current = this.getCanvasCoords(e);
        var shape;
        if (this.currentTool === 'rectangle') {
            shape = {
                type: 'rect',
                x: Math.min(this.startPoint.x, current.x),
                y: Math.min(this.startPoint.y, current.y),
                width: Math.abs(current.x - this.startPoint.x),
                height: Math.abs(current.y - this.startPoint.y),
                fill: this.fillColor,
                stroke: this.strokeColor,
                strokeWidth: this.strokeWidth
            };
        } else if (this.currentTool === 'ellipse') {
            shape = {
                type: 'ellipse',
                cx: (this.startPoint.x + current.x) / 2,
                cy: (this.startPoint.y + current.y) / 2,
                rx: Math.abs(current.x - this.startPoint.x) / 2,
                ry: Math.abs(current.y - this.startPoint.y) / 2,
                fill: this.fillColor,
                stroke: this.strokeColor,
                strokeWidth: this.strokeWidth
            };
        }
        if (shape) {
            this.saveState();
            this.shapes.push(shape);
            this.renderPreview(this.shapes);
        }
    }

    this.startPoint = null;
    this.currentPath = null;
};

SVGBuilder.prototype.addText = function (x, y) {
    var text = prompt('Enter text:');
    if (!text) return;
    this.saveState();
    var textEl = {
        type: 'text',
        x: x,
        y: y,
        content: text,
        fill: this.fillColor,
        fontFamily: this.textFont,
        fontSize: this.textSize
    };
    this.shapes.push(textEl);
    this.renderPreview(this.shapes);
};

SVGBuilder.prototype.eraseAt = function (x, y) {
    var nodes = this.canvas.childNodes;
    for (var i = nodes.length - 1; i >= 0; i--) {
        var node = nodes[i];
        if (node.nodeType !== 1) continue;
        var bbox = node.getBBox();
        if (x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height) {
            this.saveState();
            node.parentNode.removeChild(node);
            this.shapes = this.extractShapesFromCanvas();
            return;
        }
    }
};

SVGBuilder.prototype.fillAt = function (x, y) {
    var nodes = this.canvas.childNodes;
    for (var i = nodes.length - 1; i >= 0; i--) {
        var node = nodes[i];
        if (node.nodeType !== 1) continue;
        var bbox = node.getBBox();
        if (x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height) {
            this.saveState();
            if (node.tagName === 'text') {
                node.setAttribute('fill', this.fillColor);
            } else {
                node.setAttribute('fill', this.fillColor);
            }
            this.shapes = this.extractShapesFromCanvas();
            return;
        }
    }
};

SVGBuilder.prototype.renderPreview = function (shapes) {
    var svgContent = '';
    shapes.forEach(function (shape) {
        if (typeof shape === 'string') {
            svgContent += shape;
        } else if (shape.type === 'rect') {
            svgContent += '<rect x="' + shape.x + '" y="' + shape.y + '" width="' + shape.width + '" height="' + shape.height + '" fill="' + shape.fill + '" stroke="' + shape.stroke + '" stroke-width="' + shape.strokeWidth + '"/>';
        } else if (shape.type === 'ellipse') {
            svgContent += '<ellipse cx="' + shape.cx + '" cy="' + shape.cy + '" rx="' + shape.rx + '" ry="' + shape.ry + '" fill="' + shape.fill + '" stroke="' + shape.stroke + '" stroke-width="' + shape.strokeWidth + '"/>';
        } else if (shape.type === 'path') {
            svgContent += '<path d="' + shape.d + '" fill="' + shape.fill + '" stroke="' + shape.stroke + '" stroke-width="' + shape.strokeWidth + '"/>';
        } else if (shape.type === 'text') {
            svgContent += '<text x="' + shape.x + '" y="' + shape.y + '" fill="' + shape.fill + '" font-family="' + shape.fontFamily + '" font-size="' + shape.fontSize + '">' + shape.content + '</text>';
        }
    });
    this.canvas.innerHTML = svgContent;
};

SVGBuilder.prototype.open = function () {
    this.overlay.classList.remove('hidden');
    this.clear();
    document.getElementById('svg-builder-title').textContent = 'SVG Character Builder';
    document.getElementById('svg-name-input').value = '';
    this.editingActorId = null;
    this.updateCanvasCursor();
};

SVGBuilder.prototype.openForEdit = function (actor) {
    this.overlay.classList.remove('hidden');
    this.editingActorId = actor.id;
    document.getElementById('svg-builder-title').textContent = 'Edit Character';
    document.getElementById('svg-name-input').value = actor.name;

    var svg = actor.svg || '';
    if (svg.trim().indexOf('<svg') === 0) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(svg, 'image/svg+xml');
        var svgEl = doc.documentElement;
        var inner = '';
        svgEl.childNodes.forEach(function (node) {
            if (node.nodeType === 1) {
                inner += node.outerHTML;
            }
        });
        this.saveState();
        this.canvas.innerHTML = inner;
        this.shapes = this.extractShapesFromCanvas();
    } else if (svg.trim() !== '') {
        this.saveState();
        this.canvas.innerHTML = '<text x="200" y="200" text-anchor="middle" dominant-baseline="middle" font-size="80" fill="white">' + svg + '</text>';
        this.shapes = this.extractShapesFromCanvas();
    } else {
        this.clear();
    }
    this.updateCanvasCursor();
};

SVGBuilder.prototype.close = function () {
    this.overlay.classList.add('hidden');
};

SVGBuilder.prototype.clear = function () {
    this.shapes = [];
    this.history = [];
    this.canvas.innerHTML = '';
};

SVGBuilder.prototype.save = function () {
    var self = this;
    var name = document.getElementById('svg-name-input').value.trim();
    if (!name) {
        alert('Please enter a name for the character');
        return;
    }

    var svgString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">' + this.canvas.innerHTML + '</svg>';

    if (!window.app.currentProject) {
        alert('No project selected');
        return;
    }

    if (this.editingActorId) {
        var actor = window.app.currentProject.actors.find(function (a) { return a.id === self.editingActorId; });
        if (actor) {
            actor.name = name;
            actor.svg = svgString;
        }
    } else {
        var actor = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: name,
            svg: svgString,
            keyframes: [
                { frame: window.app.currentFrame || 0, x: 960, y: 540, scale: 1, rotation: 0 }
            ]
        };
        window.app.currentProject.actors.push(actor);
    }

    window.app.renderAssets();
    window.app.saveCurrentProject();
    this.close();
};

window.SVGBuilder = SVGBuilder;
