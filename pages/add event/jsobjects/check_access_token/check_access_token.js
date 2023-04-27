export default {
	checkAccessToken: async() => {
		const now  = new Date();
		if (!appsmith.store.login?.created_at) {
			navigateTo("login");
			return;
		}
		const createdAt = new Date(appsmith.store.login?.created_at);
		const dif = Math.floor(now.getTime() -  createdAt.getTime()) / 1000;
		if (dif > appsmith.store.login.expires_in)
		{
			navigateTo("login")
		}
	}
}