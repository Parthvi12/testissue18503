export default {
	supabaseLoginHelper: async() => {
		return await supabase_login.run( async data=>{await storeValue('login',{...data, "created_at": new Date() });navigateTo('Profile')}, e=>showAlert(e.error_description) )
	}
}