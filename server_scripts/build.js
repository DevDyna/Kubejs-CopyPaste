BlockEvents.rightClicked("minecraft:bedrock", (event) => {
  const { block, level, server, player ,hand} = event;
  const { x, y, z } = block;
  const onhand = player.mainHandItem.id;

  if (hand == "OFF_HAND") return;

  //try{
  let url = "kubejs/_schematics/" + "3x3x3_1707390258622_schematic" + ".json"; //folder + uuid + extension
  let base = JsonIO.read(url);
  //console.log(JsonIO.read(url).structure)

  if (onhand == "minecraft:stick" && hand == "MAIN_HAND") {
    //console.printObject(base.structure)
    //[block.id]*3 -> [block.id]*2

	let indexX = 0
	let indexY = 0
	let indexZ = 0

	let obj = {
		coord: {
			x: [],
			y: [],
			z: []
		},
		id: []
	}


    base.structure.forEach((element) => {
      element.forEach((data) => {
        data.forEach((omega) => {

			obj.id.push(omega)
			obj.coord.x.push(x+ indexX+1)
			obj.coord.y.push(y+ indexY+1)
			obj.coord.z.push(z+ indexZ+1)

			indexZ++
        });
		indexZ=0
		indexY++
      });
	  indexY=0
	  indexX++
	});

	obj.id.forEach((item,index)=>{
		server.scheduleInTicks(5*index,a=>{
			level.getBlock(obj.coord.x[index],obj.coord.y[index],obj.coord.z[index]).set(obj.id[index])
			server.runCommandSilent(`execute at ${player.uuid} run particle dust 0.000 1.500 0.000 1 ${ obj.coord.x[index] + 1} ${obj.coord.y[index] + 1} ${obj.coord.z[index] + 1} 0 0 0 0.1 0 normal`);
		})
	})
  }
});
