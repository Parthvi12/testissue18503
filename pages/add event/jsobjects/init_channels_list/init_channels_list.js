export default {
	initChannelsInStore: async() => {
		if (appsmith.URL.queryParams.id) {
			await get_event_by_id.run()
			const eventChannels =  get_event_by_id.data[0].event_stream_channels.map(el => {return {stream_name: el.stream_name, channel_id: el.channel.channel_id, logo: el.logo}})
			await storeValue("channels", eventChannels)
		} else { // ADD 
			await storeValue("channels", [{stream_name: "", channel_id: "", logo: ""}])
		
		}
		
	}
}