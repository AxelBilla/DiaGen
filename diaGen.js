import {Chapter, Location, Character, State, Dialogue, Choice, Option, Next, Quest, Step, Parameter, Language} from "./diaGen_class.js" // Chapter -> Location -> Character -> State -> Dialogue

import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { type } from "os";
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();

const output_folder = "/dia_output/"

if (!fs.existsSync(__dirname+"/"+output_folder+"/")){
    fs.mkdirSync(__dirname+"/"+output_folder+"/"); // Creates an output folder
}


class Errors{
  static EMPTY_FIELD = "[MISSING]: Field cannot be empty.\n";
  static INVALID_INT = "[INVALID]: Have you tried using a number?\n"
}

function addContent(file, content, type){
  type==1 ? content = {"Dialogues": content} : content = {"Quests": content};

  if(fs.existsSync(file.path)){ // Checks if file exists
    let contentTree = fs.readFileSync(file.path); // Gets file content
    contentTree = JSON.parse(contentTree);
    content = mergeJSON(contentTree, content)
  }
  fs.writeFileSync(file.path, JSON.stringify(content), err => {}) // Writes to file

  console.clear();

  switch (type){
    case 1:
      console.log("\n[ Dialogue(s) added successfully! ]");
      break;
    case 2:
      console.log("\n[ Quest(s) added successfully! ]");
      break;
  }
  
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

  const filePath = path.join(__dirname+"/"+output_folder+"/", fileName+".json"); // Gives an extension & creates file
  return {path: filePath, name: fileName};
}

