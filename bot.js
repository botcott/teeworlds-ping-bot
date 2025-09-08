import teeworlds from 'teeworlds'
import yaml from 'yaml'
import fs from 'fs'

const f = fs.readFileSync('./config.yaml', 'utf8')
let cfg = yaml.parse(f)

const client = new teeworlds.Client(cfg.server.ip, cfg.server.port, "name", {
	identity: {
		"name": cfg.client.name,
		"clan": cfg.client.clan,
		"skin": cfg.client.skin,
	},
    ddnet_version: {version: cfg.client.version},
}) // Bot settings

let spectated = false

client.on("snapshot", async (msg) => {
	if (cfg.client.spectate == true) 
		if (!spectated) {
			await client.game.SetTeam(-1)
			spectated == false
		}

	console.log(await client.game.Ping())
})

client.connect();

process.on("SIGINT", async () => {client.Disconnect().then(() => process.exit(0))});
process.stdin.on("data", async data => {await client.rcon.rcon(data)})