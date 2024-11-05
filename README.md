## Setup Instructions

1. Clone the repository - `https://github.com/ra463/voosh-server.git`
2. Install dependencies using `npm install`.
3. Create the `config.env` in the config folder like this - `/config/config.env`.
4. Configure environment variables:
   - `JWT_SECRET`
   - `JWT_EXPIRE` [Eg - 2D]
   - `CLOUDINARY_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `MONGO_URI`
   - `PORT`
   - `GOOGLE_CLIENT_ID` [Your Google Console Client ID]
   - `GOOGLE_CLIENT_SECRET` [Your Google Console Client Secret]
5. Add the client url (local/deployed) in the cors in `app.js` file.
6. Start the server using `npm run dev` (if nodemon is globally installed).

## Testing Instructions

### To test the APIs:

**Beaware - By Running the test the Data from the database is also deteled**.

**Run the test cases using:** - `npm test`

- Ensure that Mocha, Chai, and other testing dependencies are installed.
- The test cases are located in the test folder.
- The testing covers user registration, login, and various failure cases.

### Server Deployed Link - [https://voosh-app.adaptable.app]

### Client Deployed Link - [https://voosh-client-rust.vercel.app]

## Components

- **Backend**: Node.js/Express.js for all the APIs.
- **Database**: MongoDB for storing details.
- **Cloudinary**: Storage for image files.
