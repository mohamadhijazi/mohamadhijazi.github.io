function Library() {
    this.grids = {
        characters: document.getElementById('character-grid'),
        backgrounds: document.getElementById('background-grid'),
        audio: document.getElementById('audio-list')
    };
}

Library.prototype.renderCharacters = function (actors) {
    this.grids.characters.innerHTML = '';
    if (!actors) return;
    var self = this;
    actors.forEach(function (actor) {
        var item = document.createElement('div');
        item.className = 'asset-item';
        if (actor.svg && actor.svg.trim() !== '') {
            item.innerHTML = actor.svg;
        } else {
            item.innerHTML = '<span class="asset-label">Empty</span>';
        }
        item.title = actor.name;

        var actions = document.createElement('div');
        actions.className = 'asset-actions';

        var editBtn = document.createElement('button');
        editBtn.className = 'asset-action-btn';
        editBtn.textContent = '✎';
        editBtn.title = 'Edit';
        editBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            window.svgBuilder.openForEdit(actor);
        });

        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'asset-action-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (confirm('Delete actor "' + actor.name + '"?')) {
                window.app.currentProject.actors = window.app.currentProject.actors.filter(function (a) { return a.id !== actor.id; });
                window.app.renderAssets();
                window.app.saveCurrentProject();
                document.getElementById('actor-inspector').style.display = 'none';
            }
        });

        var cloneBtn = document.createElement('button');
        cloneBtn.className = 'asset-action-btn';
        cloneBtn.textContent = '⧉';
        cloneBtn.title = 'Clone';
        cloneBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            window.app.cloneActor(actor);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        actions.appendChild(cloneBtn);
        item.appendChild(actions);

        item.addEventListener('click', function () {
            if (window.app.currentProject && window.app.currentProject.actors) {
                window.stage.selectActor(actor.id);
                window.app.showActorInspector(actor.id);
            }
        });
        self.grids.characters.appendChild(item);
    });
};

Library.prototype.renderBackgrounds = function (backgroundAssets) {
    this.grids.backgrounds.innerHTML = '';
    if (!backgroundAssets) return;
    var self = this;
    backgroundAssets.forEach(function (bg) {
        var item = document.createElement('div');
        item.className = 'asset-item';
        var img = document.createElement('img');
        img.src = bg.data;
        item.appendChild(img);
        item.title = bg.name;
        item.addEventListener('click', function () {
            if (window.app.currentProject) {
                window.app.currentProject.background = bg.data;
                window.stage.setProject(window.app.currentProject);
            }
        });
        self.grids.backgrounds.appendChild(item);
    });
};

Library.prototype.renderAudio = function (audioAssets) {
    this.grids.audio.innerHTML = '';
    if (!audioAssets) return;
    var self = this;

    if (window.app.currentProject && window.app.currentProject.audioClips && window.app.currentProject.audioClips.length) {
        var clearBtn = document.createElement('button');
        clearBtn.className = 'panel-action';
        clearBtn.textContent = 'Clear All Audio';
        clearBtn.style.marginBottom = '8px';
        clearBtn.addEventListener('click', function () {
            window.app.deleteAllAudio();
        });
        this.grids.audio.appendChild(clearBtn);

        window.app.currentProject.audioClips.forEach(function (clip) {
            var item = document.createElement('div');
            item.className = 'asset-list-item';
            var clipInfo = document.createElement('span');
            clipInfo.textContent = clip.name + ' (' + clip.startFrame + ' - ' + clip.endFrame + ')';
            item.appendChild(clipInfo);
            var del = document.createElement('button');
            del.className = 'asset-action-btn';
            del.title = 'Remove clip';
            del.textContent = '×';
            del.addEventListener('click', function (e) {
                e.stopPropagation();
                window.app.deleteAudioClip(clip.id);
            });
            item.appendChild(del);
            self.grids.audio.appendChild(item);
        });
    }

    audioAssets.forEach(function (audio) {
        var item = document.createElement('div');
        item.className = 'asset-list-item';
        item.innerHTML = '<span>' + audio.name + '</span>';
        item.addEventListener('click', function () {
            if (!window.app.currentProject) return;
            var fps = window.app.fps || 30;
            var currentFrame = window.app.currentFrame || 0;
            var duration = window.app.currentProject.duration || 60;
            var totalFrames = duration * fps;
            var defaultEnd = Math.min(currentFrame + fps * 5, totalFrames);
            var startFrame = parseInt(prompt('Start frame (current: ' + currentFrame + '):', currentFrame), 10);
            if (isNaN(startFrame)) return;
            var endFrame = parseInt(prompt('End frame (max: ' + totalFrames + '):', defaultEnd), 10);
            if (isNaN(endFrame)) return;
            if (startFrame < 0) startFrame = 0;
            if (endFrame > totalFrames) endFrame = totalFrames;
            if (endFrame <= startFrame) endFrame = startFrame + 1;
            if (!window.app.currentProject.audioClips) window.app.currentProject.audioClips = [];
            window.app.currentProject.audioClips.push({
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                name: audio.name,
                data: audio.data,
                startFrame: startFrame,
                endFrame: endFrame,
                volume: 1
            });
            window.app.currentProject.audioTrack = null;
            window.app.saveCurrentProject();
            window.app.updateTimeline();
            window.app.renderAssets();
        });
        self.grids.audio.appendChild(item);
    });
};

window.Library = Library;
