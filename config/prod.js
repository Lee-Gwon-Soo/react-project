// prod.js - production keys here !!

module.exports = {
    host: process.env.HOSTURL,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret : process.env.GOOGLE_CLIENT_SECRET,
    mongoURI : process.env.MONGO_URI,
    cookieKey: process.env.COOKIE_KEY,
    aws_access_key_id : process.env.AWS_ACCESS_KEY,
    aws_secret_access_key : process.env.AWS_SECRET_KEY,
    bucket_name_blog: process.env.AWS_BUCKET_BLOG,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    RDS_HOSTNAME: process.env.RDS_HOSTNAME,
    RDS_USERNAME: process.env.RDS_USERNAME,
    RDS_PASSWORD: process.env.RDS_PASSWORD,
    RDS_PORT: process.env.RDS_PORT,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDER_MAIL: process.env.SENDER_MAIL
};