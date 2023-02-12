import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { waitFor } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text } from '@motion-canvas/2d/lib/components';
import { createRef, makeRef, range, Reference } from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';
import { createSignal, SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Center, Color, Vector2 } from '@motion-canvas/core/lib/types';
const lineColor = "#b1d4d4";
const cirlceColor = "#195db2";

export default makeScene2D(function* (view) {
  const encoderColor = 'red';
  const latentColor = 'green';
  const decoderColor = 'blue';
  const transparent = '#00000000';

  const latentSpaceText = createRef<Text>();
  const encoderText = createRef<Text>();
  const decoderText = createRef<Text>();

  const encoderTrapez = createRef<Line>();
  const decoderTrapez = createRef<Line>();
  const bottleNeckRect = createRef<Rect>();

  const bottleNeckOpacity = createSignal(1);

  const latentSpacePosY = createSignal(220);
  const decoderShiftX = createSignal(0);
  const cvaeOpacity = createSignal(0);


  const lineWidth = 3;

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
      {trapez(380, 220, 90, new Vector2(-85, 0), 80, encoderColor, encoderTrapez)},
      <Node>
        <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(-380, 0), new Vector2(-304, 0)]} endArrow arrowSize={8}/>
        <Circle fill={'white'} position={new Vector2(-380, 0)} width={40} height={40}/>
        <Text text={'Input'} position={new Vector2(-380, 50)} fill={'white'}/>
      </Node>

      <Node position={() => new Vector2(decoderShiftX(), 0)}>
        {trapez(380, 220, -90, new Vector2(85, 0), 80, decoderColor, decoderTrapez)},
        <Node rotation={180}>
            <Line stroke={lineColor} lineWidth={lineWidth} points={[new Vector2(-380, 0), new Vector2(-304, 0)]} endArrow arrowSize={8}/>
            <Circle fill={'white'} position={new Vector2(-380, 0)} width={40} height={40}/>
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

        <Text text={'std'} position={new Vector2(0, 0)} fill={lineColor} ref={encoderText} />
        <Text text={'mean'} position={new Vector2(0, 220)} fill={lineColor} ref={encoderText} />
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

  yield * all(
    bottleNeckOpacity(0, 1),
    latentSpacePosY(280, 1),
    decoderShiftX(128+50, 1),
  )

  yield * cvaeOpacity(1, 1);
});
