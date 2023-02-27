import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { all, delay, loop, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text, Image } from '@motion-canvas/2d/lib/components';
import { createRef, makeRef, makeRefs, range, Reference } from '@motion-canvas/core/lib/utils';
import { createSignal, SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Center, Color, Vector2 } from '@motion-canvas/core/lib/types';
import * as common from '../common';
import textProssessingSrc from "../imgs/TextPreprocessing.png";
import mlSrc from "../imgs/ml.png";
import waveformSrc from "../imgs/waveform.png";
import textSrc from "../imgs/text.png";
import { createEaseOutBack, easeInBack, easeInOutSine, easeOutExpo, linear } from "@motion-canvas/core/lib/tweening";

const transparent = common.transparent;

function createSinusSignal(){
    return range(110)
        .map(x => 
            new Circle({width: 5, height: 5, fill: 'blue', position: new Vector2(x, Math.sin(x))}));
}

function wave1(x: number){
    return Math.sin(x);
}

function wave2(x: number){
    return Math.sin(x/2);
}

function final_wave(x: number,){
    return wave1(x) + wave2(x);
}

export default makeScene2D(function* (view) {
    const start = createSignal(0);
    const final_points = range(50).map(x => 
        createSignal(() => new Vector2(x/2, final_wave(x/2 + start()))));

    const points1 = range(50).map(x => 
            createSignal(() => new Vector2(x/2, wave1(x/2 + start()))));

    const points2 = range(50).map(x => 
        createSignal(() => new Vector2(x/2, wave2(x/2 + start()))));

    const w = 24;
    const wave1X = createSignal(-50);
    const wave2X = createSignal(-50);
    const opacyHelperArrows = createSignal(0);
    const scale = createSignal(45);
    const amplitudeWavelenght = createSignal(0);

    view.add(
        <Node scale={scale}>
            <Rect position={new Vector2(-w/2, -7)}>
                <Rect>
                    <Line points={[Vector2.zero.addX(0), new Vector2(w+1, 0)]} lineWidth={0.1} stroke={'gray'}></Line>
                    <Line points={final_points} stroke={'blue'} lineWidth={0.2}/>
                    <Rect position={new Vector2(w/2, 0)} layout stroke={'white'} lineWidth={0.5} width={w} height={5}/>

                    <Line points={() => [new Vector2(points1[9]().x, 0), points1[9]()]} lineWidth={0.2} stroke={'red'} end={10} start={-10} startOffset={10} arrowSize={0.3} opacity={opacyHelperArrows}/>
                    <Line points={() => [new Vector2(points2[9]().x+0.1, points1[9]().y), points1[9]().addX(0.1).addY(points2[9]().y)]} lineWidth={0.2} stroke={'green'} end={10} start={-10} startOffset={10} arrowSize={0.3} opacity={opacyHelperArrows}/>
                </Rect>,
                <Rect position={() => new Vector2(wave1X(), 7)}>
                    <Line points={[Vector2.zero.addX(0), new Vector2(w+1, 0)]} lineWidth={0.1} stroke={'gray'}></Line>
                    <Line points={points1} stroke={'blue'} lineWidth={0.2}/>
                    <Rect position={new Vector2(w/2, 0)} layout stroke={'white'} lineWidth={0.5} width={w} height={5}/>
                    {/* <Line points={[points1[10], points1[10]().addY(4.2)]} lineWidth={0.1} stroke={'red'}/> */}
                    <Line points={() => [new Vector2(points1[9]().x, 0), points1[9]()]} lineWidth={0.2} stroke={'red'} end={10} start={-10} startOffset={10} arrowSize={0.3} opacity={opacyHelperArrows} />

                    <Node scale={amplitudeWavelenght}>
                        {/* Wavelength */}
                        {/* <Line points={() => [points1[11], points1[23]().addX(0.4)]} lineWidth={0.1} stroke={'yellow'} end={10} start={-10} startOffset={10} lineDash={[0.1, 0.1]}/>
                        <Text scale={0.8} text={'wavelenght'} fontSize={1} position={new Vector2(8.4, 1.5)} fill={common.textColor}></Text> */}
                        
                        {/* Ampltude */}
                        <Line points={() => [new Vector2(points1[5]().x - 0.2, 0), points1[5]().addX(-0.2)]} lineWidth={0.1} stroke={'yellow'} end={10} start={-10} startOffset={10} lineDash={[0.1, 0.1]}/>
                        <Text scale={0.8} text={'amplitude'} fontSize={1} position={new Vector2(2.5, -1.8)} fill={common.textColor}></Text>

                        {/* one oscillation */}
                        <Line points={() => [new Vector2(points1[27]().x, 1), new Vector2(points1[39]().x - 0.2, 1)]} lineWidth={0.1} stroke={'yellow'} end={10} start={-10} startOffset={10} lineDash={[0.1, 0.1]} startArrow endArrow arrowSize={0.2}/>
                        <Line points={() => [new Vector2(points1[27]().x - 0.2, 0), new Vector2(points1[27]().x -0.2, 1)]} lineWidth={0.1} stroke={'yellow'} end={10} start={-10} startOffset={10} lineDash={[0.1, 0.1]}/>
                        <Line points={() => [new Vector2(points1[39]().x, 0), new Vector2(points1[39]().x, 1)]} lineWidth={0.1} stroke={'yellow'} end={10} start={-10} startOffset={10} lineDash={[0.1, 0.1]}/>
                        <Text scale={0.8} text={'one oscillation'} fontSize={1} position={new Vector2(16.5, 1.5)} fill={common.textColor}></Text>
                    </Node>
                </Rect>,
                <Rect position={() => new Vector2(wave2X(), 14)}>
                    <Line points={[Vector2.zero.addX(0), new Vector2(w+1, 0)]} lineWidth={0.1} stroke={'gray'}></Line>
                    <Line points={points2} stroke={'blue'} lineWidth={0.2} lineCap={'round'}/>
                    <Rect position={new Vector2(w/2, 0)} layout stroke={'white'} lineWidth={0.5} width={w} height={5}/>
                    {/* <Line points={[points2[10], points2[10]().addY(4.2)]} lineWidth={0.1} stroke={'green'}/> */}
                    <Line points={() => [new Vector2(points2[9]().x, 0), points2[9]()]} lineWidth={0.2} stroke={'green'} end={10} start={-10} startOffset={10} arrowSize={0.3} opacity={opacyHelperArrows}/>
                </Rect>,
            </Rect>
            <Rect>
                
            </Rect>
        </Node>,
    );

    yield * all(
        start(15, 8, linear),
        delay(2, wave1X(0, 1, easeOutExpo)),
        delay(3, wave2X(0, 1, easeOutExpo)),
        delay(4, opacyHelperArrows(1, 0))
        );

    yield * scale(70, 1);
    yield * opacyHelperArrows(0, 0);
    yield * amplitudeWavelenght(1, 1);
});
