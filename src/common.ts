import { Line, LineProps } from "@motion-canvas/2d/lib/components";
import { SignalValue } from "@motion-canvas/core/lib/signals";
import { PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import { Reference } from "@motion-canvas/core/lib/utils";

export const encoderColor = '#ff4908';
export const latentColor = 'green';
export const decoderColor = '#225689';
export const transparent = '#00000000';
export const lineWidth = 3;
export const lineColor = "white";
export const textColor = "white";
export const arrowSize = 8;

export function createArrow(points: SignalValue<SignalValue<PossibleVector2>[]>){
    return new Line({
        points: points,
        lineWidth: lineWidth,
        stroke: lineColor,
        arrowSize: arrowSize,
        endArrow: true,
    });
}

export function trapez(width: number, height: number, innerDelta: number = 10, loneProps: LineProps = {}) {
    return new Line(
        {
            closed: true,
            points:[new Vector2(-width / 2 + innerDelta, 0), new Vector2(width / 2 - innerDelta, 0), new Vector2(width / 2, height), new Vector2(-width / 2, height)],
            lineWidth:lineWidth,
            ...loneProps,
        }
    );
}