import { Injectable } from '@angular/core';
import { Player } from './player.model';
import { Creature } from './creature.model';

@Injectable()
export class DeckService {
  actionCard;
  itemCardInPlay;
  swapAttackCard;
  setCards: any[]=[];
  creature: Creature;
  player: Player;
  deck: any[] = [];
  shuffleDeck: any[] = [];
  localPlayers: Player[] = [];

  constructor() { }

  //get cards from firebase
  getCards(cards: any){
    //Retrieve cards from firebase
    for(let card of cards[0][0].attackCards){
      for(let i = 1; i < 26; i++){
        this.deck.push(card);
      }
    }
    for(let card of cards[0][1].actionCards){
      for(let i = 1; i < 8; i++){
        this.deck.push(card);
      }
    }
    for(let card of cards[0][2].itemCards){
      for(let i = 1; i < 8; i++){
        this.deck.push(card);
      }
    }
    //Populate deck
    while(this.deck.length > 0){
      let i = this.deck.length;
      var randomNumber = Math.floor(Math.random() * i);
      var singleCard = this.deck[randomNumber];
      this.shuffleDeck.push(singleCard);
      this.deck.splice(this.deck.indexOf(singleCard), 1);
    }
      return this.shuffleDeck;
  }

  //set cards in play
  setCardInPlay(card: any, player: Player){
    if(this.setCards.length >= 4){
      this.setCards = [];
    }
    //set potion card
    if(card.name == "Potion Of Healing"){
      this.itemCardInPlay = card;
      player.setItemCard = card;
      player.hand.splice(player.hand.indexOf(card), 1);
    }
    //set action card
    else if(card.name == "Edge Out" || card.name == "Mixed Signal"){
      this.actionCard = card;
      alert("Select a target.");
      player.hand.splice(player.hand.indexOf(card), 1);
    }
    //set attack card
    else if(card.name == "Attack 40"){
      player.hand.splice(player.hand.indexOf(card), 1);
      player.setAttackCard = card;
      this.setCards.push(player);
    }
    else if(card.name == "Attack 25"){
      player.hand.splice(player.hand.indexOf(card), 1);
      player.setAttackCard = card;
      this.setCards.push(player);
    }
    else if(card.name == "Poke With Stick 0"){
      player.hand.splice(player.hand.indexOf(card), 1);
      player.setAttackCard = card;
      this.setCards.push(player);
    }
  }

  //get set cards
  getSetCards(){
    console.log(this.setCards);
    return this.setCards;

  }

  //DealCards
  dealCards(localPlayers){
    for(let player of localPlayers){
      for(let i=0; i<7; i++){
        player.hand.push(this.shuffleDeck[0]);
        this.shuffleDeck.splice(0, 1);
      }
    }
    return this.shuffleDeck;
  }

  discard(player){
    player.hand = ["cards"];
    for(let i=0; i<7; i++){
      player.hand.push(this.shuffleDeck[0]);
      this.shuffleDeck.splice(0, 1);
    }
    return this.shuffleDeck;
  }

  drawToMaxHand(player){
    if(player.hand.length < 8){
      for(let i=player.hand.length; i < 8; i++){
        player.hand.push(this.shuffleDeck[0]);
        this.shuffleDeck.splice(0, 1);
      }
    }
    else{
      alert("Your hand is full.");
    }
    return this.shuffleDeck;
  }

  //use Action card
  useActionCards(player: Player, attackingPlayer: Player){
    player.setActionCard = this.actionCard;
    if(player.setActionCard.name == "Mixed Signal"){
      this.swapAttackCard = attackingPlayer.setAttackCard;
      attackingPlayer.setAttackCard = player.setAttackCard;

      player.setAttackCard = this.swapAttackCard;
    }
    // else if(player.setActionCard.name == "Edge Out"){
    //   player.setAttackCard = null;
    //   this.setCards.splice(this.setCards.indexOf(player), 1);
    // }

  }

  //use Potion card
  usePotion(player: Player, selectedPlayer: Player) {
    if(player.hp >= 100) {
      alert("This character's HP is full!");
    }
    else if (player.hp <= 0) {
      alert("This player is super dead!");
    }
    else {
      player.hp += 25;
      if(player.hp > 100) {
        player.hp = 100;
        if(player != selectedPlayer){
          selectedPlayer.prestige += 3;
        }
      }
      selectedPlayer.setItemCard = null;
    }
  }

}
