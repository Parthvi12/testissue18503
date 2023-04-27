export default {

	updateEvent: async () => {
		try {
			const  id = event_id.text;
			let bannerSignedUrl = null;
			let logoSignedUrl = null;
			if (banner_file_picker.files.length >  0) {
				bannerSignedUrl = await upload_banner.run({id: id })
			} 
			if (logo_file_picker.files.length >  0) {
				logoSignedUrl = await upload_logo.run({id: id })
			}
			if (gpx_file_picker.files.length >  0) {
				await upload_gpx_file.run({id: id })
			}
			await edit_event.run({id: event_id,  banner_image: bannerSignedUrl?.signedUrl?.split('?')[0], logo: logoSignedUrl?.signedUrl?.split('?')[0]});
			await delete_event_stream_channels.run()
			const channels = get_stream_channels.data;
			if (select_stream_1.selectedOptionValue) {
				const channel = channels.find(el =>el.channel_id == select_stream_1.selectedOptionValue);
				await add_stream_channel_to_event.run({order: 1, event_id: id, stream_channel_id: select_stream_1.selectedOptionValue, stream_name: cam_name_1.text, playback_url: channel.playback_url, thumbnail: channel.thumbnail})
			}
			if (select_stream_2.selectedOptionValue) {
				const channel = channels.find(el =>el.channel_id == select_stream_1.selectedOptionValue);
				await add_stream_channel_to_event.run({order: 2,event_id: id, stream_channel_id: select_stream_2.selectedOptionValue, stream_name: cam_name_2.text, playback_url: channel.playback_url, thumbnail: channel.thumbnail})
			}
			if (select_stream_3.selectedOptionValue) {
				const channel = channels.find(el =>el.channel_id == select_stream_1.selectedOptionValue);
				await add_stream_channel_to_event.run({order: 3,event_id: id, stream_channel_id: select_stream_3.selectedOptionValue, stream_name: cam_name_3.text, playback_url: channel.playback_url, thumbnail: channel.thumbnail})
			}
			if (select_stream_4.selectedOptionValue) {
				const channel = channels.find(el =>el.channel_id == select_stream_1.selectedOptionValue);
				await add_stream_channel_to_event.run({order: 4,event_id: id, stream_channel_id: select_stream_4.selectedOptionValue, stream_name: cam_name_4.text, playback_url: channel.playback_url, thumbnail: channel.thumbnail})
			}
			if (select_stream_5.selectedOptionValue) {
				const channel = channels.find(el =>el.channel_id == select_stream_1.selectedOptionValue);
				await add_stream_channel_to_event.run({order: 5,event_id: id, stream_channel_id: select_stream_5.selectedOptionValue, stream_name: cam_name_5.text, playback_url: channel.playback_url, thumbnail: channel.thumbnail})
			}
			navigateTo("list events")
		} catch(err) {
			showAlert(err.message)
		}

	}
}