export default {
	removeBaseUrl: (url) => {
		return  url.split("https://")[1].split("/").slice(1).join("/")
	},
	deleteEvent: async () => {
		try {
			const id = events_table.selectedRow.id;
			await delete_event_stream_channels.run({"id": id});
			await delete_event.run({"id": id});
			const eventFiles = await get_event_files.getEventFiles(id);
			await delete_event_files.run({files: eventFiles})
			await get_events.run();
			closeModal("delete_item");
		} catch(err) {
			showAlert(err, "error"); 
			await get_events.run();
		}
	},
	
}