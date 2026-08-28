function AnimationStudio() {
    this.projects = [];
    this.currentProject = null;
    this.isPlaying = false;
    this.currentFrame = 0;
    this.playInterval = null;
    this.fps = 30;
    this.audioEngine = new AudioEngine();
    this.exportEngine = new ExportEngine();

    window.stage = new Stage();
    window.timeline = new Timeline();
    window.library = new Library();
    window.svgBuilder = new SVGBuilder();

    this.init();
}

AnimationStudio.prototype.init = function () {
    var self = this;
    seedDatabase().then(function () {
        self.projects = getAllProjects();
        return self.projects;
    }).then(function (projects) {
        self.projects = projects;
        self.bindEvents();
        self.loadProjectList();
        if (self.projects.length > 0) {
            return self.selectProject(self.projects[0].id);
        }
    });
};

AnimationStudio.prototype.bindEvents = function () {
    var self = this;
    document.getElementById('btn-new-project').addEventListener('click', function () { self.createNewProject(); });
    document.getElementById('btn-clone-project').addEventListener('click', function () { self.cloneCurrentProject(); });
    document.getElementById('btn-open-project').addEventListener('click', function () { document.getElementById('import-file-input').click(); });
    document.getElementById('btn-save-project').addEventListener('click', function () { self.saveCurrentProject(); });
    document.getElementById('btn-export-project').addEventListener('click', function () { self.exportProject(); });
    document.getElementById('btn-import-project').addEventListener('click', function () { document.getElementById('import-file-input').click(); });
    document.getElementById('btn-export-video').addEventListener('click', function () { self.exportVideo(); });
    document.getElementById('btn-delete-project').addEventListener('click', function () { self.deleteCurrentProject(); });
    document.getElementById('btn-play').addEventListener('click', function () { self.play(); });
    document.getElementById('btn-pause').addEventListener('click', function () { self.pause(); });
    document.getElementById('btn-stop').addEventListener('click', function () { self.stop(); });
    document.getElementById('fps-input').addEventListener('change', function (e) { self.setFps(parseInt(e.target.value) || 30); });
    document.getElementById('duration-input').addEventListener('change', function (e) { self.setDuration(parseInt(e.target.value) || 60); });
    document.getElementById('project-select').addEventListener('change', function (e) { self.selectProject(e.target.value); });

    document.querySelectorAll('.tab').forEach(function (tab) {
        tab.addEventListener('click', function (e) { self.switchTab(e.target.dataset.tab); });
    });

    document.getElementById('btn-svg-builder').addEventListener('click', function () { window.svgBuilder.open(); });
    document.getElementById('btn-add-background').addEventListener('click', function () { document.getElementById('background-file-input').click(); });
    document.getElementById('btn-add-audio').addEventListener('click', function () { document.getElementById('audio-file-input').click(); });

    document.getElementById('import-file-input').addEventListener('change', function (e) { self.importProject(e); });
    document.getElementById('audio-file-input').addEventListener('change', function (e) { self.handleAudioUpload(e); });
    document.getElementById('background-file-input').addEventListener('change', function (e) { self.handleBackgroundUpload(e); });

    document.getElementById('btn-save-svg').addEventListener('click', function () { window.svgBuilder.save(); });
    document.getElementById('btn-cancel-svg').addEventListener('click', function () { window.svgBuilder.close(); });
    document.getElementById('btn-clear-svg').addEventListener('click', function () { window.svgBuilder.clear(); });

    document.getElementById('btn-update-actor').addEventListener('click', function () { self.updateSelectedActor(); });
    document.getElementById('btn-delete-actor').addEventListener('click', function () { self.deleteSelectedActor(); });
    document.getElementById('btn-edit-svg').addEventListener('click', function () { self.editSelectedActorSVG(); });
    document.getElementById('btn-toggle-visibility').addEventListener('click', function () { self.toggleSelectedActorVisibility(); });
    document.getElementById('btn-move-up').addEventListener('click', function () { self.moveSelectedActorUp(); });
    document.getElementById('btn-move-down').addEventListener('click', function () { self.moveSelectedActorDown(); });

    document.getElementById('btn-movie-editor').addEventListener('click', function () { self.openMovieEditor(); });
    document.getElementById('btn-save-movie').addEventListener('click', function () { self.saveMovieEditor(); });
    document.getElementById('btn-cancel-movie').addEventListener('click', function () { self.closeMovieEditor(); });
};

AnimationStudio.prototype.loadProjectList = function () {
    var select = document.getElementById('project-select');
    select.innerHTML = '';
    var self = this;
    this.projects.forEach(function (project) {
        var option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        select.appendChild(option);
    });
};

