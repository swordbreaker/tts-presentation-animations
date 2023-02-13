import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { waitFor } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text, RectProps, TextProps, Image, CircleProps, LineProps } from '@motion-canvas/2d/lib/components';
import { createRef, makeRef, range, Reference} from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';
import { createSignal, SignalValue, SimpleSignal, } from '@motion-canvas/core/lib/signals';
import { Center, Color, PossibleVector2, Vector2 } from '@motion-canvas/core/lib/types';
import * as common from '../common';
import monotonicAlignmentSrc from '../imgs/MonoticAlignment.png';
import { vector2Signal } from '@motion-canvas/2d/lib/decorators';

const blockColor = '#038f61';

type AnchorDirection = 'left' | 'right' | 'bottom' | 'top';

type directedArrowProps = {
    f1: Node,
    f2: Node,
    anchor1?: AnchorDirection,
    anchor2?: AnchorDirection,
    edge1?: Vector2,
    edge2?: Vector2,
    offset1?: Vector2,
    offset2?: Vector2,
}

function createBlock(text: SignalValue<string>, rectProps: RectProps = {}, textProps: TextProps = {}){

    return new Rect({
        children: [new Text({text: text, ...textProps, textWrap: 'pre', fill: common.textColor})],
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

function makeUpArrow(f1: Node, f2: Node, view: View2D | Node, offset1 = Vector2.zero, offset2 = Vector2.zero){
    let p1 = () => f1.absolutePosition().addY(f1.cacheRect().top);
    let p2 = () => f2.absolutePosition().addY(f2.cacheRect().bottom);
    return makeDirectedArrow({f1: f1, f2: f2, anchor1: 'top', anchor2: 'bottom', offset1: offset1, offset2: offset2}, view)
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

    props = {anchor1: 'right', anchor2: 'right', edge1: Vector2.zero, edge2: Vector2.zero, offset1: Vector2.zero, offset2: Vector2.zero, ...props}

    return makeArrow(() => {
        let start = props.f1.absolutePosition().add(getAnchor(props.f1, props.anchor1)).add(props.offset1);
        let end = props.f2.absolutePosition().add(getAnchor(props.f2, props.anchor2)).add(props.offset2);
        let points = [start];

        if (props.edge1 != Vector2.zero){
            points.push(start.add(props.edge1))
        }
        if (props.edge2 != Vector2.zero){
            points.push(end.add(props.edge2))
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

function createMonotonicAlignment(){
    let circleProps = {
        lineWidth: common.lineWidth,
        stroke: common.lineColor,
        width: 50,
        height: 50,
    } as CircleProps

    let textProp = {
        fill: common.textColor,
    } as TextProps;

    return (
        <Rect layout direction={'column'} gap={8}>
            <Rect layout gap={8}>
                {new Circle({fill: 'white', ...circleProps})}
                {new Circle({fill: 'white', ...circleProps})}
                {new Circle(circleProps)}
                {new Circle(circleProps)}
                {new Circle(circleProps)}
                {new Text({text: '2', ...textProp})}
            </Rect>
            <Rect layout gap={8}>
                {new Circle(circleProps)}
                {new Circle(circleProps)}
                {new Circle({fill: 'white', ...circleProps})}
                {new Circle({fill: 'white', ...circleProps})}
                {new Circle(circleProps)}
                {new Text({text: '2', ...textProp})}
            </Rect>
            <Rect layout gap={8}>
                {new Circle(circleProps)}
                {new Circle(circleProps)}
                {new Circle(circleProps)}
                {new Circle(circleProps)}
                {new Circle({fill: 'white', ...circleProps})}
                {new Text({text: '1', ...textProp})}
            </Rect>
        </Rect>
    )
}

function createCoder(text: string, width=200, lineProps: LineProps = {}, textProps : TextProps = {}){
    textProps = {text: text, fill: common.textColor, layout: false, position: new Vector2(0), ...textProps} as TextProps;
    lineProps = {fill: 'gray', stroke: common.lineColor, lineWidth: common.lineWidth, offset: new Vector2(0,1), ...lineProps}
    return <Rect>
        {common.trapez(width, 60, 20, lineProps)}
        {new Text(textProps)}
    </Rect>;
}

export default makeScene2D(function* (view) {

    const z = createBlocks(5, {}, ['red', 'red', 'blue', 'blue', 'green']);
    const fz = createBlocks(5, {}, ['red', 'red', 'blue', 'blue', 'green']);
    const decoder = createCoder('decoder', 200, {rotation: 180, fill: common.decoderColor});

    const encoder = createCoder('posterior encoder', 380, {fill: common.encoderColor});
    const flow = createBlock('flow');
    const alignment = createMonotonicAlignment();
    const projection = createBlock('projection');
    const textEncoder = createCoder('text encoder', 275, {fill: common.encoderColor});
    const hText = createBlocks(3);
    const durationPredictor = createBlock('stochastic duration \n        predictor');

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
            {decoder}
            {z}
            {encoder}
            {spectogram}
        </Rect>
        <Rect layout alignItems={'center'} direction={'column'} gap={50} marginRight={200} marginLeft={200}>
            {flow}
            {fz}
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
    
    // arrows
    const textEncoder_hText = makeUpArrow(textEncoder, hText, view, new Vector2(0, 25), new Vector2(0, -5));
    const hText_projection = makeUpArrow(hText, projection, view);
    const projection_muSignma =makeUpArrow(projection, muSignma, view);
    const muSignma_alignment =makeUpArrow(muSignma, alignment, view);
    const flow_fz = makeDownArrow(flow, fz, view);
    const fz_alignment =makeDownArrow(fz, alignment, view);

    const encoder_z = makeUpArrow(encoder, z, view, new Vector2(0, 25), new Vector2(0, -5));

    const z_decoder = makeDirectedArrow({f1: z, f2: decoder, anchor1:'top', anchor2: 'bottom', offset2: new Vector2(0, -20)}, view);
    // makeUpArrow(z, dedocer, view);

    const cText_textEncoder = makeUpArrow(cText, textEncoder, view, new Vector2(0, 0), new Vector2(0, -20));

    const decoder_waveform = makeDirectedArrow({f1: decoder, f2: waveform, anchor1: 'top', anchor2: 'bottom', offset1: new Vector2(0, 25)}, view);
    const spectogram_encoder = makeUpArrow(spectogram, encoder, view, Vector2.zero, new Vector2(0, -20));
    
    const z_flow = makeRightArrow(z, flow, 50, 200, view);
    const hText_durationPredictor = makeRightArrow(hText, durationPredictor, 50, 50, view);


    const alignment_durationPredictor = makeDirectedArrow({
            f1: alignment,
            f2: durationPredictor,
            anchor1: 'right',
            anchor2: 'top',
            edge1: new Vector2(100, 0),
            edge2: new Vector2(0,-50)},
        view);

    const durationPredictor_noise = makeDirectedArrow(
        {
            f1: durationPredictor,
            f2: noise,
            anchor1: 'bottom',
            anchor2: 'top'
        },
        view
    );
});
