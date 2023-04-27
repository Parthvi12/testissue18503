export default {

	updateEvent: async () => {
		try {
			const  id = appsmith.URL.queryParams.id;

			let logoSignedUrl = null;
			let gpxSignedUrl = null;
			let placeholderImageUrl = null;
			let trackMetadata = null; // json object holding track metadata like distance,elevation, lat/lon
		
			if (logo_file_picker.files.length >  0) {
				logoSignedUrl = await upload_logo.run({id: id })
			}
			if (gpx_file_picker.files.length >  0) {
				gpxSignedUrl = await upload_gpx_file.run({id: id })
				const gpxFile = await fetch(gpxSignedUrl.signedUrl.split('?')[0]);
				const gpxText = await gpxFile.text();
				const gpxData = new gpxparser(); //Create gpxParser Object
				gpxData.parse(gpxText);
				trackMetadata = {distance:  Math.round((gpxData.tracks.map(el => el.distance.total).reduce((acc, amount) => acc + amount) / 1000) * 10) / 10, elevationMin: Math.floor(Math.min(...gpxData.tracks.map(el => el.elevation.min))), 
												 elevationMax: Math.floor(Math.max(...gpxData.tracks.map(el => el.elevation.max))), latitude: gpxData?.tracks[0]?.points[0]?.lat, longitude: gpxData?.tracks[0]?.points[0]?.lon}
			}
			if (placeholder_image_file_picker.files.length >  0) {
				placeholderImageUrl = await upload_placeholder_image.run({id: id})
			}
			let body = {id: id, route_file: gpxSignedUrl?.signedUrl?.split('?')[0], logo: logoSignedUrl?.signedUrl?.split('?')[0], player_placeholder_image: placeholderImageUrl?.signedUrl?.split('?')[0]};
			if (trackMetadata) {
				body = {...body, metadata: trackMetadata}
			}
			await edit_event.run(body);
			await delete_event_stream_channels.run({event_id: id})
			const streamChannels = get_stream_channels.data;
			await Promise.all(channels.currentItemsView.map(async (item, index) => {
				if (item.cam_name.isValid && item.select_stream.isValid) {
					const channel = streamChannels.find(el => el.channel_id == item.select_stream.selectedOptionValue);
					// allow user to override logo for each camera(stream channel)
					let cameraLogo = null;
					if (item.camera_logo_file_picker?.files?.length >  0) {
						cameraLogo = await upload_camera_logo.run({content: item.camera_logo_file_picker.files[0], fileName: id +"_" + channel.channel_id + "_logo." + item.camera_logo_file_picker.files[0]?.name?.split(".").pop() })
					}
					const currentLogo = get_event_by_id.data[0].event_stream_channels.find(el => el.stream_channel_id == item.select_stream.selectedOptionValue).logo;
					await add_stream_channel_to_event.run({order: index + 1 , event_id: id, stream_channel_id: channel.channel_id, stream_name: item.cam_name.text, playback_url: channel.playback_url, thumbnail: channel.thumbnail, device_code: CryptoJS.SHA256(id + channel.channel_id).toString(CryptoJS.enc.Hex), logo: cameraLogo ? cameraLogo?.signedUrl.split('?')[0] : channels.listData[index].new ? null: currentLogo})
				}
			})).then((values) => {
				navigateTo("list events")
			});


		} catch(err) {
			showAlert(err.message)
		}

	}
}