AnimationStudio.prototype.selectProject = function (id) {
    var self = this;
    return getProject(id).then(function (project) {
        if (!project) return;
        self.currentProject = project;
        self.migrateAudio();
        document.getElementById('project-select').value = id;
        document.getElementById('fps-input').value = project.metadata && project.metadata.fps ? project.metadata.fps : 30;
        document.getElementById('duration-input').value = project.duration || 60;
        self.updateTimeline();
        self.renderAssets();
        window.stage.setProject(project);
    });
};

AnimationStudio.prototype.saveCurrentProject = function () {
    var self = this;
    if (!this.currentProject) return;
    var project = Object.assign({}, this.currentProject);
    project.metadata = Object.assign({}, this.currentProject.metadata, { fps: this.fps });
    saveProject(project).then(function () {
        self.currentProject = project;
        var idx = self.projects.findIndex(function (p) { return p.id === project.id; });
        if (idx >= 0) self.projects[idx] = project;
        self.updateTimeline();
    });
};

AnimationStudio.prototype.createNewProject = function () {
    var project = {
        id: generateId(),
        name: 'Untitled Project',
        duration: 60,
        audioTrack: null,
        audioClips: [],
        background: '#000000',
        actors: [],
        metadata: { version: '1.0', resolution: [1920, 1080], fps: 30 }
    };
    this.projects.push(project);
    this.loadProjectList();
    this.selectProject(project.id);
};

AnimationStudio.prototype.cloneCurrentProject = function () {
    var self = this;
    if (!this.currentProject) return;
    var name = prompt('Enter new project name:', this.currentProject.name + ' (Copy)');
    if (!name) return;

    var clone = JSON.parse(JSON.stringify(this.currentProject));
    clone.id = generateId();
    clone.name = name;
    if (clone.actors) {
        clone.actors.forEach(function (actor) {
            actor.id = generateId();
            if (actor.keyframes) {
                actor.keyframes.forEach(function (kf) {
                    kf.frame = kf.frame;
                });
            }
        });
    }
    saveProject(clone).then(function () {
        self.projects.push(clone);
        self.loadProjectList();
        self.selectProject(clone.id);
    });
};

AnimationStudio.prototype.cloneActor = function (actor) {
    var self = this;
    if (!this.currentProject) return;
    var name = prompt('Enter new actor name:', actor.name + ' (Copy)');
    if (!name) return;

    var clone = JSON.parse(JSON.stringify(actor));
    clone.id = generateId();
    clone.name = name;
    if (clone.keyframes) {
        clone.keyframes.forEach(function (kf) {
            kf.frame = kf.frame;
        });
    }

    this.currentProject.actors.push(clone);
    this.renderAssets();
    this.saveCurrentProject();
};

AnimationStudio.prototype.deleteCurrentProject = function () {
    var self = this;
    if (!this.currentProject) return;
    if (!confirm('Delete "' + this.currentProject.name + '"?')) return;
    deleteProject(this.currentProject.id).then(function () {
        self.projects = self.projects.filter(function (p) { return p.id !== self.currentProject.id; });
        self.currentProject = null;
        self.loadProjectList();
        if (self.projects.length > 0) {
            self.selectProject(self.projects[0].id);
        }
    });
};

AnimationStudio.prototype.exportProject = function () {
    if (!this.currentProject) return;
    var data = JSON.stringify(this.currentProject, null, 2);
    var blob = new Blob([data], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = this.currentProject.name.replace(/\s+/g, '_') + '.json';
    a.click();
    URL.revokeObjectURL(url);
};

AnimationStudio.prototype.importProject = function (event) {
    var self = this;
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
        try {
            var project = JSON.parse(e.target.result);
            project.id = generateId();
            project.name = project.name || 'Imported Project';
            saveProject(project).then(function () {
                self.projects.push(project);
                self.loadProjectList();
                self.selectProject(project.id);
            });
        } catch (err) {
            alert('Invalid project file');
        }
        event.target.value = '';
    };
    reader.readAsText(file);
};

AnimationStudio.prototype.switchTab = function (tabName) {
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === tabName); });
    document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.toggle('active', c.id === 'tab-' + tabName); });
};

AnimationStudio.prototype.handleAudioUpload = function (event) {
    var self = this;
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
        var audioAsset = {
            id: generateId(),
            name: file.name,
            type: 'audio',
            data: e.target.result
        };
        if (!self.currentProject.audioAssets) self.currentProject.audioAssets = [];
        self.currentProject.audioAssets.push(audioAsset);
        self.renderAssets();
        event.target.value = '';
    };
    reader.readAsDataURL(file);
};

