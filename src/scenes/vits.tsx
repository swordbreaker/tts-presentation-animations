import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { delay, sequence, waitFor } from '@motion-canvas/core/lib/flow';
import { Circle, Layout, Line, Rect, Node, View2D, Text, RectProps, TextProps, Image, CircleProps, LineProps, Latex, LatexProps } from '@motion-canvas/2d/lib/components';
import { createRef, makeRef, range, Reference} from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';
import { createSignal, SignalValue, SimpleSignal, } from '@motion-canvas/core/lib/signals';
import { Center, Color, PossibleVector2, Vector2 } from '@motion-canvas/core/lib/types';
import * as common from '../common';
import monotonicAlignmentSrc from '../imgs/MonoticAlignment.png';
import { vector2Signal } from '@motion-canvas/2d/lib/decorators';
import { Drawer } from '../draw';

const blockColor = '#038f61';


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
    const decoder = createCoder('decoder', 220, {rotation: 180, fill: common.decoderColor}) as Rect;

    const encoder = createCoder('posterior encoder', 420, {fill: common.encoderColor});
    const flow = createBlock('flow');
    const alignment = createMonotonicAlignment() as Rect;
    const projection = createBlock('projection');
    const textEncoder = createCoder('text encoder', 350, {fill: common.encoderColor});
    const hText = createBlocks(3);
    const durationPredictor = createBlock('stochastic duration \n        predictor');

    // input & output
    const spectogram = <Text fill={common.textColor}>spectrogram</Text>;
    const cText = <Text fill={common.textColor}>text</Text>;
    const noise = <Text fill={common.textColor}>noise</Text>;
    const waveform = <Text fill={common.textColor}>waveform</Text>;

    const leftRect = createRef<Rect>();
    const leftBottomSpace = <Rect height={0}/> as Rect;

    const muSignma = (
        <Rect justifyContent={'center'}>
            {createBlocks(3)},
            {createBlocks(3, {marginLeft: -130, marginTop: 10})},
        </Rect>
    )

    const root = createRef<Node>();

    view.add(
    <Node ref={root}>
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

    const drawer = new Drawer(root());

    const meanVarText = <Latex height={30} tex="{\color{white} \mu, \sigma}"></Latex>;
    root().add(meanVarText);
    meanVarText.absolutePosition(muSignma.absolutePosition().addX(150));
    
    // arrows
    const textEncoder_hText = drawer.makeUpArrow(textEncoder, hText, root(), new Vector2(0, 25), new Vector2(0, -5));
    const hText_projection = drawer.makeUpArrow(hText, projection);
    const projection_muSignma = drawer.makeUpArrow(projection, muSignma);
    const muSignma_alignment = drawer.makeUpArrow(muSignma, alignment, root());
    const flow_fz = drawer.makeDownArrow(flow, fz, root());
    const fz_alignment = drawer.makeDownArrow(fz, alignment, root());

    const encoder_z = drawer.makeUpArrow(encoder, z, root(), new Vector2(0, 25), new Vector2(0, -5));

    const z_decoder = drawer.makeDirectedArrow({f1: z, f2: decoder, anchor1:'top', anchor2: 'bottom', offset2: new Vector2(0, -20)});
    // makeUpArrow(z, dedocer, root());

    const cText_textEncoder = drawer.makeUpArrow(cText, textEncoder, root(), new Vector2(0, 0), new Vector2(0, -20));

    const decoder_waveform = drawer.makeDirectedArrow({f1: decoder, f2: waveform, anchor1: 'top', anchor2: 'bottom', offset1: new Vector2(0, 25)}, root());
    const spectogram_encoder = drawer.makeUpArrow(spectogram, encoder, root(), Vector2.zero, new Vector2(0, -20));
    
    const z_flow = drawer.makeRightArrow(z, flow, {edge1: new Vector2(50, 0), edge2: new Vector2(-200, 0)});
    const hText_durationPredictor = drawer.makeRightArrow(hText, durationPredictor, {edge1: new Vector2(50, 0), edge2: new Vector2(-50, 0)}, root());

    const alignment_durationPredictor = drawer.makeDirectedArrow({
            f1: alignment,
            f2: durationPredictor,
            anchor1: 'right',
            anchor2: 'top',
            edge1: new Vector2(100, 0),
            edge2: new Vector2(0,-50)},
        root());

    const durationPredictor_noise = drawer.makeDirectedArrow(
        {
            f1: durationPredictor,
            f2: noise,
            anchor1: 'bottom',
            anchor2: 'top'
        },
        root()
    );

    // // mark gan
    // const markSignal = createSignal(0);
    // let gan_rect = <Rect
    //     width={() => decoder.size().width + 40}
    //     height={() => decoder.size().height + 40}
    //     stroke="green"
    //     lineWidth={3}
    //     opacity={markSignal}/> as Rect;
    // view.add(gan_rect);
    // gan_rect.absolutePosition(() => decoder.absolutePosition());
    // let gan_text = new Text({text: 'GAN', fill: 'green', opacity: markSignal})
    //     .absolutePosition(() => gan_rect.absolutePosition().add(new Vector2(-200, 0)));
    // view.add(gan_text);


    // // mark vae
    // let vae_rect = <Rect
    //     width={() => root().cacheRect().size.width + 100}
    //     height={() => root().cacheRect().size.height + 20}
    //     stroke="yellow"
    //     lineWidth={3}
    //     opacity={markSignal}/> as Rect;
    // view.add(vae_rect);
    // let text = new Text({
    //     text: 'CVAE',
    //     fill: 'yellow',
    //     opacity: markSignal,
    //     position: new Vector2(-800, 0)});
    // view.add(text);

    // yield * markSignal(1, 1);
    // yield * markSignal(0, 0);

    // show loss
    const loss = <Latex height={140} tex="{
        \color{white}
        \begin{array}{l}
        L_{vae} =& L_{recon} + L_{KL} + L_{dur}\\
        & + L_{adv}(G) + L_{fm}(G)
        \end{array}
    }" scale={0}/>;
    view.add(loss);
    loss.absolutePosition(new Vector2(1550, 100));
    yield * loss.scale(1, 1);

    // show recon loss
    const melOpacity = createSignal(0);

    const lRecon = <Latex height={60} tex="{\color{white} L_{recon} = \left\lVert x_{mel} - \hat{x}_{mel}\right\rVert_1}" scale={melOpacity}/>;
    view.add(lRecon);
    lRecon.absolutePosition(new Vector2(340, 300));

    const melHat = <Latex tex="{\color{white} \hat{x}_{mel}}" width={100} scale={melOpacity} opacity={melOpacity}/>;
    const mel = <Latex tex="{\color{white} x_{mel}}" width={100} scale={melOpacity} opacity={melOpacity}/>;
    view.add(melHat);
    view.add(mel);
    mel.absolutePosition(() => spectogram.absolutePosition().addX(-250));
    melHat.absolutePosition(() => waveform.absolutePosition().add(new Vector2(-250, -50)));
    const mel_encoder = drawer.makeDirectedArrow({
        f1: mel,
        f2: encoder,
        anchor1: 'top',
        anchor2: 'bottom',
        offset2: new Vector2(-100, -20),
        edge1: new Vector2(0, -28),
        edge2: new Vector2(2, 30)}).opacity(melOpacity);
    const wav_melHat = drawer.makeDirectedArrow({
        f1: waveform,
        f2: melHat,
        anchor1: 'top',
        anchor2: 'right',
        edge1: new Vector2(0, -20)}).opacity(melOpacity);

    yield * melOpacity(1, 1);

    yield * all(
        mel_encoder.stroke('green', 1),
        wav_melHat.stroke('green', 1),
        encoder_z.stroke('green', 1),
        z_decoder.stroke('green', 1),
        decoder_waveform.stroke('green', 1)
    );

    yield * all(
        mel_encoder.stroke('white', 1),
        wav_melHat.stroke('white', 1),
        encoder_z.stroke('white', 1),
        z_decoder.stroke('white', 1),
        decoder_waveform.stroke('white', 1),
        melOpacity(0, 1)
    );

    // show KL loss
    const klLoss = <Latex tex="{
        \color{white}
        \begin{array}{l}
        L_{KL} =& \log q_\phi(z|x_{lin}) - \\
        & \log p_\theta(z|c_{text}, A)
        \end{array}}" height={130} />;
    view.add(klLoss);
    klLoss.absolutePosition(new Vector2(300, 300)).scale(0);
    yield * klLoss.scale(1, 1);
    yield * klLoss.scale(0, 1);

    // draw GAN
    drawer.fillColor = '#ff7e33';
    const disc = drawer.createBlock("discriminator");
    disc.absolutePosition(() => decoder.absolutePosition().addX(-700))
    root().add(disc);

    yield * all(
        delay(0.6, root().position(root().position().addX(165), 0.4)),
        disc.absolutePosition(decoder.absolutePosition().addX(-170), 1)
        );

    drawer.fillColor = "#038f61";
    const gen = drawer.createBlock("generator").opacity(0);
    root().add(gen);
    gen.absolutePosition(() => decoder.absolutePosition());
    yield * gen.opacity(1, 1);
    const gen_disc = drawer.makeLefttArrow(gen, disc).opacity(0);
    const update_g = drawer.makeDirectedArrow({f1: disc, f2:gen, edge1: new Vector2(0, 25), edge2: new Vector2(0, 25), offset1: new Vector2(80, 0), offset2: new Vector2(-80, 0), anchor1: "bottom", anchor2: "bottom"}).stroke('green').lineDash([5, 5]).opacity(0);

    yield * all(
        gen_disc.opacity(1, 1),
        update_g.opacity(1, 1))

    yield * all(
        gen_disc.opacity(0, 1),
        update_g.opacity(0, 1),
        disc.opacity(0, 1),
        gen.opacity(0, 1),
        root().position(root().position().addX(-165), 0.4),
    )

    yield * loss.scale(0, 1);

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
    const flow_z = drawer.makeDirectedArrow({f1: flow, f2: z, anchor1: 'left', anchor2: 'right', edge1: new Vector2(-50, 0), edge2: new Vector2(50, 0)}, root()).opacity(0);
    // const alignment_fz = makeUpArrow(alignment, fz, root()).opacity(0);
    const fz_flow_fz = drawer.makeUpArrow(fz, flow, root()).opacity(0);
    const durationPre_alignment = drawer.makeDirectedArrow({f1: durationPredictor, f2: alignment, anchor1: 'top', edge1: new Vector2(0, -100), edge2: new Vector2(100, 0)}, root());
    const noise_durationPredictor = drawer.makeUpArrow(noise, durationPredictor, root());

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
