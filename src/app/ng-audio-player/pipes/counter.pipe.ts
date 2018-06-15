import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'counter'
})
export class CounterPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let hours = Math.floor(value / (60 * 60));
    let minutes = Math.floor(value % (60 * 60) / 60);
    let seconds = Math.floor(value % (60 * 60) % 60);

    let time = '';

    if (hours) {
      time = hours + ':';
    }

    time += (minutes > 9 ? minutes : '0' + minutes) + ':';
    time += seconds > 9 ? seconds : '0' + seconds;

    return time;
  }
}
