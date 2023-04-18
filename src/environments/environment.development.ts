export const environment = {
	//This file is generated
	//GENERAL (the actual values are in the .env file since they are the only ones that are secret)
	API_URL : 'https://example.com/v1',
	PROJECT_ID : 'project_id',
	DATABASE_ID : 'database_id',

	//COLLECTIONS
	GAME_COLLECTION_ID : "Game",
	PLAYER_COLLECTION_ID : "Player",
	ATTRIBUTE_COLLECTION_ID : "Attribute",
	ITEM_COLLECTION_ID : "Item",
	PLAYERATTRIBUTES_COLLECTION_ID : "PlayerAttributes",
	PLAYERITEMS_COLLECTION_ID : "PlayerItems",
	ITEMATTRIBUTES_COLLECTION_ID : "ItemAttributes",

	//STORAGE
	MAPS_STORAGE_ID : "64247684a99da3b8a6a7",
	ITEMS_STORAGE_ID : "6424768a80ef122f265d",
	PROFILES_STORAGE_ID : "6424769b1baa624b77a7",
	GAMEPREVIEWS_STORAGE_ID : "642da7a3cab17dd1a4d8",
	GAMEILLUSTRATION_STORAGE_ID : "6439b56f1c616eec169e",

	//SERVER FUNCTIONS
	SERVER_FUNCTIONS:{
		joinTeam : "joinTeam"
	},
	//end of file

	//MAX SIZES
	MAX_GAME_NAME_SIZE : 40,
	MAX_FILE_SIZE : 2, // in MB
	MAX_GAME_DESCRIPTION_SIZE : 1000,
	MAX_GAME_ATTRIBUTE_NAME_SIZE : 40,
	MIN_GAME_ATTRIBUTE_DEFAULTVALUE : 0,

};
