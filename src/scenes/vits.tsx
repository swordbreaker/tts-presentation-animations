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
        <Rect>
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
        </Rect>
    )
}

function createDurationCalculation(colors = ['red', 'blue', 'green']){
    const heigth = 100;
    const w1 = 62;
    const w2 = 22;
    const marginTop = -52;
    const marginBottom = -50;

    let textProp = {
        fill: common.textColor,
        layout: false
    } as TextProps;

    let line1 = <Line points={[new Vector2(20, heigth/2), new Vector2(-w1/2, -heigth/2), new Vector2(w1/2, -heigth/2)]} fill={colors[0]} stroke={common.lineColor} marginBottom={marginBottom} marginTop={marginTop} marginRight={18} opacity={0.6} closed/>
    let line2 = <Line points={[new Vector2(-15, heigth/2), new Vector2(-w1/2, -heigth/2), new Vector2(w1/2, -heigth/2)]} fill={colors[1]} stroke={common.lineColor} marginBottom={marginBottom} marginTop={marginTop} marginRight={0} opacity={0.6} closed/>
    let line3 = <Line points={[new Vector2(-30, heigth/2), new Vector2(-w2/2, -heigth/2), new Vector2(w2/2, -heigth/2)]} fill={colors[2]} stroke={common.lineColor} marginBottom={marginBottom} marginTop={marginTop} opacity={0.6} closed/>


    return <Rect>
        <Rect layout>
            {line1}
            {line2}
            {line3}
        </Rect>
        {new Text({text: '2', position: new Vector2(-54, -22), ...textProp})}
        {new Text({text: '2', position: new Vector2(15, -22),...textProp})}
        {new Text({text: '1', position: new Vector2(75, -22),...textProp})}
    </Rect> as Rect;
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
    const decoder = createCoder('decoder', 200, {rotation: 180, fill: common.decoderColor}) as Rect;

    const encoder = createCoder('posterior encoder', 380, {fill: common.encoderColor});
    const flow = createBlock('flow');
    const alignment = createMonotonicAlignment() as Rect;
    const projection = createBlock('projection');
    const textEncoder = createCoder('text encoder', 275, {fill: common.encoderColor});
    const hText = createBlocks(3);
    const durationPredictor = createBlock('stochastic duration \n        predictor');

    const spectogram = <Text fill={common.textColor}>Spectrogram</Text>;
    const cText = <Text fill={common.textColor}>Text</Text>;
    const noise = <Text fill={common.textColor}>Noise</Text>;
    const waveform = <Text fill={common.textColor}>Waveform</Text>;

    const leftRect = createRef<Rect>();
    const leftBottomSpace = <Rect height={0}/> as Rect;
    
    const muSignma = (
        <Rect justifyContent={'center'}>
            {createBlocks(3)},
            {createBlocks(3, {marginLeft: -130, marginTop: 10})},
        </Rect>
    )

    view.add(
    <Node>
    <Rect layout alignItems={'end'}>
        <Rect layout alignItems={'center'} direction={'column'} gap={50} ref={leftRect}>
            {waveform}
            {decoder}
            {z}
            {encoder}
            {spectogram}
            {leftBottomSpace}
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

    // mark gan
    const markSignal = createSignal(0);
    let gan_rect = <Rect
        width={() => decoder.size().width + 40}
        height={() => decoder.size().height + 40}
        stroke="green"
        lineWidth={3}
        opacity={markSignal}/> as Rect;
    view.add(gan_rect);
    gan_rect.absolutePosition(() => decoder.absolutePosition());
    let gan_text = new Text({text: 'GAN', fill: 'green', opacity: markSignal})
        .absolutePosition(() => gan_rect.absolutePosition().add(new Vector2(-200, 0)));
    view.add(gan_text);


    // mark vae
    let root = view.children()[0];
    let vae_rect = <Rect
        width={() => root.cacheRect().size.width + 100}
        height={() => root.cacheRect().size.height + 20}
        stroke="yellow"
        lineWidth={3}
        opacity={markSignal}/> as Rect;
    view.add(vae_rect);
    let text = new Text({
        text: 'CVAE',
        fill: 'yellow',
        opacity: markSignal,
        position: new Vector2(-890, 0)});
    view.add(text);

    yield * markSignal(1, 1);
    yield * markSignal(0, 0);

    // convert to inference
    yield * all(
        durationPredictor_noise.opacity(0, 1),
        alignment_durationPredictor.opacity(0, 1),
        fz_alignment.opacity(0, 1),
        flow_fz.opacity(0, 1),
        z_flow.opacity(0, 1),
        spectogram.opacity(0, 1),
        spectogram_encoder.opacity(0, 1),
        encoder.opacity(0, 1),
        encoder_z.opacity(0, 1),
        muSignma_alignment.opacity(0, 1));

    yield * leftBottomSpace.size(new Vector2(0, 450), 1);
    const flow_z = makeDirectedArrow({f1: flow, f2: z, anchor1: 'left', anchor2: 'right', edge1: new Vector2(-50, 0), edge2: new Vector2(50, 0)}, view).opacity(0);
    // const alignment_fz = makeUpArrow(alignment, fz, view).opacity(0);
    const fz_flow_fz = makeUpArrow(fz, flow, view).opacity(0);
    const durationPre_alignment = makeDirectedArrow({f1: durationPredictor, f2: alignment, anchor1: 'top', edge1: new Vector2(0, -100), edge2: new Vector2(100, 0)}, view);
    const noise_durationPredictor = makeUpArrow(noise, durationPredictor, view);

    yield * all(
        flow_z.opacity(1, 1),
        fz_flow_fz.opacity(1, 1));
    
    yield * alignment.opacity(0, 1);
    const alignmentSize = alignment.size();
    alignment.removeChildren();
    let fillRect = new Rect({});
    let durationCalculation = createDurationCalculation();
    alignment.add(fillRect);
    fillRect.size(alignmentSize);
    yield * fillRect.size(alignmentSize.addY(-210).addX(-80), 1);
    alignment.removeChildren();
    alignment.add(durationCalculation);
    yield * alignment.opacity(1, 1);
});
