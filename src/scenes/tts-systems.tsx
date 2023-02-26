import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text, Image } from '@motion-canvas/2d/lib/components';
import { createRef, makeRef, makeRefs, range, Reference } from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';
import { createSignal, SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Center, Color, Vector2 } from '@motion-canvas/core/lib/types';
import * as common from '../common';
import textProssessingSrc from "../imgs/TextPreprocessing.png";
import mlSrc from "../imgs/ml.png";
import waveformSrc from "../imgs/waveform.png";
import textSrc from "../imgs/text.png";
import { linear } from "@motion-canvas/core/lib/tweening";

const transparent = common.transparent;

export default makeScene2D(function* (view) {
    const root = createRef<Rect>();
    const imgSize = 150;
    const gap = 50;
    const opacities: SimpleSignal<number>[] = [];

    const accusticText = createRef<Text>();
    const cascadePos = createSignal(new Vector2(0, -300));
    const endToEndToPos = createSignal(new Vector2(-1500, -300));
    const figures: Node[] = [];

    view.add(
    <Node>
    <Text text={"Cascaded TTS systems"} fill={common.textColor} position={cascadePos} fontSize={100}/>
    <Text text={"End-to-End TTS systems"} fill={common.textColor} position={endToEndToPos} fontSize={100}/>
    <Rect layout alignItems={'end'} justifyContent={'center'} gap={gap} ref={root}>
        <Rect layout direction={'column'} gap={20} alignItems={'center'} ref={makeRef(figures, 0)}>
            <Image height={imgSize} maxWidth={imgSize} src={textSrc}></Image>
            <Text text="input Text" fill={common.textColor}/>,
        </Rect>
        <Rect layout direction={'column'} gap={20} alignItems={'center'} ref={makeRef(figures, 1)}>
            <Image height={imgSize} maxWidth={imgSize} src={textProssessingSrc}></Image>
            <Text text={'text processing'} fill={common.textColor}/>
        </Rect>
        <Rect layout direction={'column'} justifyContent={'end'} gap={20} alignItems={'center'} ref={makeRef(figures, 2)}>
            <Image height={imgSize} maxWidth={imgSize} src={mlSrc}></Image>
            <Text text={'Acoustic model'} fill={common.textColor} ref={accusticText}/>
        </Rect>
        <Rect layout direction={'column'} justifyContent={'end'} gap={20} alignItems={'center'} ref={makeRef(figures, 3)}>
            <Image height={imgSize} maxWidth={imgSize} src={mlSrc}></Image>
            <Text text={'Vocoder'} fill={common.textColor}/>
        </Rect>
        <Rect layout direction={'column'} justifyContent={'end'} gap={20} alignItems={'center'} ref={makeRef(figures, 4)}>
            <Image height={imgSize} maxWidth={imgSize} src={waveformSrc}></Image>
            <Text text={'waveform'} fill={common.textColor}/>
        </Rect>
    </Rect>,
    </Node>);

    figures.forEach(node => {
        let o = createSignal(1);
        opacities.push(o);
        node.opacity(o);
    });

    let lastArrow: Line = null;
    for (let i = 0; i < figures.length - 1; i++) {
        const a = figures[i];
        const b = figures[i+1];

        let l = common.createArrow([
            () => a.absolutePosition().addX(imgSize/1.8).addY(-30),
            () => b.absolutePosition().addX(-imgSize/1.8).addY(-30)]);
        view.add(l);
        l.absolutePosition(Vector2.zero);
        l.opacity(opacities[i+1]);
        lastArrow = l;
    }

    for (let i = 1; i < figures.length; i++) {
        opacities[i](0);
    }

    for (let i = 1; i < figures.length; i++) {
        yield * opacities[i](1, 1);
    }

    yield * all(
        endToEndToPos(endToEndToPos().addX(1500), 1),
        cascadePos(cascadePos().addX(1500), 1));

    yield * opacities[3](0, 1);

    figures[3].remove();
    lastArrow.points()[0] = figures[2].absolutePosition().addX(imgSize/1.8).addY(-30);
    accusticText().text('End-to-End model');
    yield * accusticText().rotation(2, 0.2);
    yield * accusticText().rotation(-2, 0.2);
    yield * accusticText().rotation(0, 0.2);
    // lastArrow.remove();
    // vocoder().remove();

    // yield * endToEndToPos(1, 1);
    
    // yield *vocoder().position(vocoder().position().addX(-100), 1);
});
