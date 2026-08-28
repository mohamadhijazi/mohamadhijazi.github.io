/**
 * song-generator.js
 * Browser-side melody generator for the 2D Animation Studio.
 *
 * Produces a downloadable MP3 using Web Audio + lamejs.
 * This creates a vocal-like synthesized melody, not intelligible sung lyrics.
 *
 * Dependency:
 *   <script src="https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js"></script>
 */

class SongGenerator {
  constructor({ sampleRate = 44100, bitRate = 128 } = {}) {
    this.sampleRate = sampleRate;
    this.bitRate = bitRate;
  }

  noteToFrequency(note) {
    const match = /^([A-G])([#b]?)(-?\d+)$/.exec(note);
    if (!match) throw new Error(`Invalid note: ${note}`);

    const semitones = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    let value = semitones[match[1]];
    if (match[2] === '#') value += 1;
    if (match[2] === 'b') value -= 1;

    const midi = (Number(match[3]) + 1) * 12 + value;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  secondsPerBeat(bpm) {
    if (!Number.isFinite(bpm) || bpm <= 0) throw new Error('BPM must be positive.');
    return 60 / bpm;
  }

  async render(song) {
    const bpm = song.bpm || 100;
    const beat = this.secondsPerBeat(bpm);
    const endBeat = Math.max(...song.notes.map(n => n.startBeat + n.beats), 1);
    const duration = endBeat * beat + 1.25;
    const frames = Math.ceil(duration * this.sampleRate);
    const ctx = new OfflineAudioContext(2, frames, this.sampleRate);

    const master = ctx.createGain();
    master.gain.value = Math.min(Math.max(song.volume ?? 0.75, 0), 1);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 14;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.2;

    master.connect(compressor);
    compressor.connect(ctx.destination);

    for (const note of song.notes) {
      const start = note.startBeat * beat;
      const length = Math.max(note.beats * beat, 0.05);
      const stop = start + length;
      const frequency = this.noteToFrequency(note.note);

      // Two oscillators and a formant-style filter create a soft vocal-like timbre.
      const fundamental = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const voiceGain = ctx.createGain();
      const harmonicGain = ctx.createGain();
      const formant = ctx.createBiquadFilter();

      fundamental.type = note.wave || 'sine';
      fundamental.frequency.setValueAtTime(frequency, start);
      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(frequency * 2, start);
      harmonic.detune.setValueAtTime(4, start);
      harmonicGain.gain.value = 0.18;

      formant.type = 'bandpass';
      formant.frequency.value = note.formant || 900;
      formant.Q.value = 1.2;

      const attack = Math.min(0.035, length * 0.2);
      const release = Math.min(0.16, length * 0.35);
      const level = Math.min(Math.max(note.velocity ?? 0.7, 0), 1);
      voiceGain.gain.setValueAtTime(0.0001, start);
      voiceGain.gain.exponentialRampToValueAtTime(Math.max(level, 0.0002), start + attack);
      voiceGain.gain.setValueAtTime(Math.max(level * 0.82, 0.0002), Math.max(start + attack, stop - release));
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, stop);

      // Gentle vibrato.
      const vibrato = ctx.createOscillator();
      const vibratoDepth = ctx.createGain();
      vibrato.frequency.value = note.vibratoRate || 5.2;
      vibratoDepth.gain.value = note.vibratoCents ?? 8;
      vibrato.connect(vibratoDepth);
      vibratoDepth.connect(fundamental.detune);
      vibratoDepth.connect(harmonic.detune);

      fundamental.connect(voiceGain);
      harmonic.connect(harmonicGain);
      harmonicGain.connect(voiceGain);
      voiceGain.connect(formant);
      formant.connect(master);

      fundamental.start(start);
      harmonic.start(start);
      vibrato.start(start);
      fundamental.stop(stop);
      harmonic.stop(stop);
      vibrato.stop(stop);
    }

    return ctx.startRendering();
  }

  audioBufferToMp3(audioBuffer) {
    if (!globalThis.lamejs) {
      throw new Error('lamejs is missing. Add lame.min.js before using SongGenerator.');
    }

    const channels = Math.min(audioBuffer.numberOfChannels, 2);
    const encoder = new globalThis.lamejs.Mp3Encoder(channels, audioBuffer.sampleRate, this.bitRate);
    const left = audioBuffer.getChannelData(0);
    const right = channels === 2 ? audioBuffer.getChannelData(1) : null;
    const blockSize = 1152;
    const bytes = [];

    const toInt16 = (input, offset, length) => {
      const result = new Int16Array(length);
      for (let i = 0; i < length; i++) {
        const sample = Math.max(-1, Math.min(1, input[offset + i] || 0));
        result[i] = sample < 0 ? sample * 32768 : sample * 32767;
      }
      return result;
    };

    for (let offset = 0; offset < left.length; offset += blockSize) {
      const length = Math.min(blockSize, left.length - offset);
      const left16 = toInt16(left, offset, length);
      const encoded = channels === 2
        ? encoder.encodeBuffer(left16, toInt16(right, offset, length))
        : encoder.encodeBuffer(left16);
      if (encoded.length) bytes.push(new Int8Array(encoded));
    }

    const flushed = encoder.flush();
    if (flushed.length) bytes.push(new Int8Array(flushed));
    return new Blob(bytes, { type: 'audio/mpeg' });
  }

  async generateMp3(song) {
    const audioBuffer = await this.render(song);
    return this.audioBufferToMp3(audioBuffer);
  }

  async downloadMp3(song, filename = 'studio-song.mp3') {
    const blob = await this.generateMp3(song);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return blob;
  }
}

window.SongGenerator = SongGenerator;
function createnotes(notes_n, count){
  var n=[];
for (let i = 0; i < count; i++) {
  var notes=[]
  notes.push(...notes_n.map(n => ({ ...n })));
  notes.forEach(note => {
    note.startBeat += i * notes.length; // Increment startBeat for each repetition
  });
  n.push(...notes);
}
return n;
}
// Public-domain-style demo melody. This is deliberately a generic original sequence.

var n2=[{ note: 'C4', startBeat: 0, beats: 1 },
{ note: 'E4', startBeat: 1, beats: 1 },
{ note: 'G4', startBeat: 2, beats: 2 },

{ note: 'D4', startBeat: 4, beats: 1 },
{ note: 'F4', startBeat: 5, beats: 1 },
{ note: 'A4', startBeat: 6, beats: 2 },

{ note: 'G4', startBeat: 8, beats: 2 },
{ note: 'E4', startBeat: 10, beats: 2 },

{ note: 'D4', startBeat: 12, beats: 1 },
{ note: 'E4', startBeat: 13, beats: 1 },
{ note: 'C4', startBeat: 14, beats: 2 }];

var n1=[
    { note: 'C4', startBeat: 0, beats: 1 },
    { note: 'C4', startBeat: 1, beats: 1 },
    { note: 'G4', startBeat: 2, beats: 1 },
    { note: 'G4', startBeat: 3, beats: 1 },
    { note: 'A4', startBeat: 4, beats: 1 },
    { note: 'A4', startBeat: 5, beats: 1 },
    { note: 'G4', startBeat: 6, beats: 2 },
    { note: 'F4', startBeat: 8, beats: 1 },
    { note: 'F4', startBeat: 9, beats: 1 },
    { note: 'E4', startBeat: 10, beats: 1 },
    { note: 'E4', startBeat: 11, beats: 1 },
    { note: 'D4', startBeat: 12, beats: 1 },
    { note: 'D4', startBeat: 13, beats: 1 },
    { note: 'C4', startBeat: 14, beats: 2 },
    
  ]
const demoSong = {
  title: 'Little Star Demo',
  bpm: 96,
  volume: 0.72,
  notes: createnotes(n2,5)
};

window.demoSong = demoSong;
