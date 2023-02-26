import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { waitFor } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text, Latex } from '@motion-canvas/2d/lib/components';
import { createRef, makeRef, range, Reference } from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';
import { createSignal, SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Center, Color, Vector2 } from '@motion-canvas/core/lib/types';
const lineColor = common.lineColor;
import * as common from '../common';
import { Drawer } from '../draw';

export default makeScene2D(function* (view) {
  const encoderColor = common.encoderColor;
  const latentColor = common.latentColor;
  const decoderColor = common.decoderColor;

  const latentSpaceText = createRef<Text>();
  const encoderText = createRef<Text>();
  const decoderText = createRef<Text>();

  const encoderTrapez = common.trapez(380, 220, 80, {position: new Vector2(-85, 0), rotation: 90, fill: encoderColor});
  const decoderTrapez = common.trapez(380, 220, 80, {position: new Vector2(85, 0), rotation: -90, fill: decoderColor});
  const bottleNeckRect = createRef<Rect>();

  const bottleNeckOpacity = createSignal(1);

  const latentSpacePosY = createSignal(220);
  const decoderShiftX = createSignal(0);
  const cvaeOpacity = createSignal(0);

  const outputCircle = createRef<Circle>();
  const inputCircle = createRef<Circle>();

  const lineWidth = 3;

  view.add(
    <>
      {encoderTrapez},
      <Node>
        {/* <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(-380, 0), new Vector2(-304, 0)]} endArrow arrowSize={8}/> */}
        <Circle fill={'white'} position={new Vector2(-380, 0)} width={40} height={40} ref={inputCircle}/>
        <Text text={'Input'} position={new Vector2(-380, 50)} fill={'white'}/>
      </Node>

      <Node position={() => new Vector2(decoderShiftX(), 0)}>
        {decoderTrapez},
        <Node rotation={180}>
            {/* <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(-380, 0), new Vector2(-304, 0)]} startArrow arrowSize={8}/> */}
            <Circle fill={'white'} position={new Vector2(-380, 0)} width={40} height={40} ref={outputCircle}/>
        </Node>
        <Text text={'Output'} position={new Vector2(380, 50)} fill={'white'}/>
      </Node>

      <Node opacity={() => bottleNeckOpacity()}>
        <Rect fill={latentColor} width={80} height={160} ref={bottleNeckRect} />
        <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(-85, 0), new Vector2(-40, 0)]} endArrow arrowSize={8} />
        <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(40, 0), new Vector2(85, 0)]} endArrow arrowSize={8} />
    </Node>

      <Node opacity={() => 1 - bottleNeckOpacity()}>
        <Rect fill={latentColor} width={80} height={160} position={new Vector2(0, 120)} />
        <Rect fill={latentColor} width={80} height={160} position={new Vector2(0, -120)} />
        <Rect fill={latentColor} width={80} height={160} position={new Vector2(125+50, 0)} />
        <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(-85, -40), new Vector2(-40, -120)]} endArrow arrowSize={8} />
        <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(-85, 40), new Vector2(-40, 120)]} endArrow arrowSize={8} />
        <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(40, 120), new Vector2(85+50, 40)]} endArrow arrowSize={8} />
        <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(40, -120), new Vector2(85+50, -40)]} endArrow arrowSize={8} />
        <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(165+50, 0), new Vector2(165+45+50, 0)]} endArrow arrowSize={8} />

        <Latex height={30} tex="{\color{white} \sigma}" position={new Vector2(0, 0)}></Latex>
        {/* <Text text={'std'} position={new Vector2(0, 0)} fill={lineColor} ref={encoderText} /> */}
        {/* <Text text={'mean'} position={new Vector2(0, 220)} fill={lineColor} ref={encoderText} /> */}
        <Latex height={30} tex="{\color{white} \mu}" position={new Vector2(0, 225)}></Latex>
        <Text text={'sampled latent'} position={new Vector2(200, 160)} fill={lineColor} ref={encoderText} />
        <Text text={'vector'} position={new Vector2(200, 210)} fill={lineColor} ref={encoderText} />
      </Node>


      <Text text={'encoder'} position={new Vector2(-250, 220)} fill={lineColor} ref={encoderText} />
      <Text text={'latent space'} position={() => new Vector2(0, latentSpacePosY())} fill={lineColor} ref={latentSpaceText} />
      <Text text={'decoder'} position={() => new Vector2(250 + decoderShiftX(), 220)} fill={lineColor} ref={decoderText} />

    {/* Additonal Inputs */}
    <Node position={new Vector2(0, -20)} opacity={cvaeOpacity}>
        <Node>
            <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(-380, -200), new Vector2(-380, -80), new Vector2(-304, -80)]} endArrow arrowSize={8}/>
            <Text text={'Additional Input'} position={new Vector2(-380, -220)} fill={'white'}/>
        </Node>
        <Node position={new Vector2(570, 0)}>
            <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(-380, -200), new Vector2(-380, -80), new Vector2(-304, -80)]} endArrow arrowSize={8}/>
            <Text text={'Additional Input'} position={new Vector2(-380, -220)} fill={'white'}/>
        </Node>
      </Node>
    </>
  );

    const drawer = new Drawer(view);
    drawer.makeRightArrow(inputCircle(), encoderTrapez);
    drawer.makeRightArrow(decoderTrapez, outputCircle());

  yield * all(
    bottleNeckOpacity(0, 1),
    latentSpacePosY(280, 1),
    decoderShiftX(128+50, 1),
  )

  yield * cvaeOpacity(1, 1);
});
