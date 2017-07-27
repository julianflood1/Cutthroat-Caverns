import { Injectable } from '@angular/core';
import { Creature } from './creature.model';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { Player } from './player.model';
import { BeginPhaseService } from './begin-phase.service';

@Injectable()
export class CreatureListService {
  creatures: FirebaseListObservable<any[]>;
  creature;
  localPlayers: Player[] = [];

  constructor(private firebase: AngularFireDatabase, private beginPhase: BeginPhaseService) {
    this.creatures = firebase.list('3')
  }

  getCreatures(){
    return this.creatures;
  }

  killCreatures(listPlayers: any[], encounterDeck: Creature[], localPlayers: Player[]){
    for(let i=1; i<encounterDeck.length; i++){
      this.creature = encounterDeck[0];
      if(encounterDeck[i].hp[1] > 0 && encounterDeck[i-1].hp[1] <= 0)
      {
        this.creature = encounterDeck[i];
      }
      if(this.creature.name == "RIPPER")
      {
        this.ripper(listPlayers, this.creature, localPlayers);
        if(this.creature.hp[1] <= 0){
          alert("Ready for the next battle!");
          return encounterDeck[i];
        }
        else{
          return this.creature;
        }
      }
      else if(this.creature.name == "ANTI-PALADIN"){
        this.antiPaladin(listPlayers, this.creature, localPlayers);
        return this.creature;
      }
    }
  }
  //do damage to creature
  doDamage(listPlayers, creature){
    for(let i=1; i<5; i++){
      for(let player of listPlayers){
        if(player.initiative == i){
          if(creature.hp[1] > 0){
            if(player.setAttackCard.name == "Attack 100"){
              creature.hp[1] -= 100;
              this.checkHP(player, creature);
            }
            else if(player.setAttackCard.name == "Attack 50"){
              creature.hp[1] -= 50;
              this.checkHP(player, creature);
            }
            else if(player.setAttackCard.name == "Attack 40"){
              creature.hp[1] -= 40;
              this.checkHP(player, creature);
            }
            else if(player.setAttackCard.name == "Attack 30"){
              creature.hp[1] -= 30;
              this.checkHP(player, creature);
            }
            else if(player.setAttackCard.name == "Attack 25"){
              creature.hp[1] -= 25;
              this.checkHP(player, creature);
            }
            else if(player.setAttackCard.name == "Attack 20"){
              creature.hp[1] -= 20;
              this.checkHP(player, creature);
            }
            else if(player.setAttackCard.name == "Attack 10"){
              creature.hp[1] -= 10;
              this.checkHP(player, creature);
            }
            else if(player.setAttackCard.name == "Attack 5"){
              creature.hp[1] -= 5;
              this.checkHP(player, creature);
            }
            else if(player.setAttackCard.name == "Poke With Stick 0"){
              creature.hp[1] = creature.hp[1];
              this.checkHP(player, creature);
            }
          }
        }
      }
    }
  }
  //Checks if creature is dead
  checkHP(player, creature) {
    if(creature.hp[1] <= 0 ){
      player.prestige += creature.prestige;
      creature.hp[1] = 0;
    }
  }
  //RIPPER functionality
  ripper(listPlayers, creature, localPlayers){
    console.log(listPlayers);
    this.doDamage(listPlayers, creature);

    this.beginPhase.getInitiative(localPlayers);
    for(let player of localPlayers) {
      if(creature.hp[1] > 0){
        if(player.initiative == 2)  {
          player.hp -= 15;
          let randomCard = Math.floor(Math.random() * player.hand.length);
          player.hand.splice(randomCard, 1)
        }
      }
    }
  }
  //ANTI-PALADIN functionality
  antiPaladin(listPlayers, creature, localPlayers){
    console.log(creature);
    this.doDamage(listPlayers, creature);
    this.beginPhase.getInitiative(localPlayers);
    for(let player of localPlayers) {
      if(creature.hp[1] > 0){
        player.hp -= 5;
        creature.hp[1] += 5;
      }
    }
  }
}
