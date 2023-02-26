import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { waitFor } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text } from '@motion-canvas/2d/lib/components';
import { createRef, makeRef, range, Reference } from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';
import { createSignal, SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Center, Color, Vector2 } from '@motion-canvas/core/lib/types';
import * as common from '../common';
import { Drawer } from '../draw';

const cirlceColor = "#195db2";
const transparent = common.transparent;

function makeLines(view: View2D, a: Circle[], b: Circle[], opacity: SignalValue<number>) {
  let lines: Line[] = [];
  for (let i = 0; i < a.length; i++) {
    const ci = a[i];
    for (let k = 0; k < b.length; k++) {
      const ck = b[k];
      let l = new Line({ points: [ci.absolutePosition, ck.absoluteOpacity], lineWidth: 2, stroke: 'white', opacity: opacity });
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
  const encCicles1: Circle[] = [];
  const encCicles2: Circle[] = [];
  const encCicles3: Circle[] = [];
  const latentCircles: Circle[] = [];
  const decCircles1: Circle[] = [];
  const decCircles2: Circle[] = [];
  const decCircles3: Circle[] = [];

  const encoderColor = common.encoderColor;
  const latentColor = common.latentColor;
  const decoderColor = common.decoderColor;

  const latentSpaceRect = createRef<Rect>();
  const encoderRect = createRef<Rect>();
  const decoderRect = createRef<Rect>();

  const latentSpaceText = createRef<Text>();
  const encoderText = createRef<Text>();
  const decoderText = createRef<Text>();

  const encoderTrapez = createRef<Line>();
  const decoderTrapez = createRef<Line>();
  const bottleNeckRect = createRef<Rect>();

  const outputCircle = createRef<Circle>();
  const inputCircle = createRef<Circle>();

  const opacity1 = createSignal<number>(1);

  const oldEncoderOpacity = createSignal<number>(1);
  const newEncoderOpacity = createSignal(() => 1 - oldEncoderOpacity());
  const oldDecoderOpacity = createSignal<number>(1);
  const newDecoderOpacity = createSignal(() => 1 - oldDecoderOpacity());
  const newBottlenecOpacit = createSignal(0);

  const lineWidth = common.lineWidth;

  function trapez(width: number, height: number, rotation: number = 0, position: Vector2 = Vector2.zero, innerDelta: number = 10, fill: string = 'white', ref: Reference<Line> = null, opacity: SignalValue<number> = null) {
    return <Line
      closed
      position={position}
      rotation={rotation}
      points={[new Vector2(-width / 2 + innerDelta, 0), new Vector2(width / 2 - innerDelta, 0), new Vector2(width / 2, height), new Vector2(-width / 2, height)]}
      lineWidth={lineWidth}
      fill={fill}
      ref={ref}
      opacity={opacity}/>
  }

  view.add(
    <>
      <Rect layout alignItems={'center'} justifyContent={'center'}>
        {/* encoder */}
        <Rect layout ref={encoderRect} stroke={transparent} lineWidth={3} opacity={oldEncoderOpacity}>
          <Rect layout direction={'column'}>
            {range(5).map(index => (
              <Circle margin={10} width={50} height={50} ref={makeRef(encCicles1, index)} fill={cirlceColor} />
            ))}
          </Rect>,
          <Rect layout direction={'column'} alignItems={'center'} justifyContent={'center'}>
            {range(4).map(index => (
              <Circle margin={10} width={50} height={50} ref={makeRef(encCicles2, index)} fill={cirlceColor} />
            ))}
          </Rect>,
          <Rect layout direction={'column'} alignItems={'center'} justifyContent={'center'}>
            {range(3).map(index => (
              <Circle margin={10} width={50} height={50} ref={makeRef(encCicles3, index)} fill={cirlceColor} />
            ))}
          </Rect>,
        </Rect>,
        {/* Latent space */}
        <Rect padding={10} layout direction={'column'} alignItems={'center'} justifyContent={'center'} margin={50} ref={latentSpaceRect} stroke={transparent} lineWidth={lineWidth}>
          {range(2).map(index => (
            <Circle margin={[10, 5, 10, 5]} width={50} height={50} ref={makeRef(latentCircles, index)} fill={cirlceColor} />
          ))}
        </Rect>,
        {/* decoder */}
        <Rect layout ref={decoderRect} stroke={transparent} lineWidth={3} opacity={oldDecoderOpacity}>
          <Rect layout direction={'column'} justifyContent={'center'}>
            {range(3).map(index => (
              <Circle margin={10} width={50} height={50} ref={makeRef(decCircles1, index)} fill={cirlceColor} />
            ))}
          </Rect>,
          <Rect layout direction={'column'} justifyContent={'center'}>
            {range(4).map(index => (
              <Circle margin={10} width={50} height={50} ref={makeRef(decCircles2, index)} fill={cirlceColor} />
            ))}
          </Rect>,
          <Rect layout direction={'column'} justifyContent={'center'}>
            {range(5).map(index => (
              <Circle margin={10} width={50} height={50} ref={makeRef(decCircles3, index)} fill={cirlceColor} />
            ))}
          </Rect>,
        </Rect>
      </Rect>
      <Text text={'encoder'} position={new Vector2(-250, 220)} fill={transparent} ref={encoderText} />
      <Text text={'latent space'} position={new Vector2(0, 220)} fill={transparent} ref={latentSpaceText} />
      <Text text={'decoder'} position={new Vector2(250, 220)} fill={transparent} ref={decoderText} />

      {trapez(380, 220, 90, new Vector2(-85, 0), 80, encoderColor, encoderTrapez, newEncoderOpacity)},
      {trapez(380, 220, -90, new Vector2(85, 0), 80, decoderColor, decoderTrapez, newDecoderOpacity)},
      <Rect fill={latentColor} width={80} height={160} ref={bottleNeckRect} opacity={newBottlenecOpacit} />
      <Line stroke={common.lineColor} lineWidth={lineWidth} points={[new Vector2(-85, 0), new Vector2(-40, 0)]} endArrow arrowSize={common.arrowSize} opacity={newBottlenecOpacit} />
      <Line stroke={common.lineColor} lineWidth={lineWidth} points={[new Vector2(40, 0), new Vector2(85, 0)]} endArrow arrowSize={common.arrowSize} opacity={newBottlenecOpacit}/>

      <Node>
        {/* <Line stroke={common.lineColor} lineWidth={lineWidth} points={[new Vector2(-380, 0), new Vector2(-304, 0)]} endArrow arrowSize={common.arrowSize}/> */}
        <Circle fill={'white'} position={new Vector2(-380, 0)} width={40} height={40} ref={inputCircle}/>
        <Text text={'Input'} position={new Vector2(-380, 50)} fill={'white'}/>
      </Node>
      <Node rotation={180}>
        {/* <Line stroke={common.lineColor} lineWidth={lineWidth} points={[new Vector2(-380, 0), new Vector2(-304, 0)]} endArrow arrowSize={common.arrowSize}/> */}
        <Circle fill={'white'} position={new Vector2(-380, 0)} width={40} height={40} ref={outputCircle}/>
      </Node>
      <Text text={'Output'} position={new Vector2(380, 50)} fill={'white'} />
    </>
  );

  const drawer = new Drawer(view);
  drawer.makeRightArrow(decoderRect(), outputCircle());
  drawer.makeRightArrow(inputCircle(), encoderRect());

  makeLines(view, encCicles1, encCicles2, opacity1);
  makeLines(view, encCicles2, encCicles3, opacity1);
  makeLines(view, encCicles3, latentCircles, opacity1);
  makeLines(view, latentCircles, decCircles1, opacity1);
  makeLines(view, decCircles1, decCircles2, opacity1);
  makeLines(view, decCircles2, decCircles3, opacity1);

  yield* all(
    encoderRect().stroke(encoderColor, 0.5),
    encoderText().fill('white', 0.5));

  yield* all(
    latentSpaceRect().stroke(latentColor, 0.5),
    latentSpaceText().fill('white', 0.5));

  yield* all(
    decoderRect().stroke(decoderColor, 0.5),
    decoderText().fill('white', 0.5));

  yield* opacity1(0, 0.5)
  yield* oldEncoderOpacity(0, 0.5);
  yield* newBottlenecOpacit(1, 0.5);
  yield* oldDecoderOpacity(0, 0.5);

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
