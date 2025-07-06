import {Chapter, Location, Character, State, Dialogue, Choice, Option, Next} from "./diaGen_class.js" // Chapter -> Location -> Character -> State -> Dialogue

import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();

if (!fs.existsSync(__dirname+"/dia_output/")){
    fs.mkdirSync(__dirname+"/dia_output/"); // Creates an output folder
}

function addDialogue(file, content){
  content = {"Chapters": content};
  if(fs.existsSync(file.path)){ // Checks if file exists
    let dialogueTree = fs.readFileSync(file.path); // Gets file content
    dialogueTree = JSON.parse(dialogueTree);
    content = mergeJSON(dialogueTree, content)
  }
  fs.writeFileSync(file.path, JSON.stringify(content), err => {}) // Writes to file

  console.log("\n\n[ Dialogue(s) successfully added! ]")
  console.log("Head over to '"+file.path+"' to see the results")
};

function mergeJSON(firstJSON, secondJSON){
  let finalJSON = firstJSON;

  for(let entry in secondJSON){

    if(firstJSON.hasOwnProperty(entry)){ // Checks if the key exists in both JSONs
      if(firstJSON[entry]!=secondJSON[entry]){ // Checks if the entries are different between both JSONs
        finalJSON[entry] = mergeJSON(firstJSON[entry], secondJSON[entry]) // Goes through recursively
      } else {
        finalJSON[entry] = secondJSON[entry];
      }
    } else {
      finalJSON[entry]=secondJSON[entry];
    }
  }

  return finalJSON;
}

function getPath(){
  console.log("\n");
  const fileName = prompt('FILE_NAME: ');
  if(isNull(fileName)) throw ""; // Throws an error to cancel

  const filePath = path.join(__dirname+"/dia_output/", fileName+".json"); // Gives an extension & creates file
  return {path: filePath, name: fileName};
}

function getContent(){
  console.log("\n[DATA]");
  let prompt_content = prompt('CHAPTER_NAME: ')
  if(isNull(prompt_content)) throw "axb";
  let contentChapter = new Chapter(prompt_content);

  prompt_content = prompt('LOCATION_NAME: ')
  if(isNull(prompt_content)) throw "axb";
  let contentLocation = new Location(prompt_content);

  prompt_content = prompt('CHARACTER_NAME: ')
  if(isNull(prompt_content)) throw "axb";
  let contentCharacter = new Character(prompt_content);

  prompt_content = prompt('STATE_NAME: ')
  if(isNull(prompt_content)) throw "axb";
  let contentState = new State(prompt_content);


  while(true){
    console.log("\n[DIALOGUES]");
    let contentName = prompt('DIALOGUE_NAME: ');
    if(isNull(contentName)) break;

    let contentText = prompt('DIALOGUE_TEXT: ');
    if(isNull(contentText)) break;

    prompt_content = prompt('{DIA_NEXT} (n/y): ')
    if(isNull(prompt_content)) throw "axb";
    
    let contentDialogue
    
    if(prompt_content != "n" && prompt_content != "N"){
      console.log("\n[1]: Dialogue ||| [2]: Choice")
      let contentNextType = prompt('DIALOGUE_NEXT_TYPE: ')
      if(isNull(contentNextType)) throw "axb";
      
      let contentNextName = prompt('DIALOGUE_NEXT_NAME: ')
      if(isNull(contentNextName)) throw "axb";
      
      contentDialogue = new Dialogue(contentName, contentText, new Next(contentNextName, contentNextType));
    } else {
      contentDialogue = new Dialogue(contentName, contentText);
    }
    

    prompt_content = prompt('{CHOICES} (n/y): ')
    if(prompt_content != "n" && prompt_content != "N"){
      console.log("\n[CHOICES]")
      let choiceName = prompt('CHOICE_NAME: ')
      if(isNull(choiceName)) throw "axb";

      let choiceContent = prompt('CHOICE_CONTENT: ')
      if(isNull(choiceContent)) throw "axb";

      console.log("\n[OPTIONS]")
      let options = []
      while(true){
        let optionName = prompt('OPTION_NAME: ')
        if(isNull(optionName)) throw "axb";

        let optionContent = prompt('OPTION_CONTENT: ')
        if(isNull(optionContent)) throw "axb";

  
        console.log("\n{OPTIONS_NEXT}\n[1]: Dialogue ||| [2]: In-Event ||| [3]: Out-Event")
        let optionNextType = prompt('OPTION_NEXT_TYPE: ')
        if(isNull(optionNextType)) throw "axb";

        if(optionNextType== "2" || optionNextType == "3"){
          let optionNextName = prompt('OPTION_NEXT_METHOD: ')
          if(isNull(optionNextName)) throw "axb";

          let optionNextDialogue = prompt('OPTION_NEXT_DIALOGUE: ')
          if(isNull(optionNextDialogue)) throw "axb";

          options.push(new Option(optionName, optionContent, new Next(optionNextName, optionNextType, optionNextDialogue)))
        } else {
          let optionNextName = prompt('OPTION_NEXT_NAME: ')
          if(isNull(optionNextName)) throw "axb";
          
          options.push(new Option(optionName, optionContent, new Next(optionNextName, optionNextType, optionNextName)))
        }
        
        prompt_content = prompt('[|ANOTHER OPTION|] (n/y): ')
        console.log();
        if(prompt_content == "n" || prompt_content == "N") break; 
      }
      contentDialogue.addChoice(new Choice(choiceName, choiceContent, options))
    }; 
    contentState.addDialogue(contentDialogue);
    prompt_content = prompt('[|ANOTHER DIALOGUE|] (n/y): ')
    if(prompt_content == "n" || prompt_content == "N") break; 
  }

  contentCharacter.addState(contentState);
  contentLocation.addCharacter(contentCharacter);
  contentChapter.addLocation(contentLocation);

  let chapters = {} // Wrapper for all chapters
  chapters[contentChapter.name]=contentChapter;
  return chapters;
}

function isNull(object){
  if(object == null || object == undefined){
    return true;
  }
}

// Auto exec
addDialogue(getPath(), getContent());