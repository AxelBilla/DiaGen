const ReducedMode = false;

export class Chapter{
  constructor(name, locations={}){
    this.name=name;
    this.locations=locations;
  }

  addLocation(location){
    if(ReducedMode){
      this.locations[location.name] = location.characters;
    } else {
      this.locations[location.name] = location;
    }
  }
}

export class Location{
  constructor(name, characters={}){
    this.name=name;
    this.characters=characters;
  }

  addCharacter(character){
    if(ReducedMode){
      this.characters[character.name] = character.moods;
    } else {
      this.characters[character.name] = character;
    }
  }
}

export class Character{
  constructor(name, moods={}){
    this.name=name;
    this.moods=moods;
  }
  
  addMood(mood){
    if(ReducedMode){
      this.moods[mood.name] = mood.dialogues;
    } else {
      this.moods[mood.name] = mood;
    }
  }
}

export class Mood{
  constructor(name){
    this.name=name;
    this.dialogues={};
  }

  addDialogue(name, content){
    this.dialogues[name] = content;
  }
}