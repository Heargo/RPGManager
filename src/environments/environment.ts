export const environment = {
	//This file is generated
	//GENERAL (the actual values are in the .env file since they are the only ones that are "secret")
	API_URL : process.env['NG_APP_API_URL'] ? process.env['NG_APP_API_URL'] :'https://example.com/v1',
	PROJECT_ID : process.env['NG_APP_PROJECT_ID'] ? process.env['NG_APP_PROJECT_ID'] :'example_project_id',
	DATABASE_ID : process.env['NG_APP_DATABASE_ID'] ? process.env['NG_APP_DATABASE_ID'] :'example_database_id',

	CONTACT_KEY : process.env['NG_APP_CONTACT_KEY'] ? process.env['NG_APP_CONTACT_KEY'] :'example_contact_key',

	//COLLECTIONS
	GAME_COLLECTION_ID : "Game",
	PLAYER_COLLECTION_ID : "Player",
	ATTRIBUTE_COLLECTION_ID : "Attribute",
	ITEM_COLLECTION_ID : "Item",
	PLAYERATTRIBUTES_COLLECTION_ID : "PlayerAttributes",
	PLAYERITEMS_COLLECTION_ID : "PlayerItems",
	ITEMATTRIBUTES_COLLECTION_ID : "ItemAttributes",

	//STORAGE
	MAPS_STORAGE_ID : "Maps",
	ITEMS_STORAGE_ID : "Items",
	PROFILES_STORAGE_ID : "Profiles",
	GAMEPREVIEWS_STORAGE_ID : "GamePreviews",
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
