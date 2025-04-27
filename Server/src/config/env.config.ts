export const env = {
    get PORT() {
        return process.env.PORT
    },
    get MONGODB_URL() {
        return process.env.MONGODB_URL
    },
    get JWT_ACCESS_SECRET() {
        return process.env.JWT_ACCESS_SECRET
    },
    get JWT_REFRESH_SECRET() {
        return process.env.JWT_REFRESH_SECRET
    },
    get SENDER_MAIL(){
        return process.env.SENDER_MAIL
    },
    get SENDER_PASSWORD(){
        return process.env.SENDER_PASSWORD
    }
}