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
import { easeInOutCubic } from '@motion-canvas/core/lib/tweening';

function normal(x: number, mean: number, std: number) {
    const a = 1 / (std * Math.sqrt(2 * Math.PI));
    const b = Math.exp(-1 / 2 * Math.pow(((x - mean) / std), 2));
    return -a * b;
}

function createDist(points: Vector2[]) {
    return <Line
        points={points}
        stroke={common.lineColor}
        lineWidth={common.lineWidth}></Line>
}

function getRandom(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function lerpPoints(from: Vector2[], to: Vector2[], value: number){
    return from
        .map((x, i) => Vector2.lerp(x, to[i], value));
}

export default makeScene2D(function* (view) {

    const points = createSignal(
        range(0, 100).map(x =>
            new Vector2((x -50) * 10, normal(x, 50, 15) * 10000)));

    const dist = <Line
        points={points}
        stroke={common.lineColor}
        lineWidth={common.lineWidth}></Line>

    const z0 = createRef<Latex>();
    const z1 = createRef<Latex>();
    const z2 = createRef<Latex>();
    const z3 = createRef<Latex>();

    const zi0 = createRef<Latex>();
    const zi1 = createRef<Latex>();
    const zi2 = createRef<Latex>();
    const zi3 = createRef<Latex>();

    view.add(
        <Rect>
            {dist}
            <Rect layout y={250} direction={'column'} gap={100}>
            <Rect layout>
                <Latex tex="{\color{white} z_0}" height={80} ref={z0} opacity={1}/>
                <Latex tex="{\color{white} \rightarrow z_1}" height={80} ref={z1} opacity={0}/>
                <Latex tex="{\color{white} \rightarrow z_2}" height={80} ref={z2} opacity={0}/>
                <Latex tex="{\color{white} \rightarrow z_3}" height={80} ref={z3} opacity={0}/>
            </Rect>
            <Rect layout>
                <Latex tex="{\color{white} z_0}" height={80} ref={zi0} opacity={0}/>
                <Latex tex="{\color{white} \leftarrow z_1}" height={80} ref={zi1} opacity={0}/>
                <Latex tex="{\color{white} \leftarrow z_2}" height={80} ref={zi2} opacity={0}/>
                <Latex tex="{\color{white} \leftarrow z_3}" height={80} ref={zi3} opacity={0}/>
            </Rect>
            </Rect>
        </Rect>
    );

    function myNormal(x: number, mean: number, std: number){
        return 10000*normal(x, mean, std) - 10000*normal(x, -mean, std)
    }

    yield * all(
        points(points().map(x => x.addY(myNormal(x.x, 100, 25))), 1, easeInOutCubic, lerpPoints),
        z1().opacity(1, 1)
    );

    yield * all(
        points(points().map(x => x.addY(myNormal(x.x, 150, 25)/2 )), 1, easeInOutCubic, lerpPoints),
        z2().opacity(1, 1)
        );
    yield * all(
        points(points().map(x => x.addY(myNormal(x.x, 5, 25))), 1, easeInOutCubic, lerpPoints),
        z3().opacity(1, 1)
    );

    yield * all(
        z0().opacity(0, 1),
        z1().opacity(0, 1),
        z2().opacity(0, 1),
        z3().opacity(0, 1),
        zi3().opacity(1, 1),
    );

    yield * all(
        points(points().map(x => x.addY(-myNormal(x.x, 5, 25))), 1, easeInOutCubic, lerpPoints),
        zi2().opacity(1, 1),
        );
    yield * all(
        points(points().map(x => x.addY(-myNormal(x.x, 150, 25)/2 )), 1, easeInOutCubic, lerpPoints),
        zi1().opacity(1, 1),
        );
    yield * all(
        points(points().map(x => x.addY(-myNormal(x.x, 100, 25))), 1, easeInOutCubic, lerpPoints),
        zi0().opacity(1, 1),
    );
});