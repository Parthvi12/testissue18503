export default {
	recoverPassword: async () => {
		// Get access token from URL
		const url = new URL(appsmith.URL.fullPath.replace("#", "?", 1));
		const searchParams = url.searchParams;
		const accessToken = searchParams.get("access_token");
		return await storeValue('login',{"access_token": accessToken});
	}

}