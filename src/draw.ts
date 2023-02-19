import { SignalValue } from "@motion-canvas/core/lib/signals";
import {
    Circle,
    Layout,
    Line,
    Rect,
    Node,
    View2D,
    Text,
    RectProps,
    TextProps,
    Image,
    CircleProps,
    LineProps,
} from "@motion-canvas/2d/lib/components";
import { PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types/Vector";
import * as common from "./common";
import { range } from "@motion-canvas/core/lib/utils";

export type AnchorDirection = "left" | "right" | "bottom" | "top";

export type DirectedArrowProps = {
    f1: Node;
    f2: Node;
    anchor1?: AnchorDirection;
    anchor2?: AnchorDirection;
    edge1?: Vector2;
    edge2?: Vector2;
    offset1?: Vector2;
    offset2?: Vector2;
};

export type PartialDirectedArrowProps = {
    f1?: Node;
    f2?: Node;
    anchor1?: AnchorDirection;
    anchor2?: AnchorDirection;
    edge1?: Vector2;
    edge2?: Vector2;
    offset1?: Vector2;
    offset2?: Vector2;
};

export class Drawer {
    fillColor = "#038f61";
    strokeColor = common.lineColor;
    container: View2D | Node;
    defaultTextProps = {fill: common.textColor} as TextProps;

    constructor(container: View2D | Node) {
        this.container = container;
    }

    createBlock(text: SignalValue<string>, rectProps: RectProps = {}, textProps: TextProps = {}) {
        return new Rect({
            children: [new Text({ text: text, ...textProps, textWrap: "pre", fill: common.textColor })],
            justifyContent: "center",
            alignItems: "center",
            stroke: this.strokeColor,
            fill: this.fillColor,
            lineWidth: common.lineWidth,
            radius: 5,
            padding: 10,
            ...rectProps,
        });
    }

    createBlocks(n: number, rectProps: RectProps = {}, colors = ["red", "blue", "green"]) {
        return new Rect({
            layout: true,
            justifyContent: "center",
            padding: 10,
            gap: 20,
            children: range(n).map(
                (i) =>
                    new Rect({
                        width: 20,
                        height: 40,
                        fill: colors[i],
                        stroke: this.strokeColor,
                        lineWidth: common.lineWidth,
                    }),
            ),
            ...rectProps,
        });
    }

    createCircle(inputProps: {text: string, width: number, textOffset?: Vector2, rectProps?: RectProps, circleProps?: CircleProps, textProps?: TextProps}) {
        inputProps = {
            textOffset: new Vector2(0, 50),
            rectProps: {},
            circleProps: {},
            textProps: {},
            ...inputProps}
            inputProps.textProps = { text: inputProps.text, layout: false, fill: common.textColor, ...inputProps.textProps };

            inputProps.circleProps = {
            width: inputProps.width,
            height: inputProps.width,
            fill: this.fillColor,
            stroke: this.strokeColor,
            lineWidth: common.lineWidth,
            ...inputProps.circleProps,
        };

        const circle = new Circle(inputProps.circleProps);
        const textNode = new Text(inputProps.textProps);
        let container = new Rect({children: [circle, textNode], offset: [0, -0.75], ...inputProps.rectProps});
        textNode.position(() => circle.position().add(inputProps.textOffset));
        return container;
    }

    makeUpArrow(
        f1: Node,
        f2: Node,
        view: View2D | Node = this.container,
        offset1 = Vector2.zero,
        offset2 = Vector2.zero,
    ) {
        return this.makeDirectedArrow(
            { f1: f1, f2: f2, anchor1: "top", anchor2: "bottom", offset1: offset1, offset2: offset2 },
            view,
        );
    }

    makeDownArrow(f1: Node, f2: Node, container: View2D | Node = this.container) {
        return this.makeDirectedArrow({ f1: f1, f2: f2, anchor1: "bottom", anchor2: "top" }, container);
    }

    makeRightArrow(f1: Node, f2: Node, directedArrowProps: PartialDirectedArrowProps = {}, view: View2D | Node = this.container) {
        return this.makeDirectedArrow(
            { f1: f1, f2: f2, anchor1: "right", anchor2: "left", ...directedArrowProps },
            view,
        );
    }

    makeLefttArrow(f1: Node, f2: Node, view: View2D | Node = this.container, directedArrowProps: PartialDirectedArrowProps) {
        return this.makeDirectedArrow(
            { f1: f1, f2: f2, anchor1: "left", anchor2: "right", ...directedArrowProps },
            view,
        );
    }

    makeDirectedArrow(props: DirectedArrowProps, view: View2D | Node = this.container) {
        function getAnchor(node: Node, direction: "left" | "right" | "bottom" | "top") {
            switch (direction) {
                case "left":
                    return new Vector2(node.cacheRect().left, 0);
                case "right":
                    return new Vector2(node.cacheRect().right, 0);
                case "bottom":
                    return new Vector2(0, node.cacheRect().bottom);
                case "top":
                    return new Vector2(0, node.cacheRect().top);
            }
        }

        props = {
            anchor1: "right",
            anchor2: "right",
            edge1: Vector2.zero,
            edge2: Vector2.zero,
            offset1: Vector2.zero,
            offset2: Vector2.zero,
            ...props,
        };

        return this.makeArrow(() => {
            let start = props.f1.absolutePosition().add(getAnchor(props.f1, props.anchor1)).add(props.offset1);
            let end = props.f2.absolutePosition().add(getAnchor(props.f2, props.anchor2)).add(props.offset2);
            let points = [start];

            if (props.edge1 != Vector2.zero) {
                points.push(start.add(props.edge1));
            }
            if (props.edge2 != Vector2.zero) {
                points.push(end.add(props.edge2));
            }

            points.push(end);
            return points;
        }, view);
    }

    makeArrow(points: SignalValue<SignalValue<PossibleVector2>[]>, container: View2D | Node = this.container) {
        let l = new Line({
            points: points,
            lineWidth: common.lineWidth,
            stroke: this.strokeColor,
            endArrow: true,
            arrowSize: common.arrowSize,
        });

        if (container instanceof View2D) {
            container.add(l);
        } else {
            container.children().push(l);
        }
        l.absolutePosition(Vector2.zero);
        return l;
    }
}
