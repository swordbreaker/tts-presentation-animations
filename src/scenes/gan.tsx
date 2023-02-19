import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text, Image, Shape } from '@motion-canvas/2d/lib/components';
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
import { Drawer } from '../draw';

const transparent = common.transparent;

export default makeScene2D(function* (view) {
    const drawer = new Drawer(view);

    const gen = drawer.createBlock('generator');
    drawer.fillColor = 'black';
    const input = drawer.createCircle({ text: 'input', width: 20, rectProps: { marginTop: 32 } });
    const genOutut = drawer.createCircle({ text: 'output', width: 20, rectProps: { margin: [32, 50, 0, 50] } });
    const gt = drawer.createCircle({ text: 'real data', width: 20, textOffset: new Vector2(0, -50) }).opacity(0);
    const noise = drawer.createCircle({ text: 'noise', width: 20, textOffset: new Vector2(0, -50) });
    const realFake = drawer.createCircle({ text: 'real or fake?', width: 20, rectProps: { margin: [32, 100, 0, 100] } }).opacity(0);

    drawer.fillColor = '#ff7e33';
    const disc = drawer.createBlock('discriminator').opacity(0);

    const updateText = new Text({text: 'update', fill: 'green'}).opacity(0);

    const mse = drawer.createCircle({text: '-', width: 30, textOffset: new Vector2(0, -2), circleProps: {fill: '#00000000'}}).opacity(0);

    view.add(
        <Node>
            <Rect>
                <Rect>
                    {noise}
                    {mse}
                    {gt}
                </Rect>
                <Rect layout gap={80}>
                    {input}
                    {gen}
                    {genOutut}
                    {disc}
                </Rect>
                <Rect>
                    {realFake}
                    {updateText}
                </Rect>
            </Rect>
        </Node>
    );

    gt.absolutePosition(() => genOutut.absolutePosition().addY(-150));
    noise.absolutePosition(() => input.absolutePosition().addY(-150))
    realFake.absolutePosition(() => disc.absolutePosition().addY(150));
    mse.absolutePosition(() => gen.absolutePosition().addY(-90))

    const in_gen = drawer.makeRightArrow(input, gen, { offset1: new Vector2(-40, -16) });
    const gen_out = drawer.makeRightArrow(gen, genOutut, { offset2: new Vector2(52, -16) });
    const out_disc = drawer.makeRightArrow(genOutut, disc, { offset1: new Vector2(-52, -16) }).opacity(0);
    const disc_real = drawer.makeDownArrow(disc, realFake).opacity(0);
    const realFake_gen = drawer.makeDirectedArrow({f1: realFake, f2: gen, anchor1: 'left', anchor2: 'bottom', offset1: new Vector2(110, 0), edge2: new Vector2(0, 100)}).stroke('green').lineDash([5, 5]).opacity(0)

    const out_mse = drawer.makeDirectedArrow({f1: genOutut, f2: mse, anchor1: 'top', edge1: new Vector2(0, -20), edge2: new Vector2(50, 0)}).opacity(0);
    const gt_mse = drawer.makeDirectedArrow({f1: gt, f2: mse, anchor1: 'left', edge1: new Vector2(-20, 0), edge2: new Vector2(50, 0), offset1: new Vector2(70, 0)}).opacity(0);
    const mse_gen = drawer.makeDirectedArrow({f1: mse, f2: gen, anchor1: 'bottom', anchor2: 'top', offset1: new Vector2(0, -18)}).opacity(0);

    updateText.absolutePosition(() => {
        let v = realFake_gen.points()[1] as Vector2;
        return v.addY(50)
    });

    const noise_gen = drawer.makeDirectedArrow({ f1: noise, f2: gen, anchor1: 'bottom', anchor2: 'left', offset2: new Vector2(0, -20), edge2: new Vector2(-40, 0), edge1: new Vector2(0, 40) })
    const gt_disc = drawer.makeDirectedArrow({ f1: gt, f2: disc, anchor1: 'bottom', anchor2: 'left', edge2: new Vector2(-40, 0), edge1: new Vector2(0, 40) }).opacity(0);

    yield * gt.opacity(1, 1);

    yield * all(
        mse.opacity(1, 1),
        out_mse.opacity(1, 1),
        gt_mse.opacity(1, 1),
        mse_gen.opacity(1, 1),
    );

    yield * all(
        (mse.children()[0] as Shape).stroke('red', 0.5),
        out_mse.stroke('red', 0.5),
        gt_mse.stroke('red', 0.5),
        mse_gen.stroke('red', 0.5),
    );

    yield * all(
        mse.opacity(0, 1),
        out_mse.opacity(0, 1),
        gt_mse.opacity(0, 1),
        mse_gen.opacity(0, 1),
    );

    yield * all(
        disc.opacity(1, 1),
        out_disc.opacity(1, 1),
        gt_disc.opacity(1, 1));

    yield * all(
        disc_real.opacity(1, 1),
        realFake.opacity(1, 1));

    yield * all(
        realFake_gen.opacity(1, 1),
        updateText.opacity(1, 1),
    );
});
