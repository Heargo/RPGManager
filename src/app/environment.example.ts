//export api url and project id 
export const API_URL = 'https://example.com/v1';
export const PROJECT_ID = 'XXXXX';
export const DATABASE_ID = 'XXXX';

//database
export const GAMES_COLLECTION_ID = 'XXXX';
export const ATTRIBUTES_COLLECTION_ID = 'XXXX';
export const PLAYERS_COLLECTION_ID = 'XXXX';

//storage
export const GAMES_PREVIEWS_ID = 'XXXX';
export const PROFILES_ID = 'XXXX';

//default files
export const DEFAULT_CHARACTER_PORTRAIT_ID = 'XXXX';
export const DEFAULT_GAME_PREVIEW = 'XXXX';

//server side functions
export const enum SERVER_FUNCTIONS{
    joinGame = 'joinGame',
    getPlayers = 'getPlayers',
    createPlayer = 'createPlayer',
    deletePlayer = 'deletePlayer'
}


//MAX SIZES
export const MAX_GAME_NAME_SIZE = 40;
export const MAX_FILE_SIZE = 2; // in MB
export const MAX_GAME_DESCRIPTION_SIZE = 1000;
export const MAX_GAME_ATTRIBUTE_NAME_SIZE = 40;
export const MIN_GAME_ATTRIBUTE_DEFAULTVALUE = 0;
