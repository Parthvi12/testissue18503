export default {
	getItems: () => {
		return appsmith.store.channels;
	},
	deleteItem: async(index) => {
		var list = appsmith.store.channels;
		list.splice(index, 1);
		await storeValue("channels",list);
	},
	addItem: async() => {
		
		await storeValue("channels", [...channels.currentItemsView.map((el, index) => {return {stream_name: el.cam_name?.text, channel_id: el.select_stream?.selectedOptionValue, logo: "", new: channels.listData[index]?.new }}), {"stream_name": "", "channel_id": "", "logo": "", "new": true}]);
	}
}