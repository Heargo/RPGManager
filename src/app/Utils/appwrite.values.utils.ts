//export api url and project id 
export const API_URL = 'https://appwrite.vps.heargo.dev/v1';
export const PROJECT_ID = '64245af1ebbd1755d53b';

export const DATABASE_ID = '642473470c82a9f670f4';

//database
export const GAMES_COLLECTION_ID = '6424734d045e68e643b9';
export const ATTRIBUTES_COLLECTION_ID = '6424794eec33fda3375c';
export const PLAYERS_COLLECTION_ID = '642477f19ed096294827';

//storage
export const GAMES_PREVIEWS_ID = '642da7a3cab17dd1a4d8';
export const PROFILES_ID = '6424769b1baa624b77a7';

//default files
export const DEFAULT_CHARACTER_PORTRAIT_ID = '6434883e4747444703d3';
export const DEFAULT_GAME_PREVIEW = '643410ec4556ad4b1911';

//server side functions
export const enum SERVER_FUNCTIONS{
    joinGame = '64334bdf525fa8020b93',
    getPlayers = 'getPlayers',
    createPlayer = 'createPlayer'
}


//MAX SIZES
export const MAX_GAME_NAME_SIZE = 40;
export const MAX_FILE_SIZE = 2; // in MB
export const MAX_GAME_DESCRIPTION_SIZE = 1000;
export const MAX_GAME_ATTRIBUTE_NAME_SIZE = 40;
export const MIN_GAME_ATTRIBUTE_DEFAULTVALUE = 0;
