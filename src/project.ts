import {makeProject} from '@motion-canvas/core/lib';

import autoEncoder from './scenes/autoEncoder?scene';
import vae from './scenes/vae?scene';

import ttsSystems from './scenes/tts-systems?scene';

import signals from './scenes/signal?scene';

export default makeProject({
  name: "tts-system",
  scenes: [signals],
  background: '#141414',
});
