BlockEvents.rightClicked('minecraft:bedrock', event => {
	const { block, level, server, player } = event
	const { x, y, z } = block
	const onhand = player.mainHandItem.id

	if (player.hand == 'OFF_HAND') return;

	//try{
	let url = 'kubejs/_schematics/' + '3x3x3_1707390258622_schematic' + '.json' //folder + uuid + extension
	let base = JsonIO.read(url)
	//console.log(JsonIO.read(url).structure)

	if (onhand == 'minecraft:stick') {
		//console.printObject(base.structure)
		for (let x0 = 0; x0 < base.structure.size(); x0++) {				//[block.id]*3 -> [block.id]*2
			for (let y0 = 0; y0 < base.structure[0].size(); y0++) {			//[block.id]*2 -> [block.id]
				for (let z0 = 0; z0 < base.structure[0][0].size(); z0++) {	//[block.id] -> block.id
					//console.log(x0 + ' ' + y0 + ' ' + z0)
					//event.server.scheduleInTicks(20, data => {	//delay based on index
					//console.log(base.structure[x0][y0][z0])
					server.runCommandSilent(`execute at ${player.uuid} run particle dust 0.000 1.500 0.000 1 ${x + x0 + 1} ${y + y0 + 2.5} ${z + z0 + 1} 0 0 0 0.1 0 normal`)
					level.getBlock(x + x0 + 1, y + y0 + 1, z + z0 + 1).set(base.structure[x0][y0][z0])
					//console.log(level.getBlock(x + x0 + 1, y + y0 + 1, z + z0 + 1))
					//})

				}
			}
		}
	}

	/*}catch(e){
		//console.log('Missing file :'+url)
		console.log(e)
	}*/
})