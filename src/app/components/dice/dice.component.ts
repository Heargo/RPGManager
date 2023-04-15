import { Component } from '@angular/core';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {

  diceNumber:number = 1;
  diceFaces:number = 6;
  rolls:number[] = [];

  constructor() { }

  getSum():number
  {
    return this.rolls.reduce((partialSum, a) => partialSum + a, 0);
  }

  getSize(n:number):string{
    return Math.floor(Math.log10(n)) + 1 +'ch';
  }

  getColor(n:number,max:number):string{
    //gradient from #6A8550 (max) to #7F1919 (min) depending on the value
    let min = 0;
    let percent = 1 - ((n - min) / (max - min));
    let r = Math.floor(0x6A + (0x7F - 0x6A) * percent);
    let g = Math.floor(0x85 + (0x19 - 0x85) * percent);
    let b = Math.floor(0x50 + (0x19 - 0x50) * percent);
    return `rgb(${r},${g},${b})`;
  }

  async RollAnimation()
  {
    //set the value to a random number and wait for .2s before changing it again
    for(let i=0; i < 10; i++){
      this.rolls = [Math.floor(Math.random() * this.diceFaces) + 1];
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  async onRollClick(){
    await this.RollAnimation();
    this.rolls = [];
    for(let i = 0; i < this.diceNumber; i++){
      this.rolls.push(Math.floor(Math.random() * this.diceFaces) + 1);
    }
  }

}
