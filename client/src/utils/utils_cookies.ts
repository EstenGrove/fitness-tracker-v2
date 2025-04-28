const setAccessTokenCookie = (token: string) => {
	document.cookie = `access_token=${token}; path=/; secure; HttpOnly; SameSite=Strict; max-age=3600`;
};

export { setAccessTokenCookie };
