# Dia Gen

Tool made to ease the creation of dialogues, strictly for personal use.


## JSON STRUCTURE

[CHAPTERS]
-> [CHAPTER_NAME]
-> [LOcATIONS]
    -> [LOCATION_NAME]
    -> [CHARACTERS]
        -> [CHARACTER_NAME]
        -> [STATES]
            -> [STATE_NAME]
            -> [DIALOGUES]
                -> [DIALOGUE_NAME]
                -> [CONTENT]
                -> [CHOICES]
                    -> [CHOICE_NAME]
                    -> [OPTIONS]
                        -> [OPTION_NAME]
                        -> [CONTENT]
                        -> [NEXT]
                            -> [TARGET_NAME] (DIALOGUE_NAME or name of method to execute)
                            -> [TARGET_TYPE] (1 = Dialogue; 2/3 = Method)
                            -> [TARGET_DIALOGUE] (DIALOGUE_NAME, only if TARGET_TYPE is NOT "1")
                -> [NEXT]
                    -> [TARGET_NAME] (DIALOGUE_NAME or name of method to execute)
                    -> [TARGET_TYPE] (1 = Dialogue; 2/3 = Method)
                    -> [TARGET_DIALOGUE] (DIALOGUE_NAME, only if TARGET_TYPE is NOT "1")
