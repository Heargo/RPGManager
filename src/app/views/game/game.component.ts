import { Component } from '@angular/core';
import { Player } from '../../models/games';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  constructor() { }

  players:Player[] = [
      {
        id: "playerid",
        gameID: "gameid",
        ownerID: "ownerid",
        imageID: "assets/illustrations/default_character.jpg",
        name: "Character Name Here",
        money: 0.0,
        attributes: [
            {
              id:'',
              name: "life",
              baseValue: 10,
              valueAddition:20,
              value: 25,
          },
          {
            id:'',
            name: "mana",
            baseValue: 5,
            valueAddition:5,
            value: 3,
        }
        ]
    },
    {
      id: "playerid",
      gameID: "gameid",
      ownerID: "ownerid",
      imageID: "assets/illustrations/default_character.jpg",
      name: "Character Name Here 2",
      money: 0.0,
      attributes: [
        {
          id:'',
          name: "life",
          baseValue: 10,
          valueAddition:20,
          value: 25,
      },
      {
        id:'',
        name: "mana",
        baseValue: 5,
        valueAddition:5,
        value: 3,
    },
          {
            id:'',
            name: "attribute",
            baseValue: 0,
            valueAddition:5,
            value: 5,
        }
      ]
  }
  ];

}
