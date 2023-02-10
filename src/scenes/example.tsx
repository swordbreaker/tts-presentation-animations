import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { waitFor } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text } from '@motion-canvas/2d/lib/components';
import { createRef, makeRef, range } from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';
import { createSignal } from '@motion-canvas/core/lib/signals';
import { Center, Vector2 } from '@motion-canvas/core/lib/types';

const lineColor = "#b1d4d4";
const cirlceColor = "#195db2";


function makeLines(view: View2D, a: Circle[] , b: Circle[]){
  let lines: Line[] = [];
  for (let i = 0; i < a.length; i++) {
    const ci = a[i];
    for (let k = 0; k < b.length; k++) {
      const ck = b[k];
      let l = new Line({ points: [ci.absolutePosition, ck.absoluteOpacity], lineWidth: 2, stroke: '#00000000' });
      view.add(l);
      l.absolutePosition(Vector2.zero);
      l.points([
        new Vector2(ci.absolutePosition().x + ci.size().width / 2, ci.absolutePosition().y),
        new Vector2(ck.absolutePosition().x - ck.size().width / 2, ck.absolutePosition().y)]);
      lines.push(l);
    }
  }

  return lines;
}

export default makeScene2D(function* (view) {
  const circles1: Circle[] = [];
  const circles2: Circle[] = [];
  const circles3: Circle[] = [];
  const latentSpaceRect = createRef<Rect>();
  const latentSpaceText = createRef<Text>();

  view.add(
    <>
      <Rect layout justifyContent={'center'}>
        <Rect layout direction={'column'}>
          {range(10).map(index => (
            <Circle margin={10} width={50} height={50} ref={makeRef(circles1, index)} fill={cirlceColor} />
          ))}
        </Rect>,
        <Rect padding={10} layout direction={'column'} alignItems={'center'} justifyContent={'center'} marginLeft={100} ref={latentSpaceRect} stroke={'#00000000'} lineWidth={3}>
          {range(8).map(index => (
            <Circle margin={[10, 5, 10, 5]} width={50} height={50} ref={makeRef(circles2, index)} fill={cirlceColor} />
          ))}
        </Rect>,
        <Rect layout direction={'column'} justifyContent={'center'} marginLeft={100}>
          {range(10).map(index => (
            <Circle margin={10} width={50} height={50} ref={makeRef(circles3, index)} fill={cirlceColor} />
          ))}
        </Rect>,
      </Rect>
      <Text text={'latent space'} position={new Vector2(0, 400)} fill={'#00000000'} ref={latentSpaceText}/>
    </>
  );

  let lines1 = makeLines(view, circles1, circles2);
  let lines2 = makeLines(view, circles2, circles3);

  for (let i = 0; i < lines1.length; i++) {
    const line = lines1[i];
    yield * line.stroke(lineColor, 0.01);
  }

  for (let i = 0; i < lines2.length; i++) {
    const line = lines2[i];
    yield * line.stroke(lineColor, 0.01);
  }

  yield * all(
    latentSpaceRect().stroke('green', 0.5),
    latentSpaceText().fill('white', 0.5));
  
  // circles1
  //   .forEach(i => circles2
  //     .forEach(k => {
  //       i.layout();
  //       k.layout();
  //       let l = new Line({points: [i.absolutePosition, k.absoluteOpacity], lineWidth: 2, stroke: 'yellow'});
  //       view.add(l);
  //       l.absolutePosition(Vector2.zero, 1);
  //       l.points([
  //         new Vector2(i.absolutePosition().x + i.size().width/2, i.absolutePosition().y),
  //         new Vector2(k.absolutePosition().x - k.size().width/2, k.absolutePosition().y)]);
  //   }));

  // <Line points={[i.absolutePosition, k.absoluteOpacity]} endArrow lineWidth={8}  stroke={'yellow'}/>
  // yield circles.forEach(
  //   (c, i) => c.position.y(i * 20, 1));
});
