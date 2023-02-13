import { StrokesModel } from "controllerLayer/usecaseLayer/entityLayer";
import { LatLng } from "types/LatLng";
import { Lie } from "types/Lie";
import { StrokeModel } from "controllerLayer/usecaseLayer/entityLayer/Strokes/StrokesModel";

export class Stroke implements StrokeModel {
  public preceedingShot: Stroke | undefined;
  public club: string | undefined;
  public lie: Lie | undefined;
  public shotPos: LatLng | undefined;
  public intendedPos: LatLng | undefined;

  constructor() {}
}

export class Strokes implements StrokesModel {
  protected strokes: Stroke[];
  protected teePos: LatLng | undefined;

  constructor() {
    this.strokes = [];
  }

  public setTeePos(pos: LatLng) {
    this.teePos = pos;
    if (this.strokes.length >= 1) {
      this.strokes[0].distance = 100; // fixme
    }
  }

  public setStrokeShotPos(strokeNum: number, pos: LatLng) {
    this.strokes[strokeNum - 1].shotPos = pos;
    if (this.strokes.length >= strokeNum) {
      this.strokes[strokeNum].preceedingShot = this.strokes[strokeNum - 1];
    }
  }
}
