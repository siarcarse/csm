require('dotenv').load();

const cookiePassword = process.env.YAR_COOKIE_PASSWORD;
export const PORT = process.env.SERVER_PORT;
export default cookiePassword;