export default {
	deleteVideo: async () => {
		try {
			const id = ads_table.selectedRow.banner_id;
			await delete_ad.run({"banner_id": id});
			await delete_banner.run({file_path: ads_table.selectedRow.banner_link.split("https://")[1].split("/").slice(1).join("/")})
			closeModal("delete_item")
			await get_ads_by_event.run();
		} catch(err) {
			showAlert(err, "error"); 
			await get_ads_by_event.run();
		}
	}
}