AnimationStudio.prototype.handleBackgroundUpload = function (event) {
    var self = this;
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
        var bg = {
            id: generateId(),
            name: file.name,
            type: 'image',
            data: e.target.result
        };
        if (!self.currentProject.backgroundAssets) self.currentProject.backgroundAssets = [];
        self.currentProject.backgroundAssets.push(bg);
        self.currentProject.background = e.target.result;
        self.renderAssets();
        window.stage.setProject(self.currentProject);
        event.target.value = '';
    };
    reader.readAsDataURL(file);
};

AnimationStudio.prototype.renderAssets = function () {
    window.library.renderCharacters(this.currentProject && this.currentProject.actors ? this.currentProject.actors : []);
    window.library.renderBackgrounds(this.currentProject && this.currentProject.backgroundAssets ? this.currentProject.backgroundAssets : []);
    window.library.renderAudio(this.currentProject && this.currentProject.audioAssets ? this.currentProject.audioAssets : []);
};

AnimationStudio.prototype.updateTimeline = function () {
    window.timeline.render(this.currentProject);
};

AnimationStudio.prototype.migrateAudio = function () {
    if (!this.currentProject) return;
    if (this.currentProject.audioTrack && !this.currentProject.audioClips) {
        this.currentProject.audioClips = [{
            id: 'legacy_audio',
            name: 'Audio Track',
            data: this.currentProject.audioTrack,
            startFrame: 0,
            endFrame: (this.currentProject.duration || 60) * (this.fps || 30),
            volume: 1
        }];
    }
};

AnimationStudio.prototype.deleteAudioClip = function (clipId) {
    if (!this.currentProject || !this.currentProject.audioClips) return;
    var clip = this.currentProject.audioClips.find(function (c) { return c.id === clipId; });
    if (!clip) return;
    if (!confirm('Remove audio clip "' + clip.name + '"?')) return;
    this.currentProject.audioClips = this.currentProject.audioClips.filter(function (c) { return c.id !== clipId; });
    if (!this.currentProject.audioClips.length) {
        this.currentProject.audioTrack = null;
    }
    this.saveCurrentProject();
    this.updateTimeline();
    this.renderAssets();
};

AnimationStudio.prototype.deleteAllAudio = function () {
    if (!this.currentProject) return;
    if (!this.currentProject.audioClips || !this.currentProject.audioClips.length) return;
    if (!confirm('Remove all audio clips from this project?')) return;
    this.currentProject.audioClips = [];
    this.currentProject.audioTrack = null;
    this.saveCurrentProject();
    this.updateTimeline();
    this.renderAssets();
};

AnimationStudio.prototype.play = function () {
    var self = this;
    if (!this.currentProject || this.isPlaying) return;
    this.isPlaying = true;
    var frameTime = 1000 / this.fps;

    var clips = this.currentProject.audioClips || [];
    if (clips.length) {
        this.audioEngine.loadClips(clips).then(function () {
            self.audioEngine.playClips(clips, self.currentFrame, self.fps);
        });
    }

    this.playInterval = setInterval(function () {
        self.currentFrame++;
        var totalFrames = self.currentProject.duration * self.fps;
        if (self.currentFrame >= totalFrames) {
            self.stop();
            return;
        }
        document.getElementById('current-frame').textContent = self.currentFrame;
        window.stage.setFrame(self.currentFrame);
        window.timeline.updatePlayhead(self.currentFrame);
    }, frameTime);
};

AnimationStudio.prototype.pause = function () {
    this.isPlaying = false;
    clearInterval(this.playInterval);
    this.audioEngine.pause();
};

AnimationStudio.prototype.stop = function () {
    this.pause();
    this.audioEngine.stop();
    this.currentFrame = 0;
    document.getElementById('current-frame').textContent = '0';
    window.stage.setFrame(0);
    window.timeline.updatePlayhead(0);
};

AnimationStudio.prototype.setFps = function (fps) {
    this.fps = fps;
    if (this.currentProject && this.currentProject.metadata) {
        this.currentProject.metadata.fps = fps;
    }
};

AnimationStudio.prototype.setDuration = function (duration) {
    if (!this.currentProject) return;
    this.currentProject.duration = Math.min(180, Math.max(1, duration));
    document.getElementById('duration-input').value = this.currentProject.duration;
    this.updateTimeline();
};