function getContentDialogue(){
  console.log("\n[DATA]");

  let prompt_content = prompt('(LANGUAGE): ')
  if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
  let contentLanguage = new Language(prompt_content);

  prompt_content = prompt('CHAPTER_NAME: ')
  if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
  let contentChapter = new Chapter(prompt_content);

  prompt_content = prompt('LOCATION_NAME: ')
  if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
  let contentLocation = new Location(prompt_content);

  prompt_content = prompt('CHARACTER_NAME: ')
  if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
  let contentCharacter = new Character(prompt_content);

  prompt_content = prompt('STATE_NAME: ')
  if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
  let contentState = new State(prompt_content);


  while(true){
    console.clear();
    console.log("\n[DIALOGUES]");
    let contentName = prompt('DIALOGUE_NAME: ');
    if(isNull(contentName)) break;

    let contentText = prompt('DIALOGUE_TEXT: ');
    if(isNull(contentText)) break;
    

    prompt_content = prompt('{CHOICES} (n/y): ')
    let choice_temp;
    if(prompt_content != "n" && prompt_content != "N"){
      console.log("\n[CHOICES]")
      let choiceName = prompt('CHOICE_NAME: ')
      if(isNull(choiceName)) throw Errors.EMPTY_FIELD;

      let choiceContent = prompt('CHOICE_CONTENT: ')
      if(isNull(choiceContent)) throw Errors.EMPTY_FIELD;

      console.log("\n[OPTIONS]")
      let options = []

      while(true){
        let optionName = prompt('OPTION_NAME: ')
        if(isNull(optionName)) throw Errors.EMPTY_FIELD;

        let optionContent = prompt('OPTION_CONTENT: ')
        if(isNull(optionContent)) throw Errors.EMPTY_FIELD;

  
        console.log("\n{OPTIONS_NEXT}\n[1]: Dialogue ||| [2]: In-Event ||| [3]: Out-Event ||| [4]: Choice")
        let optionNextType = parseInt(prompt('OPTION_NEXT_TYPE: '), 10);
        if(isNull(optionNextType) || typeof(optionNextType)!=typeof(0)) throw Errors.INVALID_INT;

        if(optionNextType== 2 || optionNextType == 3){
          let optionNextName = prompt('OPTION_NEXT_METHOD: ')
          if(isNull(optionNextName)) throw Errors.EMPTY_FIELD;
          

          let optionNextClass = prompt("NEXT_METHOD_CLASS: ");
          if(isNull(optionNextClass)) questNextClass = null;

          let optionNextDialogue = prompt('OPTION_NEXT_DIALOGUE (opt.): ')
          if(isNull(optionNextDialogue)) optionNextDialogue = null; // from empty string to real null value

          let parameters={}

          let prompt_content = prompt("{OPTION_PARAMETERS} (n/y):");
          if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;

          if(prompt_content != "n" && prompt_content != "N"){
            while(true){
              console.log()

              let parameterPosition = parseInt(prompt('PARAMETER_POSITION: '), 10)
              if(isNull(parameterPosition) || typeof(parameterPosition)!=typeof(0) ) throw Errors.INVALID_INT;

              let parameterType = prompt('PARAMETER_TYPE: ')
              if(isNull(parameterType)) throw Errors.EMPTY_FIELD;

              let parameterValue = prompt('PARAMETER_VALUE: ')
              if(isNull(parameterValue)) throw Errors.EMPTY_FIELD;

              parameters[parameterPosition] = new Parameter(parameterPosition, parameterType, parameterValue);
              
              prompt_content = prompt('[|ANOTHER PARAMETER|] (n/y): ')
              console.log();
              if(prompt_content == "n" || prompt_content == "N") break; 
            }

            options.push(new Option(optionName, optionContent, new Next(optionNextName, optionNextType, optionNextDialogue, optionNextClass, parameters)))
          }

          let optionNext = new Next(optionNextName, optionNextType, optionNextDialogue, optionNextClass);
          delete optionNext.parameters;
          options.push(new Option(optionName, optionContent, optionNext));

        } else {
          let optionNextName = prompt('OPTION_NEXT_NAME: ')
          if(isNull(optionNextName)) throw Errors.EMPTY_FIELD;
          
          let optionNext = new Next(optionNextName, optionNextType, optionNextName);
          delete optionNext.parameters;
          options.push(new Option(optionName, optionContent, optionNext));
        }
        
        prompt_content = prompt('[|ANOTHER OPTION|] (n/y): ')
        console.log();
        if(prompt_content == "n" || prompt_content == "N") break; 
      }
      choice_temp = new Choice(choiceName, choiceContent, options)
    }; 

    prompt_content = prompt('{DIA_NEXT} (n/y): ')
    if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
    
    let contentDialogue
    
    if(prompt_content != "n" && prompt_content != "N"){

      console.log("\n[DIA_NEXT]\n[1]: Dialogue ||| [2]: In-Event ||| [3]: Out-Event")
      let contentNextType = parseInt(prompt('DIALOGUE_NEXT_TYPE: '), 10);
      if(isNull(contentNextType) || typeof(contentNextType)!=typeof(0)) throw Errors.INVALID_INT;
      
      if(contentNextType == 2 || contentNextType == 3){
        let contentNextName = prompt('DIALOGUE_NEXT_METHOD: ')
        if(isNull(contentNextName)) throw Errors.EMPTY_FIELD;

        let contentNextClass = prompt('NEXT_METHOD_CLASS (opt.): ')
        if(isNull(contentNextClass)) contentNextDialogue = null; // from empty string to real null value

        let contentNextDialogue = prompt('DIALOGUE_NEXT_DIALOGUE (opt.): ')
        if(isNull(contentNextDialogue)) contentNextDialogue = null; // from empty string to real null value
        
        let parameters={}

        let prompt_content = prompt("{NEXT_PARAMETERS} (n/y):");
        if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
        if(prompt_content != "n" && prompt_content != "N"){
          while(true){
            console.log();

            let parameterPosition = parseInt(prompt('PARAMETER_POSITION: '), 10)
            if(isNull(parameterPosition) || typeof(parameterPosition)!=typeof(0) ) throw Errors.INVALID_INT;

            let parameterType = prompt('PARAMETER_TYPE: ')
            if(isNull(parameterType)) throw Errors.EMPTY_FIELD;

            let parameterValue = prompt('PARAMETER_VALUE: ')
            if(isNull(parameterValue)) throw Errors.EMPTY_FIELD;

            parameters[parameterPosition] = new Parameter(parameterPosition, parameterType, parameterValue);
                
            prompt_content = prompt('[|ANOTHER PARAMETER|] (n/y): ')
            console.log();
            if(prompt_content == "n" || prompt_content == "N") break; 
          }
        }
      
        contentDialogue = new Dialogue(contentName, contentText, new Next(contentNextName, contentNextType, contentNextDialogue, contentNextClass, parameters));
      } 
      else {
        let contentNextName = prompt('DIALOGUE_NEXT_NAME: ')
        if(isNull(contentNextName)) throw Errors.EMPTY_FIELD;
        
        contentDialogue = new Dialogue(contentName, contentText, new Next(contentNextName, contentNextType));
      }
    } else {
      contentDialogue = new Dialogue(contentName, contentText);
    }

    if(choice_temp != null) contentDialogue.addChoice(choice_temp);

    contentState.addDialogue(contentDialogue);
    prompt_content = prompt('[|ANOTHER DIALOGUE|] (n/y): ')
    if(prompt_content == "n" || prompt_content == "N") break; 
  }

  contentCharacter.addState(contentState);
  contentLocation.addCharacter(contentCharacter);
  contentChapter.addLocation(contentLocation);
  contentLanguage.addChapter(contentChapter);
  delete contentLanguage.quests;

  let languages = {} // Wrapper for all chapters
  languages[contentLanguage.name]=contentLanguage;
  return languages;
}

