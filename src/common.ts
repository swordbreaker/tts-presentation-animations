import { Line } from "@motion-canvas/2d/lib/components";
import { SignalValue } from "@motion-canvas/core/lib/signals";
import { PossibleVector2 } from "@motion-canvas/core/lib/types";

export const encoderColor = 'red';
export const latentColor = 'green';
export const decoderColor = 'blue';
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