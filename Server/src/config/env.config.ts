export const env = {
    get PORT() {
        return process.env.PORT
    },
    get CLIENT_URL() {
        return process.env.CLIENT_URL
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
    get SENDER_EMAIL(){
        return process.env.SENDER_EMAIL 
    },
    get SENDER_PASSWORD(){
        return process.env.SENDER_PASSWORD 
    },
    get CLOUDINARY_CLOUD_NAME(){
        return process.env.CLOUDINARY_CLOUD_NAME
    },
    get CLOUDINARY_API_KEY(){
        return process.env.CLOUDINARY_API_KEY
    },
    get CLOUDINARY_API_SECRET(){
        return process.env.CLOUDINARY_API_SECRET
    }
}