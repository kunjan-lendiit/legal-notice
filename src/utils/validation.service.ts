import { Injectable } from '@nestjs/common';
import { TypeService } from './type.service';

@Injectable()
export class ValidationService {
  constructor(private readonly typeService: TypeService) { }
  compareName(name1: string, name2: string): boolean {
    try {
      const nameA = name1.toLowerCase();
      const nameB = name2.toLowerCase();
      const spansA = this.typeService._replaceNameSomeWord(nameA);
      const spansB = this.typeService._replaceNameSomeWord(nameB);
      spansA.sort((a, b) => {
        return a > b ? 1 : -1;
      });
      spansB.sort((a, b) => {
        return a > b ? 1 : -1;
      });
      if (spansA.toString() == spansB.toString()) return true;
      if (
        spansA.length === 1 &&
        spansB.length === 2 &&
        spansB.includes(spansA[0])
      )
        return true;
      else if (
        spansB.length === 1 &&
        spansA.length === 2 &&
        spansA.includes(spansB[0])
      )
        return true;
      let matchedCountA = 0;
      let matchedCountB = 0;
      matchedCountA = this._compareNameCount(spansA, spansB);
      matchedCountB = this._compareNameCount(spansB, spansA);
      const probabilityA = matchedCountA / spansA.length;
      const probabilityB = matchedCountB / spansB.length;
      if (
        probabilityA > 0.6 &&
        probabilityB > 0.6 &&
        (spansA.length < 3 || probabilityA > 0.8) &&
        (spansB.length < 3 || probabilityB > 0.8)
      )
        return true;
      else if (
        (probabilityA == 1 || probabilityB == 1) &&
        matchedCountA == matchedCountB
      )
        return true;
      return false;
    } catch (error) {
      return false;
    }
  }

  _compareNameCount(spansA: string[], spansB: string[]) {
    let matchedCount = 0;
    try {
      spansA.forEach((elementA) => {
        for (let index = 0; index < spansB.length; index++) {
          const elementB = spansB[index];
          if (elementA == elementB) {
            matchedCount++;
            break;
          } else if (elementA.startsWith(elementB)) {
            matchedCount++;
            break;
          } else if (
            (elementA.includes(elementB) || elementB.includes(elementA)) &&
            spansA.length > 1 &&
            spansB.length > 1
          ) {
            if (elementB.startsWith(elementA)) {
              matchedCount++;
              break;
            }
          }
        }
      });
    } catch (error) { }
    return matchedCount;
  }
}
