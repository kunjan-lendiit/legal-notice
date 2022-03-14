import { Injectable } from '@nestjs/common';
import {
  INDIA_CENTER_LAT,
  INDIA_CENTER_LONG,
  locationAddressURL,
} from '../constants/globals';
@Injectable()
export class TypeService {
  /// number add commas
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  /// number to words
  inWords(num) {
    var a = [
      '',
      'One ',
      'Two ',
      'Three ',
      'Four ',
      'Five ',
      'Six ',
      'Seven ',
      'Eight ',
      'Nine ',
      'Ten ',
      'Eleven ',
      'Twelve ',
      'Thirteen ',
      'Fourteen ',
      'Fifteen ',
      'Sixteen ',
      'Seventeen ',
      'Eighteen ',
      'Nineteen ',
    ];
    var b = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];
    if ((num = num.toString()).length > 9) return '-';
    let n: any = ('000000000' + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Million '
        : '';
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Hundred '
        : '';
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand '
        : '';
    str +=
      n[4] != 0
        ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred '
        : '';
    str +=
      n[5] != 0
        ? (str != '' ? 'and ' : '') +
          (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])
        : '';
    return str != '' ? str + 'Only' : '';
  }

  getDateFormatedWithMonthFullName(date?: any) {
    let month = [
      'January ',
      'February ',
      'March ',
      'April ',
      'May ',
      'June ',
      'July ',
      'August ',
      'September ',
      'October ',
      'November ',
      'December ',
    ];
    let today = date ? new Date(date) : new Date();
    let dd = today.getDate();
    if (dd == 1 || dd == 31) dd + 'st, ';
    else if (dd == 2 || dd == 22) dd + 'nd, ';
    else if (dd == 3 || dd == 23) dd + 'rd, ';
    else dd + 'th, ';

    let mm = today.getMonth();
    let yyyy = today.getFullYear();
    return month[mm] + dd + ', ' + yyyy;
  }

  getGlobalDate(experimentDate: Date) {
    try {
      const currentDate = new Date(experimentDate);
      currentDate.setMinutes(currentDate.getMinutes() + 330);
      const currentStatic =
        currentDate.toJSON().substr(0, 10) + 'T10:00:00.000Z';
      return new Date(currentStatic);
    } catch (error) {
      return experimentDate;
    }
  }

  unixMilisecondsToGlobalDate(unixDate: number) {
    try {
      const date: Date = new Date(unixDate);
      date.setMinutes(date.getMinutes() + 330);
      const staticDate = date.toJSON().substr(0, 10) + 'T10:00:00.000Z';
      return new Date(staticDate);
    } catch (error) {}
  }

  dateRange(startDate, endDate) {
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
      var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
      for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        var month = j + 1;
        var displayMonth = month < 10 ? '0' + month : month;
        dates.push([i, displayMonth, '01'].join('-'));
      }
    }
    return dates;
  }

  jsonToReadableDate(date: string) {
    try {
      return date.substr(8, 2) + date.substr(4, 4) + date.substr(0, 4);
    } catch (error) {
      return date;
    }
  }

  differenceInDays(nextDate: Date, currentdate: Date) {
    try {
      const difference =
        this.getGlobalDate(nextDate).getTime() -
        this.getGlobalDate(currentdate).getTime();
      const diff = Math.abs(difference);
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      return diffDays;
    } catch (error) {
      return null;
    }
  }


  addressFormat(address) {
    try {
      address = JSON.parse(address);
    } catch (error) {}
    let formatedAddress = '';
    if (address['house']) {
      const updatedHouse = this.checkAndRemoveComma(address['house']);
      formatedAddress += updatedHouse + ', ';
    }
    if (address['street']) {
      const updatedStreet = this.checkAndRemoveComma(address['street']);
      formatedAddress += updatedStreet + ', ';
    }
    if (address['landmark']) {
      const updatedLandmark = this.checkAndRemoveComma(address['landmark']);
      formatedAddress += updatedLandmark + ', ';
    }
    if (address['po']) {
      const updatedPo = this.checkAndRemoveComma(address['po']);
      formatedAddress += updatedPo + ', ';
    }
    if (address['subdist']) {
      const updatedSubdist = this.checkAndRemoveComma(address['subdist']);
      formatedAddress += updatedSubdist + ', ';
    }
    if (address['dist']) {
      const updatedDist = this.checkAndRemoveComma(address['dist']);
      formatedAddress += updatedDist + ', ';
    }
    if (address['state']) {
      const updatedState = this.checkAndRemoveComma(address['state']);
      formatedAddress += updatedState + ', ';
    }
    if (address['country']) {
      const updatedCountry = this.checkAndRemoveComma(address['country']);
      formatedAddress += updatedCountry;
    }
    return formatedAddress;
  }

  checkAndRemoveComma(string) {
    if (string.includes(',')) {
      string = string.replace(/,/g, '');
    }
    return string;
  }

  _replaceNameSomeWord(name: string) {
    const nameList = name.split(' ').filter((value) => value != '');
    try {
      for (let index = 0; index < nameList.length; index++) {
        const element = nameList[index];
        if (
          element.startsWith('miss.') ||
          element.startsWith('ms.') ||
          element.startsWith('mr.') ||
          element.startsWith('mrs.')
        )
          nameList[index] = element
            .replace('miss.', '')
            .replace('ms.', '')
            .replace('mr.', '')
            .replace('mrs.', '');
      }
    } catch (error) {}
    return nameList;
  }


  getBearingFromlatLong(lat: number, long: number) {
    const latA = this.degreesToRadians(INDIA_CENTER_LAT);
    const latB = this.degreesToRadians(lat);
    const longA = this.degreesToRadians(INDIA_CENTER_LONG);
    const longB = this.degreesToRadians(long);

    const longDifference = longB - longA;

    const y = Math.sin(longDifference) * Math.cos(latB);
    const x =
      Math.cos(latA) * Math.sin(latB) -
      Math.sin(latA) * Math.cos(latB) * Math.cos(longDifference);

    const bearing = this.radiansToDegree(Math.atan2(y, x));
    return (bearing + 360) % 360;
  }

  private degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  private radiansToDegree(radians) {
    return (radians * 180) / Math.PI;
  }

  _convertGoogleAddress(addressData) {
    try {
      if (!addressData) return '500';
      if (!addressData.geometry) return '500';
      if (!addressData.formatted_address) return '500';
      if (!addressData.address_components) return '500';
      const result = {};
      result['coordinates'] = this._convertCoordinates(addressData.geometry);
      result['addressLine'] = addressData.formatted_address;
      const addressComponents = addressData.address_components;
      for (let i = 0; i < addressComponents.length; i++) {
        try {
          const item = addressComponents[i];
          const types: Array<string> = item.types;
          if (types.includes('route')) {
            result['thoroughfare'] = item.long_name;
          } else if (types.includes('street_number')) {
            result['subThoroughfare'] = item.long_name;
          } else if (types.includes('country')) {
            result['countryName'] = item.long_name;
            result['countryCode'] = item.short_name;
          } else if (types.includes('locality')) {
            result['locality'] = item.long_name;
          } else if (types.includes('postal_code')) {
            result['postalCode'] = item.long_name;
          } else if (types.includes('postal_code')) {
            result['postalCode'] = item.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            result['adminArea'] = item.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            result['subAdminArea'] = item.long_name;
          } else if (
            types.includes('sublocality') ||
            types.includes('sublocality_level_1')
          ) {
            result['subLocality'] = item.long_name;
          } else if (types.includes('premise')) {
            result['featureName'] = item.long_name;
          }
          result['featureName'] =
            result['featureName'] ?? result['addressLine'];
        } catch (error) {}
      }
      return result;
    } catch (error) {
      return '500';
    }
  }

  _convertCoordinates(geometry) {
    if (!geometry) return null;
    const location = geometry['location'];
    if (!location) return null;
    return {
      latitude: location['lat'],
      longitude: location['lng'],
    };
  }

 
  getDateFormated(date) {
    let today: any = new Date(date);
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = dd + '-' + mm + '-' + yyyy;
    return today;
  }
  // #end Gst calculations
}

//#region  convert Date in DDMMYYYY
export function convertDateInDDMMYYYY(convertDate: string) {
  try {
    let day = convertDate.substring(8, 10);
    let month = convertDate.substring(5, 7);
    let year = convertDate.substring(0, 4);
    return day + month + year;
  } catch (error) {
    return null;
  }
}
//#endregion
