function Stage() {
    this.canvas = document.getElementById('stage');
    this.ctx = this.canvas.getContext('2d');
    this.project = null;
    this.actors = [];
    this.images = {};
    this.selectedActorId = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.currentFrame = 0;
    this.resolution = [1920, 1080];

    this.setupCanvas();
    this.bindEvents();
}

Stage.prototype.setupCanvas = function () {
    var container = this.canvas.parentElement;
    var containerWidth = container.clientWidth - 32;
    var containerHeight = container.clientHeight - 32;
    var aspectRatio = 16 / 9;

    var width = containerWidth;
    var height = width / aspectRatio;

    if (height > containerHeight) {
        height = containerHeight;
        width = height * aspectRatio;
    }

    this.canvas.width = this.resolution[0];
    this.canvas.height = this.resolution[1];
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.scale = width / this.resolution[0];
};

Stage.prototype.setProject = function (project) {
    this.project = project;
    this.resolution = project.metadata && project.metadata.resolution ? project.metadata.resolution : [1920, 1080];
    this.setupCanvas();
    this.loadImages();
    this.render();
};

Stage.prototype.setFrame = function (frame) {
    this.currentFrame = frame;
    this.render();
};

Stage.prototype.loadImages = function () {
    var self = this;
    this.images = {};
    if (!this.project || !this.project.actors) return;

    this.project.actors.forEach(function (actor) {
        if (actor.svg && actor.svg.trim() !== '') {
            var img = new Image();
            var svgBlob = new Blob([actor.svg], { type: 'image/svg+xml' });
            var url = URL.createObjectURL(svgBlob);
            img.onload = function () {
                self.images[actor.id] = img;
                self.render();
            };
            img.onerror = function () {
                console.error('Failed to load SVG for actor:', actor.id, actor.svg);
            };
            img.src = url;
        }
    });
};

Stage.prototype.getInterpolatedState = function (actor, frame) {
    var keyframes = actor.keyframes || [];
    if (keyframes.length === 0) return { x: 0, y: 0, scale: 1, rotation: 0, visible: true };

    var sorted = keyframes.slice().sort(function (a, b) { return a.frame - b.frame; });

    if (sorted.length === 1) {
        return Object.assign({}, sorted[0], { visible: sorted[0].visible !== false });
    }

    if (frame <= sorted[0].frame) {
        return Object.assign({}, sorted[0], { visible: sorted[0].visible !== false });
    }

    if (frame >= sorted[sorted.length - 1].frame) {
        return Object.assign({}, sorted[sorted.length - 1], { visible: sorted[sorted.length - 1].visible !== false });
    }

    var prev = sorted[0];
    var next = sorted[sorted.length - 1];

    for (var i = 0; i < sorted.length - 1; i++) {
        if (frame >= sorted[i].frame && frame <= sorted[i + 1].frame) {
            prev = sorted[i];
            next = sorted[i + 1];
            break;
        }
    }

    var t = (frame - prev.frame) / (next.frame - prev.frame);

    return {
        x: prev.x + (next.x - prev.x) * t,
        y: prev.y + (next.y - prev.y) * t,
        scale: prev.scale + (next.scale - prev.scale) * t,
        rotation: prev.rotation + (next.rotation - prev.rotation) * t,
        visible: (prev.visible !== false && next.visible !== false)
    };
};

Stage.prototype.render = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.project) return;

    if (this.project.background && this.project.background.indexOf('#') === 0) {
        ctx.fillStyle = this.project.background;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else if (this.project.background && this.project.background.indexOf('data:') === 0) {
        var bgImg = new Image();
        bgImg.src = this.project.background;
        if (bgImg.complete) {
            ctx.drawImage(bgImg, 0, 0, this.canvas.width, this.canvas.height);
        }
    } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (!this.project.actors) return;

    var self = this;
    var actors = this.project.actors.slice().sort(function (a, b) {
        return (a.zIndex || 0) - (b.zIndex || 0);
    });
    actors.forEach(function (actor) {
        var state = self.getInterpolatedState(actor, self.currentFrame);
        var img = self.images[actor.id];

        if (self.isActorVisible(actor, self.currentFrame) === false) {
            return;
        }

        if (img) {
            ctx.save();
            ctx.translate(state.x, state.y);
            ctx.rotate((state.rotation * Math.PI) / 180);
            ctx.scale(state.scale, state.scale);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            ctx.restore();
        } else if (actor.svg && actor.svg.trim() !== '') {
            ctx.save();
            ctx.translate(state.x, state.y);
            ctx.rotate((state.rotation * Math.PI) / 180);
            ctx.scale(state.scale, state.scale);
            var svgString = self.normalizeSvg(actor.svg);
            var img2 = new Image();
            var svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
            var url = URL.createObjectURL(svgBlob);
            img2.onload = function () {
                ctx.drawImage(img2, -img2.width / 2, -img2.height / 2);
                URL.revokeObjectURL(url);
                self.images[actor.id] = img2;
            };
            img2.onerror = function () {
                ctx.fillStyle = '#ff4444';
                ctx.font = '20px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('SVG Error', 0, 0);
            };
            img2.src = url;
            ctx.restore();
        }

        if (actor.id === self.selectedActorId) {
            var bounds = self.getActorBounds(actor, state);
            ctx.strokeStyle = '#4a90d9';
            ctx.lineWidth = 2 / state.scale;
            ctx.setLineDash([5 / state.scale, 5 / state.scale]);
            ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            ctx.setLineDash([]);
        }
    });
};

