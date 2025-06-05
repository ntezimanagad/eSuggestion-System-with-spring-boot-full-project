eSuggestion System – Project Overview
The eSuggestion System is a web-based application developed using Spring Boot and React.js. It allows users to submit, view, and manage suggestions in an organized and efficient way. This system is designed to encourage open communication within organizations by collecting user feedback, ideas, or complaints in a structured manner.

Key Features
User Authentication:
Users can register, log in, and manage their accounts securely using JWT-based authentication. OTP verification is also integrated for added security.

Submit Suggestions:
Users can create and submit new suggestions directly from the web interface.

View and Track Suggestions:
Users can view their submitted suggestions and track their status (e.g., Pending, Reviewed, Approved, Rejected).

Admin Dashboard:
Admins can view all suggestions submitted by users, update their statuses, and respond to them as needed.

Email Notifications:
Users receive email notifications when suggestions are submitted, updated, or resolved.

Secure API Access:
All backend endpoints are protected using role-based access and JWT security.

Technology Stack
Frontend: React.js with Material UI
Backend: Spring Boot (Java)
Database: MySQL or PostgreSQL
Security: Spring Security with JWT and OTP
Others: Email notifications using SMTP, Git for version control

System Roles
User

Register and log in to the system

Submit suggestions

View and track personal suggestions

Receive email notifications on suggestion updates

Admin

Access all suggestions from all users

Change the status of suggestions (e.g., approve or reject)

Manage user suggestions and system operations

Entity Relationship Overview
A User can submit multiple Suggestions

Each Suggestion has a status and belongs to one User

Admins can view and manage all Suggestions
