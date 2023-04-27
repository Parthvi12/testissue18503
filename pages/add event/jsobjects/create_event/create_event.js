export default {
	createEvent: async () => {
		const uuid = UUID.generate();
		let logoUrl = null;
		let placeholderImageUrl = null;
		if (logo_file_picker.files.length >  0) {
			logoUrl = await upload_logo.run({id: uuid.toString() })
		}
		if (placeholder_image_file_picker.files.length >  0) {
			placeholderImageUrl = await upload_placeholder_image.run({id: uuid.toString() })
		}

		const gpx_file_upload = await upload_gpx_file.run({id: uuid.toString() });
		const gpxFile = await fetch(gpx_file_upload.signedUrl.split('?')[0]);
		const gpxText = await gpxFile.text();
		const gpxData = new gpxparser(); //Create gpxParser Object
		gpxData.parse(gpxText);
		const trackMetadata = {distance:  Math.round((gpxData.tracks.map(el => el.distance.total).reduce((acc, amount) => acc + amount) / 1000) * 10) / 10, elevationMin: Math.floor(Math.min(...gpxData.tracks.map(el => el.elevation.min))), 
													 elevationMax: Math.floor(Math.max(...gpxData.tracks.map(el => el.elevation.max))), latitude: gpxData?.tracks[0]?.points[0]?.lat, longitude: gpxData?.tracks[0]?.points[0]?.lon}
		await add_event.run({id: uuid, route_file: gpx_file_upload.signedUrl.split('?')[0],
												 logo: logoUrl?.signedUrl?.split('?')[0], player_placeholder_image: placeholderImageUrl?.signedUrl?.split('?')[0], metadata: trackMetadata });
		const streamChannels = get_stream_channels.data;
		await Promise.all(channels.currentItemsView.map(async (item, index) => {
			if (item.cam_name.isValid && item.select_stream.isValid) {
				const channel = streamChannels.find(el => el.channel_id == item.select_stream.selectedOptionValue);
				// allow user to override logo for each camera(stream channel)
				let cameraLogo = null;
				if (item.camera_logo_file_picker?.files?.length >  0) {
					cameraLogo = await upload_camera_logo.run({content: item.camera_logo_file_picker.files[0], fileName: uuid.toString() +"_" + channel.channel_id + "_logo." + item.camera_logo_file_picker.files[0]?.name?.split(".").pop() })
				}

				// We're storing the details of the stream channel in the relation table even tough they already exist in the stream_channels table in order to restrict access to the stream_channnels table to authenticated users only (RLS policies)
				await add_stream_channel_to_event.run({order: index + 1 , event_id: uuid, stream_channel_id: channel.channel_id, stream_name: item.cam_name.text, playback_url: channel.playback_url, thumbnail: channel.thumbnail, device_code: CryptoJS.SHA256(uuid + channel.channel_id).toString(CryptoJS.enc.Hex), logo:  cameraLogo?.signedUrl?.split('?')[0]})
			}
		})).then((values) => {
			navigateTo("list events")
		});
		
	},



}
