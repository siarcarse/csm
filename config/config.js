require('dotenv').load();

var cookiePassword = process.env.JAR_COOKIE_PASSWORD;

const options = {
    cookies: {
        storeBlank: false,
        cache: {
            expiresIn: 1440000,
        },
        cookieOptions: {
            password: cookiePassword,
            isSecure: false
        }
    }
}
export default options;
