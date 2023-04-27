export default {
	getEventFiles: async (id) => {
		const eventFiles = []
		let logos = await get_list_files_with_prefix.run({prefix: "upload/logos/" + id });
		logos = logos.map(el=>el.fileName )
		let banners = await get_list_files_with_prefix.run({prefix: "upload/banners/" + id + "_"});
		banners = banners?.map(el=>el.fileName);
		let routeFiles = await get_list_files_with_prefix.run({prefix: "upload/gpx-files/" + id });
		routeFiles = routeFiles?.map(el=>el.fileName);
		let placeholderImages = await get_list_files_with_prefix.run({prefix: "upload/placeholder_images/" + id });
		placeholderImages = placeholderImages?.map(el=>el.fileName);
		eventFiles.push(...logos);
		eventFiles.push(...placeholderImages);
		eventFiles.push(...banners);
		eventFiles.push(...routeFiles)
		return eventFiles;
	}
}