AnimationStudio.prototype.showActorInspector = function (actorId) {
    var self = this;
    var inspector = document.getElementById('actor-inspector');
    inspector.style.display = 'block';
    var actor = this.currentProject.actors.find(function (a) { return a.id === actorId; });
    if (!actor) return;
    document.getElementById('actor-name-input').value = actor.name;
    var state = window.stage.getInterpolatedState(actor, window.stage.currentFrame);
    document.getElementById('actor-scale-input').value = state.scale;
    document.getElementById('actor-rotation-input').value = state.rotation;
    this.inspectorActorId = actorId;

    var isVisible = this.isActorVisibleAtCurrentFrame(actor);
    document.getElementById('btn-toggle-visibility').textContent = isVisible ? 'Hide' : 'Show';
};

AnimationStudio.prototype.updateSelectedActor = function () {
    var self = this;
    if (!this.inspectorActorId || !this.currentProject) return;
    var actor = this.currentProject.actors.find(function (a) { return a.id === self.inspectorActorId; });
    if (!actor) return;
    actor.name = document.getElementById('actor-name-input').value.trim();
    var scale = parseFloat(document.getElementById('actor-scale-input').value) || 1;
    var rotation = parseFloat(document.getElementById('actor-rotation-input').value) || 0;

    var keyframe = actor.keyframes.find(function (k) { return k.frame === window.stage.currentFrame; });
    if (keyframe) {
        keyframe.scale = scale;
        keyframe.rotation = rotation;
    } else {
        actor.keyframes.push({ frame: window.stage.currentFrame, x: 960, y: 540, scale: scale, rotation: rotation });
    }
    this.renderAssets();
    this.saveCurrentProject();
    window.stage.render();
};

AnimationStudio.prototype.deleteSelectedActor = function () {
    var self = this;
    if (!this.inspectorActorId || !this.currentProject) return;
    if (!confirm('Delete this actor?')) return;
    this.currentProject.actors = this.currentProject.actors.filter(function (a) { return a.id !== self.inspectorActorId; });
    this.inspectorActorId = null;
    document.getElementById('actor-inspector').style.display = 'none';
    this.renderAssets();
    this.saveCurrentProject();
    window.stage.selectedActorId = null;
    window.stage.render();
};

AnimationStudio.prototype.deleteActorById = function (actorId) {
    var self = this;
    if (!this.currentProject) return;
    var actor = this.currentProject.actors.find(function (a) { return a.id === actorId; });
    if (!actor) return;
    if (!confirm('Remove actor "' + actor.name + '" from project?')) return;
    this.currentProject.actors = this.currentProject.actors.filter(function (a) { return a.id !== actorId; });
    if (this.inspectorActorId === actorId) {
        this.inspectorActorId = null;
        document.getElementById('actor-inspector').style.display = 'none';
    }
    if (window.stage.selectedActorId === actorId) {
        window.stage.selectedActorId = null;
    }
    this.renderAssets();
    this.saveCurrentProject();
    window.stage.render();
};

AnimationStudio.prototype.deleteKeyframe = function (actorId, frame) {
    var self = this;
    if (!this.currentProject) return;
    var actor = this.currentProject.actors.find(function (a) { return a.id === actorId; });
    if (!actor || !actor.keyframes) return;
    var idx = actor.keyframes.findIndex(function (k) { return k.frame === frame; });
    if (idx === -1) return;
    if (!confirm('Remove keyframe at frame ' + frame + '?')) return;
    actor.keyframes.splice(idx, 1);
    if (actor.keyframes.length === 0) {
        actor.keyframes.push({ frame: frame, x: 0, y: 0, scale: 1, rotation: 0 });
    }
    this.saveCurrentProject();
    window.stage.render();
    if (window.timeline) window.timeline.render(this.currentProject);
};

AnimationStudio.prototype.editSelectedActorSVG = function () {
    var self = this;
    if (!this.inspectorActorId || !this.currentProject) return;
    var actor = this.currentProject.actors.find(function (a) { return a.id === self.inspectorActorId; });
    if (actor) {
        window.svgBuilder.openForEdit(actor);
    }
};

AnimationStudio.prototype.toggleSelectedActorVisibility = function () {
    var self = this;
    if (!this.inspectorActorId || !this.currentProject) return;
    var actor = this.currentProject.actors.find(function (a) { return a.id === self.inspectorActorId; });
    if (!actor) return;

    var keyframe = actor.keyframes.find(function (k) { return k.frame === window.stage.currentFrame; });
    if (keyframe) {
        keyframe.visible = keyframe.visible === false ? true : false;
    } else {
        actor.keyframes.push({ frame: window.stage.currentFrame, x: 960, y: 540, scale: 1, rotation: 0, visible: false });
    }

    var isVisible = this.isActorVisibleAtCurrentFrame(actor);
    document.getElementById('btn-toggle-visibility').textContent = isVisible ? 'Hide' : 'Show';
    this.saveCurrentProject();
    window.stage.render();
};

