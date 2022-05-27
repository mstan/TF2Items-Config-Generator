# About

This applications works to build the tf2items.weapons.txt that is used in the [Gamemaster's Alternative Fortress](https://github.com/mstan/alternative_fortress) Team Fortress 2 project.

It works by using all of the files located in the /src directory, compiling together weapon templates and being able to apply them across many weapon variants for the respective player.


## How to install
NodeJS must first be installed on your computer

1. Clone this repository  
1. Enter the working directory of this project once cloned  
1. Run `npm install`  inside the working directory  
1. Run either `npm run build` or `node generate.js`.  

## How to configure

The /src directory will contain a folder for each player. For example, `src/gamemaster` contains a directory for the player Gamemaster. 

For items that should apply to all players, "global" should be used. 

All player directories should contain a JSON file named "player.json" within their respective directories. This JSON must contain the following information: The `name` of the player, the `steamID` of the player, and the `items` of the player. Below is an example of a `player.json` file for the player "Gamemaster"

`name`: Arbitrary. Can be any nickname or unique identifier to help identify the player  
`steamID`: Must be the Steam ID of the player. For "global", this is a special ID that is a single asterisk *  
`items`: Is an array of JSON object keys, each containing an array of objects that contain a `name` and an `id`. Templates will be applied to every id provided in this array.  
	`items[key]`: the "key" (e.g. "wrench"). Arbtirary, but this MUST match the exact name of the config file located in the same directory. For example, For user Gamemaster, a "wrench" key is provided under items, and matches the file by the name of "wrench.txt" under the directory "gamemaster".  
	`items.name`: Arbitrary. Can be any nickname or unique identifier to help identify the weapon. It is recommended that the name be the name of weapon as it is found in-game.  
	`items.id`: Must be the items_game.txt index value of the item being modified. For example, to modify the stock (gray) wrench for Engineer, item index 7 must be passed. If a template file wants to be applied globally to all items   

```
{
	"name": "Gamemaster", 
	"steamID": "STEAM_0:0:27384306",
	"items": {
		"brown_bomber": [
			{ "name": "Brown Bomber", "id": "671" }
		],
		"saxton_hale": [
			{ "name": "Saxton Hale", "id": 277 }
		],
		"shotgun": [
			{ "name": "Engineer Shotgun", "id": 7 },
			{ "name": "Upgradeable Shotgun", "id": 199 }
		],
		"support_spurs": [
			{ "name": "Support Spurs", "id": "30629" }
		],
		"wrench": [
			{ "name": "Stock Wrench", "id": 7 },
			{ "name": "Upgradeable Wrench", "id": 197 }
		]
	} 
}
```

Example of a template file using `wrench.txt` as an example:
It must follow the exact conventions outlined in [asherkin's TF2Items manager](https://github.com/asherkin/TF2Items/blob/master/tf2items.weapons.example.txt).

The file must contain an opening bracket and a closing bracket. A header (e.g. `"7"`) must NOT be specified.

```
{
    "preserve-attributes"   "1"
    "quality"               "7"
    "1"                     "134    ;   4"      // unusual effect, community sparkle
    "2"                     "370    ;   703"    // unusual effect, cool
    "3"                     "150    ;   1"      // turn to gold
    "4"                     "542    ;   1"      // item style override, australium
    "5"                     "2053   ;   1"      // is festivized
    "6"                     "2025   ;   1"      // is australium
    "7"                     "2014   ;   6"      // villianous violet sheen
    "8"                     "2013   ;   2003"   // cerebral discharge 
    "9"                     "2025   ;   3"      // professional killstreak active
}
```