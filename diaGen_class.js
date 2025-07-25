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
      this.characters[character.name] = character.states;
    } else {
      this.characters[character.name] = character;
    }
  }
}

export class Character{
  constructor(name, states={}){
    this.name=name;
    this.states=states;
  }
  
  addState(state){
    if(ReducedMode){
      this.states[state.name] = state.dialogues;
    } else {
      this.states[state.name] = state;
    }
  }
}

export class State{
  constructor(name){
    this.name=name;
    this.dialogues={};
  }

  addDialogue(dialogue){
      this.dialogues[dialogue.name] = dialogue;
  }
}

export class Dialogue{
  constructor(name, content, next){
    this.name=name;
    this.content=content;
    this.choices={};
    this.next=next;
  }

  addChoice(choice){
      this.choices[choice.name] = choice;
  }

}

export class Choice{
  constructor(name, content, options){
    this.name=name;
    this.content=content;
    this.options=options;
  }
}

export class Option{
  constructor(name, content, next){
    this.name=name;
    this.content=content;
    this.next=next;
  }
}

export class Next{
  constructor(name, type, dialogue_step, parent_class, parameters={}){
    this.name=name;
    this.type=type;
    this.dialogue_step=dialogue_step;
    this.class = parent_class;
    this.parameters=parameters;
  }
  addParameter(parameter){
    this.parameters[parameter.position] = parameter;
  }
}



// QUESTS

export class Quest{
  constructor(name, header, content, steps=[], next){
    this.name=name;
    this.header=header;
    this.content=content;
    this.isCompleted = false;
    this.steps=steps;
    this.next=next;
  }

  addStep(step){
      this.steps.push(step);
  }

  orderSteps(){
    this.steps.sort((a,b)=>{return a.id-b.id})
  }
}
export class Step{
  constructor(id, name, header, content, next){
    this.id=id;
    this.name=name;
    this.header=header;
    this.content=content;
    this.isCompleted = false;
    this.next=next;
  }
}

export class Parameter{
  constructor(position, type, value){
    this.value = value;
    this.type = type;
    this.position = position;
  }
}