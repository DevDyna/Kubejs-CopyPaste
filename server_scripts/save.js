BlockEvents.rightClicked(event => {
	const { block, level, server, player, hand } = event
	const { x, y, z } = block
	const onhand = player.mainHandItem
	//mainhand only blaze
	if (hand == 'MAIN_HAND' && onhand.id == 'minecraft:blaze_rod') {
		player.swing()
		if (onhand.nbt == null || player.isShiftKeyDown()) {		//init nbt value
			onhand.nbt = { 'pos1': [], 'pos2': [] }
			//player.tell('NBT init , press again to start selection')
		}
		// select 1
		if (onhand.nbt.pos1.length <= 0 && onhand.nbt.pos2.length <= 0) {
			Utils.server.runCommandSilent(`tellraw ${player.name.string} [{"text":"First Corner: ","color":"gold"},{"text":"[${x},${y},${z}]","color":"green","hoverEvent":{"action":"show_text","value":[{"text":"Press to show the corner"}]},"clickEvent":{"action":"run_command","value":"/summon block_display ${x - 0.01} ${y} ${z - 0.01} {Glowing:1b,block_state:{Name:'${block.id}'}}"}}]`)
			onhand.nbt.pos1 = [x, y, z]
		} else
			//select 2
			if (onhand.nbt.pos1.length > 0 && onhand.nbt.pos2.length <= 0) {
				Utils.server.runCommandSilent(`tellraw ${player.name.string} [{"text":"Second Corner: ","color":"gold"},{"text":"[${x},${y},${z}]","color":"green","hoverEvent":{"action":"show_text","value":[{"text":"Press to show the corner"}]},"clickEvent":{"action":"run_command","value":"/summon block_display ${x - 0.01} ${y} ${z - 0.01} {Glowing:1b,block_state:{Name:'${block.id}'}}"}}]`)
				onhand.nbt.pos2 = [x, y, z]
			} else
				//select completed
				if (onhand.nbt.pos1.length > 0 && onhand.nbt.pos2.length > 0) {
					let pos1 = onhand.nbt.pos1
					let pos2 = onhand.nbt.pos2

					let min = [0, 0, 0]
					let max = [0, 0, 0]
					//define min and max [x y z]
					let shape = [0, 1, 2]
					shape.forEach(data => {
						if (pos1[data] > pos2[data]) {
							max[data] = pos1[data]
							min[data] = pos2[data]
						} else {
							min[data] = pos1[data]
							max[data] = pos2[data]
						}
					})


					let rnd = Math.random()
					let diff = [(Math.abs(pos1[0] - pos2[0]) + 1), (Math.abs(pos1[1] - pos2[1]) + 1), (Math.abs(pos1[2] - pos2[2]) + 1)]
					let list_base = []
					let list_final = []

					for (let x1 = min[0]; x1 <= max[0]; x1++) {
						for (let y1 = min[1]; y1 <= max[1]; y1++) {
							for (let z1 = min[2]; z1 <= max[2]; z1++) {
								//player.tell('--x:'+x1+' --y:'+y1+' --z:'+z1)
								//console.log(level.getBlock(x1, y1, z1))
								list_base.push(level.getBlock(x1, y1, z1).id)

								Utils.server.runCommandSilent(`execute at ${player.uuid} run particle dust ${rnd + 1} ${rnd + 1} ${rnd + 1} ${rnd + 0.5} ${x1} ${y1 + 1.25} ${z1} 0 0 0 0.1 0 normal`)
							}
						}
					}
					//console.log('\\--------------------------\\')
					let delta = []
					let i = 0
					let line = [0, 1]
					line.forEach(part => {
						if (i > 0) {
							delta = []
							list_base = list_final
							list_final = []
						}

						list_base.forEach((item, index) => {
							delta.push(item)
							if ((index + 1) % diff[part] == 0) {
								list_final.push(delta)
								delta = []
							}
						})
						i++
					})
					//console.log(list_final)
					//console.log('\\--------------------------\\')
					JsonIO.write('kubejs/_schematics/' + diff[0] + 'x' + diff[1] + 'x' + diff[2] + '_' + Utils.systemTime + '_schematic.json', { 'UUID': Utils.systemTime, 'structure': list_final })

					Utils.server.runCommandSilent(`title ${player.name.string} actionbar {"text":"Schematic saved [${diff[0]}x${diff[1]}x${diff[2]}] as UUID: ${Utils.systemTime}","color":"green"}`)
					Utils.server.runCommandSilent('kill @e[type=block_display]')
				}

	}
})

ItemEvents.rightClicked('minecraft:flint', event => {
	Utils.server.runCommandSilent('kill @e[type=block_display]')
	event.player.swing()
})


