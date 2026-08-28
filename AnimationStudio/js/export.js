function AudioEngine() {
    this.audioContext = null;
    this.loadedBuffers = {};
    this.clipSources = [];
    this.isPlaying = false;
    this.destination = null;
}

AudioEngine.prototype.init = function () {
    if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

AudioEngine.prototype.setDestination = function (node) {
    this.destination = node;
};

AudioEngine.prototype.loadAudio = function (dataUrl) {
    var self = this;
    this.init();
    if (!dataUrl) return Promise.resolve(null);
    return fetch(dataUrl).then(function (response) { return response.arrayBuffer(); }).then(function (arrayBuffer) {
        return self.audioContext.decodeAudioData(arrayBuffer);
    }).then(function (buffer) {
        self.audioBuffer = buffer;
        return buffer;
    }).catch(function (err) {
        console.error('Failed to load audio:', err);
        return null;
    });
};

AudioEngine.prototype.loadClip = function (clip) {
    var self = this;
    if (!clip || !clip.data) return Promise.resolve(null);
    if (this.loadedBuffers[clip.id]) return Promise.resolve(this.loadedBuffers[clip.id]);
    return fetch(clip.data).then(function (response) { return response.arrayBuffer(); }).then(function (arrayBuffer) {
        return self.audioContext.decodeAudioData(arrayBuffer);
    }).then(function (buffer) {
        self.loadedBuffers[clip.id] = buffer;
        return buffer;
    }).catch(function (err) {
        console.error('Failed to load audio clip:', clip.id, err);
        return null;
    });
};

AudioEngine.prototype.loadClips = function (clips) {
    var self = this;
    if (!clips || !clips.length) return Promise.resolve([]);
    return Promise.all(clips.map(function (clip) { return self.loadClip(clip); }));
};

AudioEngine.prototype.stop = function () {
    this.clipSources.forEach(function (cs) {
        try { cs.source.stop(); } catch (e) {}
        try { cs.source.disconnect(); } catch (e) {}
        if (cs.gain) { try { cs.gain.disconnect(); } catch (e) {} }
    });
    this.clipSources = [];
    this.isPlaying = false;
};

AudioEngine.prototype.playClips = function (clips, currentFrame, fps) {
    this.init();
    this.stop();
    if (!clips || !clips.length) return;
    this.isPlaying = true;

    if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
    }

    var now = this.audioContext.currentTime;
    var dest = this.destination || this.audioContext.destination;

    clips.forEach(function (clip) {
        var buffer = this.loadedBuffers[clip.id];
        if (!buffer) return;

        var startTime = now + Math.max(0, (clip.startFrame - currentFrame)) / fps;
        var duration = (clip.endFrame - clip.startFrame) / fps;

        if (startTime >= now + duration && clip.startFrame >= currentFrame) return;

        var source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        var gainNode = this.audioContext.createGain();
        gainNode.gain.value = typeof clip.volume === 'number' ? clip.volume : 1;

        source.connect(gainNode);
        gainNode.connect(dest);

        var actualStart = Math.max(now, startTime);
        var offset = actualStart - startTime;
        if (offset >= duration) return;

        source.start(actualStart, offset);
        source.stop(actualStart + (duration - offset));

        this.clipSources.push({ source: source, gain: gainNode, clip: clip });
    }.bind(this));
};

AudioEngine.prototype.pause = function () {
    if (this.clipSources.length > 0) {
        this.clipSources.forEach(function (cs) {
            try { cs.source.stop(); } catch (e) {}
            try { cs.source.disconnect(); } catch (e) {}
            if (cs.gain) { try { cs.gain.disconnect(); } catch (e) {} }
        });
        this.clipSources = [];
    }
    this.isPlaying = false;
};

AudioEngine.prototype.getCurrentTime = function () {
    if (this.isPlaying && this.audioContext) {
        return this.audioContext.currentTime;
    }
    return 0;
};

function ExportEngine() {
    this.mediaRecorder = null;
    this.chunks = [];
    this.isRecording = false;
}

ExportEngine.prototype.startRecording = function (canvas, audioEngine, duration) {
    var self = this;
    this.chunks = [];
    var captureStream = canvas.captureStream || canvas.mozCaptureStream;
    if (typeof captureStream !== 'function') {
        alert('Video export is not supported in this browser. Please use Chrome, Edge, or Firefox.');
        return;
    }
    var canvasStream = captureStream.call(canvas, 30);

    if (audioEngine && audioEngine.audioContext) {
        var audioDestination = audioEngine.audioContext.createMediaStreamDestination();
        this.audioDestination = audioDestination;
        var audioTrack = audioDestination.stream.getAudioTracks()[0];
        if (audioTrack) {
            canvasStream.addTrack(audioTrack);
        }
    } else {
        this.audioDestination = null;
    }

    this.mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000
    });

    this.mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
            self.chunks.push(event.data);
        }
    };

    this.mediaRecorder.onstop = function () {
        var blob = new Blob(self.chunks, { type: 'video/webm' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'animation.webm';
        a.click();
        URL.revokeObjectURL(url);
    };

    this.mediaRecorder.start();
    this.isRecording = true;
};

ExportEngine.prototype.stopRecording = function () {
    if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
    }
};

ExportEngine.prototype.getAudioDestination = function () {
    return this.audioDestination;
};

window.AudioEngine = AudioEngine;
window.ExportEngine = ExportEngine;
