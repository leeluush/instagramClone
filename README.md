# :camera: Instagram-clone

A responsive Instagram clone built using the MERN stack and Material-UI (Mui). This web application replicates key features of the popular social media platform, Instagram, and showcases my proficiency in full-stack development.

## :star: Features

### User Authentication :closed_lock_with_key:

This application implements a secure JWT (JSON Web Tokens)-based user authentication system:

- **Registration and Login**: Users can register and log in securely. Passwords are hashed using bcrypt for security.

- **JSON Web Tokens (JWT)**: Upon successful login, the server issues a pair of access and refresh tokens to the user. The access token is short-lived and used for authenticating API requests. The refresh token is long-lived and used to issue a new access token when the previous one expires. This approach strikes a balance between security and user experience.

- **Token Refresh Mechanism**: When the access token expires, the application automatically requests a new one using the refresh token. This happens transparently, so the user can continue their session without interruption.

- **Secure Cookie Storage**: Both access and refresh tokens are stored securely in HTTP-only cookies to prevent Cross-Site Scripting (XSS) attacks.

- **Logout**: On logout, both tokens are invalidated, and the cookies are cleared to ensure the session is completely closed.


### Post Creation with Image Upload :camera:

This feature allows authenticated users to create new posts with captions and image uploads. The images are stored in a cloud storage service, which ensures efficient retrieval and display. The feed is automatically updated to include the new post once it's created, providing a seamless user experience. This feature demonstrates the application's ability to handle complex interactions, integrate with external services, and update in real-time.

### Liking and Commenting on Posts :+1: :speech_balloon:

Users can interact with posts by liking and commenting, creating a dynamic and engaging user experience.

### Follow and Unfollow Users :busts_in_silhouette:

Users can follow and unfollow other users, customizing their feed to their preferences.

### Profile Customization :man_artist:

Users can customize their profile information, including their first name, last name, username, email, birthdate, and profile image.

### Real-time Updates using socket.io :bell:

The application provides real-time updates, enhancing the user experience and ensuring users always have the most up-to-date information.

## :wrench: Tech Stack

This project uses the following technologies:

- MongoDB for the database
- Express.js as the web application framework
- React.js for the client-side of the application
- Node.js for the server-side of the application
- Material-UI for the user interface design

## :open_file_folder: Modules

The application is organized into modules, each handling different resources. This creates an organized and easily navigable codebase. The modules include users, posts, comments, followers, and likes, each containing the necessary CRUD operations (Create, Read, Update, Delete) for that resource.

## :rocket: Installation

 1. Clone the Repository
```
   git clone https://github.com/leeluush/instagramClone
   cd instagramClone
```
   
2. Install Dependencies
   This project consists of two main parts: the client and the server. You need to install dependencies for both.

   Client

```
   cd client 
   npm install

```
   Server

```   
   cd backend
   npm install

```
3. Running the Application
To run the application in the development environment where the client and server run concurrently with live-reload feature, execute the following command:
```
npm run start-dev
```

Once the application is running, open your web browser and navigate to http://localhost:3000 to view the client side, or http://localhost:<server_port> to interact with the backend directly via API if needed.



## :memo: Future Improvements

This project is still under development. Future improvements include implementing direct messaging, adding a search functionality for users, and improving the responsiveness of the user interface.
