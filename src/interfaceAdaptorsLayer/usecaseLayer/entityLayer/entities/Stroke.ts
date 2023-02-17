import { LatLng } from "types/LatLng";
import { Lie } from "types/Lie";

export class Stroke {  
  public club: string | undefined;
  public lie: Lie | undefined;
  public shotPos: LatLng | undefined;
  public intendedPos: LatLng | undefined;

  constructor(factoryProps: { 
    club?: string,
    lie?: Lie,
    shotPos?: LatLng,
    intendedPos?: LatLng,
  }) {
    this.club = factoryProps.club;
    this.lie = factoryProps.lie;
    this.shotPos = factoryProps.shotPos;
    this.intendedPos = factoryProps.intendedPos;
  }
}