AnimationStudio.prototype.isActorVisibleAtCurrentFrame = function (actor) {
    var keyframes = actor.keyframes || [];
    if (keyframes.length === 0) return true;

    var sorted = keyframes.slice().sort(function (a, b) { return a.frame - b.frame; });
    var frame = window.stage.currentFrame;

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

AnimationStudio.prototype.moveSelectedActorUp = function () {
    var self = this;
    if (!this.inspectorActorId || !this.currentProject) return;
    var actors = this.currentProject.actors;
    var idx = actors.findIndex(function (a) { return a.id === self.inspectorActorId; });
    if (idx < 0 || idx >= actors.length - 1) return;

    var temp = actors[idx];
    actors[idx] = actors[idx + 1];
    actors[idx + 1] = temp;

    actors.forEach(function (a, i) { a.zIndex = i + 1; });
    this.saveCurrentProject();
    this.renderAssets();
    window.stage.render();
};

AnimationStudio.prototype.moveSelectedActorDown = function () {
    var self = this;
    if (!this.inspectorActorId || !this.currentProject) return;
    var actors = this.currentProject.actors;
    var idx = actors.findIndex(function (a) { return a.id === self.inspectorActorId; });
    if (idx <= 0) return;

    var temp = actors[idx];
    actors[idx] = actors[idx - 1];
    actors[idx - 1] = temp;

    actors.forEach(function (a, i) { a.zIndex = i + 1; });
    this.saveCurrentProject();
    this.renderAssets();
    window.stage.render();
};

AnimationStudio.prototype.openMovieEditor = function () {
    if (!this.currentProject) return;
    document.getElementById('movie-editor-overlay').classList.remove('hidden');
    document.getElementById('movie-name-input').value = this.currentProject.name;
    document.getElementById('movie-duration-input').value = this.currentProject.duration || 60;
    document.getElementById('movie-bg-color-input').value = this.currentProject.background && this.currentProject.background.indexOf('#') === 0 ? this.currentProject.background : '#000000';
};

AnimationStudio.prototype.closeMovieEditor = function () {
    document.getElementById('movie-editor-overlay').classList.add('hidden');
};

AnimationStudio.prototype.saveMovieEditor = function () {
    if (!this.currentProject) return;
    this.currentProject.name = document.getElementById('movie-name-input').value.trim() || 'Untitled Project';
    this.currentProject.duration = Math.min(180, Math.max(1, parseInt(document.getElementById('movie-duration-input').value) || 60));
    var bgColor = document.getElementById('movie-bg-color-input').value;
    if (bgColor) {
        this.currentProject.background = bgColor;
    }
    this.loadProjectList();
    this.saveCurrentProject();
    window.stage.setProject(this.currentProject);
    this.closeMovieEditor();
};

AnimationStudio.prototype.exportVideo = function () {
    var self = this;
    if (!this.currentProject) return;
    var canvas = document.getElementById('stage');
    var totalFrames = this.currentProject.duration * this.fps;
    var frameTime = 1000 / this.fps;

    var clips = this.currentProject.audioClips || [];
    if (this.currentProject.audioTrack && !clips.length) {
        clips = [{
            id: 'legacy_audio',
            name: 'Audio Track',
            data: this.currentProject.audioTrack,
            startFrame: 0,
            endFrame: totalFrames,
            volume: 1
        }];
    }

    var loadPromise = Promise.resolve();
    if (clips.length) {
        loadPromise = this.audioEngine.loadClips(clips);
    }

    loadPromise.then(function () {
        alert('Recording started. Please wait...');
        return self.exportEngine.startRecording(canvas, self.audioEngine, self.currentProject.duration);
    }).then(function () {
        self.currentFrame = 0;
        self.isPlaying = true;

        if (clips.length) {
            self.audioEngine.setDestination(self.exportEngine.getAudioDestination());
            self.audioEngine.playClips(clips, 0, self.fps);
        }

        return new Promise(function (resolve) {
            var interval = setInterval(function () {
                if (self.currentFrame >= totalFrames) {
                    clearInterval(interval);
                    resolve();
                }
                document.getElementById('current-frame').textContent = self.currentFrame;
                window.stage.setFrame(self.currentFrame);
                window.timeline.updatePlayhead(self.currentFrame);
                self.currentFrame++;
            }, frameTime);
        });
    }).then(function () {
        self.exportEngine.stopRecording();
        self.isPlaying = false;
        self.stop();
        self.audioEngine.setDestination(null);
        alert('Video exported!');
    });
};

window.app = new AnimationStudio();
