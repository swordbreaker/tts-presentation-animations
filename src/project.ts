import {makeProject} from '@motion-canvas/core/lib';

import autoEncoder from './scenes/autoEncoder?scene';
import vae from './scenes/vae?scene';

import ttsSystems from './scenes/tts-systems?scene';

import vits from './scenes/vits?scene';
import vits2 from './scenes/vits2?scene';

import signals from './scenes/signal?scene';

export default makeProject({
  scenes: [vits, vits2],
  background: '#141414',
});
