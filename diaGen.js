import {Chapter, Location, Character, State} from "./diaGen_class.js" // Chapter -> Location -> Character -> State -> Dialogue

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
  console.log("\n");
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
    console.log("\n");
    let contentName = prompt('[DIALOGUE_NAME]: ');
    if(isNull(contentName)) break;

    let contentText = prompt('[DIALOGUE_TEXT]: ');
    if(isNull(contentText)) break;

    contentState.addDialogue(contentName, contentText);

    prompt_content = prompt('[|ANOTHER|] (n/y): ')
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