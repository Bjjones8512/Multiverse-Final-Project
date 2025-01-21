Multiverse React Dashboard



Description



This project is a React-based web application demonstrating user login, registration, and dashboard functionality. It integrates with the ServiceNow API to handle user authentication and display dynamic data on the dashboard. The app supports user management (registration/login) and allows users to view data fetched from a backend.



Additionally, the project includes basic CRUD operations and integrates unit testing for both frontend and backend components to ensure smooth functionality.



Features

	•	Login: Users can log in using their credentials, with token-based authentication.

	•	Registration: New users can sign up through the registration form, and their data is stored in ServiceNow.

	•	Dashboard: After logging in, users can view data from the backend displayed on a user-friendly dashboard.

	•	CRUD Operations: Allows for create, read, update, and delete actions on data.

	•	OAuth Authentication: Integrates OAuth for secure user authentication.

	•	Unit Testing: Tests are implemented using Jest and React Testing Library.



Technologies Used

	•	React: A JavaScript library for building user interfaces.

	•	Axios: For making HTTP requests to the backend.

	•	React Router: To handle routing and navigation between views.

	•	ServiceNow API: Used for handling user authentication and data fetching.

	•	Jest & React Testing Library: Used for unit tests for frontend and backend functionality.



Project Structure



/src

  /components

    Login.js         # Handles login form and authentication

    Register.js      # Handles user registration form

    Dashboard.js     # Displays dynamic data fetched from ServiceNow

  App.js             # Main app component managing routes and state

  index.js           # Entry point of the application

  index.css          # Global styles for the app

/public

  index.html         # HTML template

  favicon.ico        # Favicon for the app



Installation
Ensure you have the following installed:

	•	Node.js and npm (or yarn) installed on your machine.

	•	A ServiceNow instance with API access configured (for backend integration).



Steps to Install

	1.	Clone the repository:



git clone https://github.com/Bjjones8512/Multiverse-Final-Project.git



	2.	Navigate to the project directory:



cd Multiverse-Final-Project



	3.	Install the project dependencies:



npm install



	4.	Configure your ServiceNow credentials and API URLs in the code (for example, update the URL in axios requests).



Running the Application



After installing the dependencies, start the app by running:



npm start



This will start the development server at http://localhost:3000, where you can access the app in your browser.



Testing



To run the tests for both the frontend and backend, execute:



npm test



This will run the unit tests for all components and backend integration.



Deployment

	1.	Build the app for production:



npm run build



	2.	Deploy the build folder to your desired platform (Netlify, Vercel, AWS, etc.).



Usage

	•	Login: Log in with your credentials to access the dashboard.

	•	Register: Create a new account using the registration form.

	•	Dashboard: View data fetched from the ServiceNow API after logging in.



Contributing

	1.	Fork the repository.

	2.	Create a new branch for your feature/bug fix.

	3.	Commit and push your changes.

	4.	Open a pull request.