function getContentQuest(){
  let quests = {} // Wrapper for all quests
  
  console.log("\n[DATA]");

  let questLanguage = prompt('(LANGUAGE): ')
  if(isNull(questLanguage)) throw Errors.EMPTY_FIELD;
  let contentLanguage = new Language(questLanguage);

  while(true){
    let contentQuest;

    let questName = prompt('QUEST_NAME: ')
    if(isNull(questName)) throw Errors.EMPTY_FIELD;
    console.log("\n[DATA]");

    let questHeader = prompt('QUEST_HEADER: ')
    if(isNull(questHeader)) throw Errors.EMPTY_FIELD;

    let questContent = prompt('QUEST_CONTENT: ')
    if(isNull(questContent)) throw Errors.EMPTY_FIELD;


    let step_list = [];
    let prompt_content;
    let stepNext;
    
    while(true){

      let contentStep;

      console.log("\n[STEPS]");
      let stepName = prompt('STEP_NAME: ');
      if(isNull(stepName)) break;

      let stepHeader = prompt('STEP_HEADER: ')
      if(isNull(stepHeader)) throw Errors.EMPTY_FIELD;

      let stepContent = prompt('STEP_CONTENT: ')
      if(isNull(stepContent)) throw Errors.EMPTY_FIELD;

      let stepID = parseInt(prompt('STEP_ID: '), 10)
      if(isNull(stepID) || typeof(stepID)!=typeof(0)) throw Errors.INVALID_INT;

      prompt_content = prompt('{STEP_NEXT} (n/y): ')
      if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
      
      if(prompt_content != "n" && prompt_content != "N"){

        console.log("\n[STEP_NEXT]\n[1]: Step ||| [2]: Quest ||| [3]: Event")
        let stepNextType = parseInt(prompt('STEP_NEXT_TYPE: '), 10);
        if(isNull(stepNextType) || typeof(stepNextType)!=typeof(0)) throw Errors.INVALID_INT;
        
        let stepNextName = prompt('STEP_NEXT_NAME: ')
        if(isNull(stepNextName)) throw Errors.EMPTY_FIELD;
        
        let stepNextClass
        let parameters={}
        
        if(stepNextType==3){

        stepNextClass = prompt('NEXT_METHOD_CLASS (opt.): ')
        if(isNull(stepNextClass)) contentNextDialogue = null; // from empty string to real null value

          let prompt_content = prompt("{NEXT_PARAMETERS} (n/y): ");
          if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
          if(prompt_content != "n" && prompt_content != "N"){
            while(true){
              console.log()

              let parameterPosition = parseInt(prompt('PARAMETER_POSITION: '), 10)
              if(isNull(parameterPosition) || typeof(parameterPosition)!=typeof(0) ) throw Errors.INVALID_INT;

              let parameterType = prompt('PARAMETER_TYPE: ')
              if(isNull(parameterType)) throw Errors.EMPTY_FIELD;

              let parameterValue = prompt('PARAMETER_VALUE: ')
              if(isNull(parameterValue)) throw Errors.EMPTY_FIELD;

              parameters[parameterPosition] = new Parameter(parameterPosition, parameterType, parameterValue);
                  
              prompt_content = prompt('[|ANOTHER PARAMETER|] (n/y): ')
              console.log();
              if(prompt_content == "n" || prompt_content == "N") break
            }

            stepNext = new Next(stepNextName, stepNextType, null, stepNextClass, parameters)
            delete stepNext.dialogue

          } else {
            stepNext = new Next(stepNextName, stepNextType, null, stepNextClass)
            delete stepNext.dialogue
            delete stepNext.parameters
          }
        } else {
          stepNext = new Next(stepNextName, stepNextType)
          delete stepNext.dialogue
          delete stepNext.method_class
          delete stepNext.parameters
        }
        contentStep = new Step(stepID, stepName, stepHeader, stepContent, stepNext);
      } else {
        contentStep = new Step(stepID, stepName, stepHeader, stepContent);
      }
      
      step_list.push(contentStep);

      console.log();
      prompt_content = prompt('[|ANOTHER STEP|] (n/y): ')
      if(prompt_content == "n" || prompt_content == "N") break; 
    }

    console.log();
    prompt_content = prompt('{QUEST_NEXT} (n/y): ')
    if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
          
    if(prompt_content != "n" && prompt_content != "N"){

      console.log("\n[QUEST_NEXT]\n[1]: Quest ||| [2]: Event")
      let questNextType = parseInt(prompt('QUEST_NEXT_TYPE: '), 10);
      if(isNull(questNextType) || typeof(questNextType)!=typeof(0)) throw Errors.INVALID_INT;
        
      let questNextName = prompt('QUEST_NEXT_NAME: ')
      if(isNull(questNextName)) throw Errors.EMPTY_FIELD;

      let questNextClass;
      let parameters={}

      if(questNextType==2){

        questNextClass = prompt("NEXT_METHOD_CLASS: ");
        if(isNull(questNextClass)) questNextClass = null;

        let prompt_content = prompt("{NEXT_PARAMETERS} (n/y):");
        if(isNull(prompt_content)) throw Errors.EMPTY_FIELD;
        if(prompt_content != "n" && prompt_content != "N"){
          while(true){
            console.log()

            let parameterPosition = parseInt(prompt('PARAMETER_POSITION: '), 10)
            if(isNull(parameterPosition) || typeof(parameterPosition)!=typeof(0) ) throw Errors.INVALID_INT;

            let parameterType = prompt('PARAMETER_TYPE: ')
            if(isNull(parameterType)) throw Errors.EMPTY_FIELD;

            let parameterValue = prompt('PARAMETER_VALUE: ')
            if(isNull(parameterValue)) throw Errors.EMPTY_FIELD;

            parameters[parameterPosition] = new Parameter(parameterPosition, parameterType, parameterValue);
                
            prompt_content = prompt('[|ANOTHER PARAMETER|] (n/y): ')
            console.log();
            if(prompt_content == "n" || prompt_content == "N") break; 
          }
        }
      }
        
      contentQuest = new Quest(questName, questHeader, questContent, step_list, new Next(questNextName, questNextType, null, questNextClass, parameters));
    } else {
      contentQuest = new Quest(questName, questHeader, questContent, step_list);
    }

    contentQuest.orderSteps();
    contentLanguage.addQuest(contentQuest);
    
    console.log();
    prompt_content = prompt('[|ANOTHER QUEST|] (n/y): ')
    if(prompt_content == "n" || prompt_content == "N") break; 
    console.clear();
  }

  let languages = {} // Wrapper for all languages
  delete contentLanguage.chapters;
  languages[contentLanguage.name]=contentLanguage;

  return languages;
}

// Checks if string is empty, number is invalid (NaN) or object is null/undefined
function isNull(object){
  if(object === null || object === undefined || object === "" || (typeof(object)===typeof(0) && isNaN(object)) ) return true;
  return false;
}

// Auto exec
console.clear();
console.log("\n------------------( Welcome to [DIA GEN] )-------------------");
console.log("\n|            https://github.com/AxelBilla/DiaGen            |");
console.log("\n|   Support me on Github!   https://github.com/AxelBilla/   |");
console.log("\n-------------------------------------------------------------\n\n");

console.log('-- What do you want to generate?\n\n[1]: Dialogues | [2]: Quests')
let getType = parseInt(prompt('TYPE: '), 10);
if(isNull(getType) || typeof(getType)!=typeof(0)) throw Errors.INVALID_INT;

switch(getType){
  case 1:
    addContent(getPath(), getContentDialogue(), getType);
    break;
  case 2:
    addContent(getPath(), getContentQuest(), getType);
    break;
}