Stage.prototype.normalizeSvg = function (svg) {
    if (!svg || svg.trim() === '') return svg;
    var trimmed = svg.trim();
    if (trimmed.indexOf('<svg') === 0) return trimmed;
    if (trimmed.indexOf('<') === 0) return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">' + trimmed + '</svg>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><text x="200" y="200" text-anchor="middle" dominant-baseline="middle" font-size="80" fill="white">' + trimmed + '</text></svg>';
};

Stage.prototype.getActorBounds = function (actor, state) {
    var img = this.images[actor.id];
    var w = img ? img.width : 100;
    var h = img ? img.height : 100;
    return {
        x: state.x - (w * state.scale) / 2,
        y: state.y - (h * state.scale) / 2,
        width: w * state.scale,
        height: h * state.scale
    };
};

Stage.prototype.getCanvasCoords = function (e) {
    var rect = this.canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / this.scale,
        y: (e.clientY - rect.top) / this.scale
    };
};

Stage.prototype.findActorAt = function (x, y) {
    if (!this.project || !this.project.actors) return null;

    for (var i = this.project.actors.length - 1; i >= 0; i--) {
        var actor = this.project.actors[i];
        var state = this.getInterpolatedState(actor, this.currentFrame);
        var bounds = this.getActorBounds(actor, state);
        if (x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height) {
            return actor;
        }
    }
    return null;
};

Stage.prototype.isActorVisible = function (actor, frame) {
    var keyframes = actor.keyframes || [];
    if (keyframes.length === 0) return true;

    var sorted = keyframes.slice().sort(function (a, b) { return a.frame - b.frame; });

    if (frame <= sorted[0].frame) {
        return sorted[0].visible !== false;
    }

    if (frame >= sorted[sorted.length - 1].frame) {
        return sorted[sorted.length - 1].visible !== false;
    }

    var prev = sorted[0];
    var next = sorted[sorted.length - 1];

    for (var i = 0; i < sorted.length - 1; i++) {
        if (frame >= sorted[i].frame && frame <= sorted[i + 1].frame) {
            prev = sorted[i];
            next = sorted[i + 1];
            break;
        }
    }

    return prev.visible !== false && next.visible !== false;
};

Stage.prototype.selectActor = function (id) {
    this.selectedActorId = id;
    this.render();
};

Stage.prototype.bindEvents = function () {
    var self = this;
    this.canvas.addEventListener('mousedown', function (e) {
        var coords = self.getCanvasCoords(e);
        var actor = self.findActorAt(coords.x, coords.y);
        if (actor) {
            self.selectedActorId = actor.id;
            var state = self.getInterpolatedState(actor, self.currentFrame);
            self.isDragging = true;
            self.dragOffset = {
                x: coords.x - state.x,
                y: coords.y - state.y
            };
            self.render();
        } else {
            self.selectedActorId = null;
            self.render();
        }
    });

    this.canvas.addEventListener('mousemove', function (e) {
        if (!self.isDragging || !self.selectedActorId) return;
        var coords = self.getCanvasCoords(e);
        var actor = self.project.actors.find(function (a) { return a.id === self.selectedActorId; });
        if (!actor) return;

        var newX = coords.x - self.dragOffset.x;
        var newY = coords.y - self.dragOffset.y;

        var keyframe = actor.keyframes.find(function (k) { return k.frame === self.currentFrame; });
        if (keyframe) {
            keyframe.x = newX;
            keyframe.y = newY;
        } else {
            actor.keyframes.push({ frame: self.currentFrame, x: newX, y: newY, scale: 1, rotation: 0 });
        }
        self.render();
        if (window.timeline) window.timeline.render(self.project);
    });

    this.canvas.addEventListener('mouseup', function () {
        self.isDragging = false;
    });

    this.canvas.addEventListener('mouseleave', function () {
        self.isDragging = false;
    });

    window.addEventListener('resize', function () {
        self.setupCanvas();
        self.render();
    });
};

window.Stage = Stage;
