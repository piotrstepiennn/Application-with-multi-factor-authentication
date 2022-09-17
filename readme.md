## Application with multi-factor authentication ##
Application developed using nodejs and expressjs. Uses multi-factor user authentication. The application was the result of work as a semester project of studies in computer science. The following types of authentication and security were implemented:
- Login using username and password,
- Authentication using a one-time access code sent to the email assigned to the account,
- Authentication using a one-time access code downloaded from the implemented Mobile application, to which the user logs in with different login credentials than when logging into the application web application,
- Answering a verification question that the user selected and answered during registration,
- Additional authentication password - when entering it, the user enters only the password indexes drawn by the server, the user enters e.g. 1, 6, 8 and 10 letters of the password.
- Captcha
> Also the application is implemented to work with the https protocol using a private and public key

The code is a bit mess, as this is one of the first projects I created, however, the next ones will surely be better.
