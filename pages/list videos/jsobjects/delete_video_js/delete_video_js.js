export default {
	deleteVideo: async () => {
		try {
			const id = videos_table.selectedRow.id;
			await delete_video.run({"id": id});
			await get_videos_by_event.run();
			closeModal("delete_item")
		} catch(err) {
			showAlert(err, "error"); 
			await get_videos_by_event.run();
		}
	}
}