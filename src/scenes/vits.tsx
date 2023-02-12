import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { waitFor } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text, RectProps, TextProps } from '@motion-canvas/2d/lib/components';
import { createRef, makeRef, range, Reference} from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';
import { createSignal, SignalValue, SimpleSignal, } from '@motion-canvas/core/lib/signals';
import { Center, Color, PossibleVector2, Vector2 } from '@motion-canvas/core/lib/types';
const blockColor = 'green';
import * as common from '../common';

type AnchorDirection = 'left' | 'right' | 'bottom' | 'top';

type directedArrowProps = {
    f1: Node,
    f2: Node,
    anchor1?: AnchorDirection,
    anchor2?: AnchorDirection,
    offset1?: Vector2,
    offset2?: Vector2,
}

function createBlock(text: SignalValue<string>, rectProps: RectProps = {}, textProps: TextProps = {}){

    return new Rect({
        children: [new Text({text: text, ...textProps, textWrap: 'pre'})],
        justifyContent: 'center',
        alignItems: 'center',
        stroke: common.lineColor,
        fill: blockColor,
        lineWidth: common.lineWidth,
        radius: 5,
        padding: 10,
        ...rectProps
    });
}

function createBlocks(n: number, rectProps: RectProps = {}, colors = ['red', 'blue', 'green']){
    return new Rect({
        layout: true,
        justifyContent: 'center',
        padding: 10,
        gap: 20,
        children: 
            range(n).map(i =>
            (<Rect width={20} height={40} fill={colors[i]} stroke={common.lineColor} lineWidth={common.lineWidth}/>)
        ),
        ...rectProps
    });
}

function makeUpArrow(f1: Node, f2: Node, view: View2D | Node){
    let p1 = () => f1.absolutePosition().addY(f1.cacheRect().top);
    let p2 = () => f2.absolutePosition().addY(f2.cacheRect().bottom);
    return makeArrow([p1, p2], view);
}

function makeDownArrow(f1: Node, f2:Node, container: View2D | Node) {
    return makeDirectedArrow({f1: f1, f2: f2, anchor1: 'bottom', anchor2: 'top'}, container);
}

function makeRightArrow(f1: Node, f2: Node, offset1: number, offset2:number, view: View2D | Node){
    return makeArrow(() => {
        let start = f1.absolutePosition().addX(f1.cacheRect().right);
        let end = f2.absolutePosition().addX(f2.cacheRect().left);
        let p1 = start.addX(offset1);
        let p2 = end.addX(-offset2);
        return [start, p1, p2, end]
    }, view);
}

function makeDirectedArrow(props: directedArrowProps, view: View2D | Node){
    function getAnchor(node: Node, direction: 'left' | 'right' | 'bottom' | 'top'){
        switch(direction){
            case 'left': return new Vector2(node.cacheRect().left, 0);
            case 'right': return new Vector2(node.cacheRect().right, 0);
            case 'bottom': return new Vector2(0, node.cacheRect().bottom);
            case 'top': return new Vector2(0, node.cacheRect().top);
        }
    }

    props = {anchor1: 'right', anchor2: 'right', offset1: Vector2.zero, offset2: Vector2.zero, ...props}

    return makeArrow(() => {
        let start = props.f1.absolutePosition().add(getAnchor(props.f1, props.anchor1));
        let end = props.f2.absolutePosition().add(getAnchor(props.f2, props.anchor2));
        let points = [start];

        if (props.offset1 != Vector2.zero){
            points.push(start.add(props.offset1))
        }
        if (props.offset2 != Vector2.zero){
            points.push(end.add(props.offset2))
        }

        points.push(end);
        return points;
    }, view);
}

function makeArrow(points: SignalValue<SignalValue<PossibleVector2>[]>, container: View2D | Node) {
    let l = new Line({points: points, lineWidth: common.lineWidth, stroke: common.lineColor, endArrow: true, arrowSize: common.arrowSize});

    if(container instanceof View2D) {
        container.add(l);
    }
    else {
        container.children().push(l);
    }
    l.absolutePosition(Vector2.zero);
    return l;
}



export default makeScene2D(function* (view) {

    const z = createBlocks(5, {}, ['red', 'red', 'blue', 'blue', 'green']);
    const dedocer = createBlock('decoder');
    const encoder = createBlock('posterior encoder');
    const flow = createBlock('flow');
    const alignment = createBlock('Monotonic alignment');
    const projection = createBlock('Projection');
    const textEncoder = createBlock('Text Encoder');
    const hText = createBlocks(3);
    const durationPredictor = createBlock('Stochastic duration \n        predictor');

    const spectogram = <Text fill={common.textColor}>Spectrogram</Text>;
    const cText = <Text fill={common.textColor}>Text</Text>;
    const noise = <Text fill={common.textColor}>Noise</Text>;
    const waveform = <Text fill={common.textColor}>Waveform</Text>;
    
    const muSignma = (
        <Rect justifyContent={'center'}>
            {createBlocks(3)},
            {createBlocks(3, {marginLeft: -130, marginTop: 10})},
        </Rect>
    )

    view.add(
    <Node>
    <Rect layout alignItems={'end'}>
        <Rect layout alignItems={'center'} direction={'column'} gap={50}>
            {waveform}
            {dedocer}
            {z}
            {encoder}
            {spectogram}
        </Rect>
        <Rect layout alignItems={'center'} direction={'column'} gap={50} marginRight={200} marginLeft={200}>
            {flow}
            {alignment}
            {muSignma}
            {projection}
            {hText}
            {textEncoder}
            {cText}
        </Rect>
        <Rect layout alignItems={'center'} direction={'column'} gap={50}>
            {durationPredictor}
            {noise}
        </Rect>
    </Rect>
    </Node>);

    const meanVarText = <Text fill={common.textColor}>mean & var</Text>;
    view.add(meanVarText);
    meanVarText.absolutePosition(muSignma.absolutePosition().addX(200));
    
    makeUpArrow(textEncoder, hText, view);
    makeUpArrow(hText, projection, view);
    makeUpArrow(projection, muSignma, view);
    makeUpArrow(muSignma, alignment, view);
    makeDownArrow(flow, alignment, view);

    makeUpArrow(encoder, z, view);
    makeUpArrow(z, dedocer, view);
    makeUpArrow(cText, textEncoder, view);

    makeUpArrow(dedocer, waveform, view);
    
    makeRightArrow(z, flow, 50, 200, view);
    makeRightArrow(hText, durationPredictor, 50, 50, view);


    makeDirectedArrow({
            f1: alignment,
            f2: durationPredictor,
            anchor1: 'right',
            anchor2: 'top',
            offset1: new Vector2(100, 0),
            offset2: new Vector2(0,-50)},
        view)

    makeDirectedArrow(
        {
            f1: durationPredictor,
            f2: noise,
            anchor1: 'bottom',
            anchor2: 'top'
        },
        view
    )
    // makeRightArrow(alignment, durationPredictor, 50, 50, view);
});
