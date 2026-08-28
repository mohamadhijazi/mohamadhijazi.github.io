function Timeline() {
    this.container = document.querySelector('.timeline-container');
    this.ruler = document.getElementById('timeline-ruler');
    this.tracksContainer = document.getElementById('timeline-tracks');
    this.playhead = document.getElementById('playhead');
    this.project = null;
    this.fps = 30;
    this.pixelsPerFrame = 4;
    this.labelWidth = 120;

    this.bindEvents();
}

Timeline.prototype.render = function (project) {
    this.project = project;
    this.fps = (project && project.metadata && project.metadata.fps) ? project.metadata.fps : 30;
    var totalFrames = (project && project.duration) ? project.duration * this.fps : 60 * this.fps;
    document.getElementById('total-frames').textContent = totalFrames;
    this.drawRuler(totalFrames);
    this.drawTracks();
    this.updatePlayhead(0);
};

Timeline.prototype.drawRuler = function (totalFrames) {
    var self = this;
    this.ruler.innerHTML = '';
    var width = totalFrames * this.pixelsPerFrame + this.labelWidth;
    this.ruler.style.width = width + 'px';
    this.tracksContainer.style.width = width + 'px';

    var interval = this.fps;
    for (var frame = 0; frame <= totalFrames; frame += interval) {
        var x = this.labelWidth + frame * this.pixelsPerFrame;
        var mark = document.createElement('div');
        mark.className = 'ruler-mark';
        mark.style.left = x + 'px';
        mark.style.position = 'absolute';
        mark.style.top = '0';
        mark.style.bottom = '0';
        mark.style.width = '1px';
        mark.style.background = '#444';
        mark.title = Math.floor(frame / this.fps) + 's';
        this.ruler.appendChild(mark);

        var label = document.createElement('span');
        label.style.position = 'absolute';
        label.style.left = (x + 2) + 'px';
        label.style.top = '4px';
        label.style.fontSize = '10px';
        label.style.color = '#888';
        label.textContent = Math.floor(frame / this.fps) + 's';
        this.ruler.appendChild(label);
    }
};

Timeline.prototype.drawTracks = function () {
    document.getElementById('track-characters').innerHTML = '';
    document.getElementById('track-background').innerHTML = '';
    document.getElementById('track-audio').innerHTML = '';

    if (!this.project) return;

    if (this.project.actors) {
        var self = this;
        this.project.actors.forEach(function (actor) {
            if (actor.keyframes) {
                actor.keyframes.forEach(function (kf) {
                    var el = document.createElement('div');
                    el.className = 'track-keyframe';
                    el.style.left = (self.labelWidth + kf.frame * self.pixelsPerFrame) + 'px';
                    el.title = actor.name + ' @ ' + kf.frame;
                    el.addEventListener('click', function (e) {
                        if (e.target.classList.contains('kf-delete')) return;
                        e.stopPropagation();
                        window.app.currentFrame = kf.frame;
                        window.stage.setFrame(kf.frame);
                        self.updatePlayhead(kf.frame);
                    });
                    var del = document.createElement('button');
                    del.className = 'kf-delete';
                    del.title = 'Remove keyframe';
                    del.textContent = '×';
                    del.addEventListener('click', function (e) {
                        e.stopPropagation();
                        window.app.deleteKeyframe(actor.id, kf.frame);
                    });
                    el.appendChild(del);
                    document.getElementById('track-characters').appendChild(el);
                });
            }
        });
    }

    if (this.project.background) {
        var el = document.createElement('div');
        el.className = 'track-keyframe';
        el.style.left = this.labelWidth + 'px';
        el.title = 'Background';
        document.getElementById('track-background').appendChild(el);
    }

    var audioClips = (this.project.audioClips || []);
    if (this.project.audioTrack && !audioClips.length) {
        audioClips = [{
            id: 'legacy_audio',
            name: 'Audio Track',
            data: this.project.audioTrack,
            startFrame: 0,
            endFrame: (this.project.duration || 60) * (this.fps || 30),
            volume: 1
        }];
    }
    audioClips.forEach(function (clip) {
        var el = document.createElement('div');
        el.className = 'track-audio-item';
        el.style.left = (self.labelWidth + clip.startFrame * self.pixelsPerFrame) + 'px';
        el.style.width = ((clip.endFrame - clip.startFrame) * self.pixelsPerFrame) + 'px';
        el.textContent = clip.name || 'Audio';
        el.title = (clip.name || 'Audio') + ' (' + clip.startFrame + ' - ' + clip.endFrame + ')';
        var del = document.createElement('button');
        del.className = 'audio-delete';
        del.title = 'Remove audio clip';
        del.textContent = '×';
        del.addEventListener('click', function (e) {
            e.stopPropagation();
            window.app.deleteAudioClip(clip.id);
        });
        el.appendChild(del);
        document.getElementById('track-audio').appendChild(el);
    });
};

Timeline.prototype.updatePlayhead = function (frame) {
    var x = this.labelWidth + frame * this.pixelsPerFrame;
    this.playhead.style.left = x + 'px';
};

Timeline.prototype.bindEvents = function () {
    var self = this;
    this.container.addEventListener('click', function (e) {
        if (e.target.classList.contains('track-keyframe')) return;
        var rect = self.container.getBoundingClientRect();
        var x = e.clientX - rect.left + self.container.scrollLeft;
        var frame = Math.max(0, Math.round((x - self.labelWidth) / self.pixelsPerFrame));
        window.app.currentFrame = frame;
        window.stage.setFrame(frame);
        self.updatePlayhead(frame);
        document.getElementById('current-frame').textContent = frame;
    });
};

window.Timeline = Timeline;
