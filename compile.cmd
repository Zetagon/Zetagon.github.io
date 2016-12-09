SETLOCAL ENABLEEXTENSIONS
SET "srcpath=src/glossary/globals.js "
SET "srcpath=%srcpath%src/glossary/smaller_functions.js "
SET "srcpath=%srcpath%src/glossary/Word.js "
SET "srcpath=%srcpath%src/glossary/functions/GetWordListFromServer.js "
SET "srcpath=%srcpath%src/glossary/functions/HandleInput.js "
SET "srcpath=%srcpath%src/glossary/functions/LoadMenu.js "
SET "srcpath=%srcpath%src/glossary/functions/NewWord.js "
SET "srcpath=%srcpath%src/glossary/functions/ReverseButtonPressed.js "
SET "srcpath=%srcpath%src/glossary/functions/StartGlossary.js "

java -jar closure-compiler/compiler.jar --js %srcpath% --js_output_file bin/script-glossary-compiled.js