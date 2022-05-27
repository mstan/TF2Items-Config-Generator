const fs = require('fs-extra');
const path = require('path');
const debug = require('debug')('TF2ItemsWeaponsGenerator:TF2ItemsWeapons');

class Player { 
	constructor({ name, steamID, items }) {
		this.name = name;
		this.steamID = steamID;
		this.items = items;
	}
}

class TF2ItemsWeapons {
	constructor(sourceFilesPath) {
		this.sourceFilesPath = sourceFilesPath;
		this.players = [];
	}
	
	async init() {
		await this._initializePlayers();
	}
	
	async _initializePlayers() {
		let dirs = await fs.readdir(this.sourceFilesPath); // get all the player directories
		// we want to always make global the last player.
		dirs.push(dirs.splice(dirs.indexOf('global'), 1)[0]);

		// enumerate through each one
		for(let i = 0; i < dirs.length; i++) {
			// build the path where the player.json should be at
			const playerConfigPath = path.join( this.sourceFilesPath, dirs[i], 'player.json');
			// load it into memory
			let playerConfig = await fs.readFile(playerConfigPath, 'utf8') // get the player.json file
			// parse it as JSON
			try {
				playerConfig = JSON.parse(playerConfig);
			} catch(error) {
				debug(error);
				throw new Error(`Unable to parse playerConfig file at ${playerConfigPath}`);
			}

			this.players.push( new Player(playerConfig) );

		}
	}

	async build() {
		let body = 
		`"custom_weapons_v3" \n{\n`

		for(const player of this.players) {
			body += `\t"${player.steamID}" // ${player.name}\n`;
			body += '\t{\n' // beginning of player

			for(const item in player.items) {
				// This is going to be the actual body of the item in the schema
				let itemConfigPath = path.join(this.sourceFilesPath, player.name, `${item}.txt`);
				let itemConfigExists = await fs.exists(itemConfigPath);

				let itemConfig = await fs.readFile(itemConfigPath, 'utf8'); 

				// Error out if it doesn't exist or it's empty
				if(!itemConfigExists || itemConfig.length === 0) {
					throw new Error(`${itemConfigPath} does not exist or is empty`);
				}

				// Take this file, indent it out so it indents well.

				itemConfig = itemConfig.split('\r\n'); // split it up
				// put an indent before each
				for(let i = 0; i < itemConfig.length; i++ ) {
					// indent 
					itemConfig[i] = '\t\t' + itemConfig[i] 
				}
				// rejoin the array 
				itemConfig = itemConfig.join('\r\n');
				body += `\t\t// Template: ${item}\n`; // template for weapon section

				// for this newly indented data, we want to add it for each ID specified for it.
				player.items[item].forEach((element) => {
					body += `\t\t"${element.id}" // ${element.name}`
					body += '\n';
					body += itemConfig;
					body += '\n';
				})
				body += '\n';
			}


			body += '\t}\n'; // end of player
		}

		body += '}'; // end of custom_weapons_v3 opening header

		// this is the body to eventuallyw rite to file
		// TODO: Add ID
		fs.writeFileSync(`output/tf2items.weapons.txt`, body);
	}
}

module.exports = TF2ItemsWeapons;