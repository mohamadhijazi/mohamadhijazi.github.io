# Browser Song Generator

Serve this directory through HTTP, then open `demo.html`.

Example:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/demo.html`, then select **Generate MP3**.

## Studio usage

```js
import { SongGenerator } from './song-generator.js';

const generator = new SongGenerator({ bitRate: 128 });
const mp3Blob = await generator.generateMp3(songDefinition);

// Store mp3Blob in IndexedDB, attach it to the current project,
// or pass it to the studio audio asset importer.
```

The script creates a melodic, vocal-like synthesizer tone. Actual intelligible sung lyrics require a singing synthesis model or external API.
