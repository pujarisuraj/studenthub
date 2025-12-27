# 🎓 StudentHub - Academic Project Collaboration Platform

<div align="center">

![StudentHub Banner](https://img.shields.io/badge/StudentHub-Academic%20Portal-4F46E5?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=springboot)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A comprehensive platform for students to showcase, collaborate, and manage academic projects**

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [User Roles](#-user-roles)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**StudentHub** is a full-stack web application designed to facilitate academic project collaboration among students. It provides a centralized platform where students can:

- Upload and showcase their academic projects
- Browse and discover projects from peers
- Request collaboration and download access to project source code
- Interact through likes and project requests
- Manage their profiles and track project activities

The platform includes a powerful **Admin Dashboard** for moderating content, managing users, and monitoring platform activities.

---

## 🚀 Key Features

### 👨‍🎓 **Student Features**

#### **1. User Authentication & Authorization**

- ✅ **Secure Registration** - Register with college email, name, roll number, course, and semester
- ✅ **JWT-based Authentication** - Secure token-based login system
- ✅ **Password Management** - Forgot password and reset password functionality via email
- ✅ **Profile Management** - Update personal information, view statistics, and manage account
- ✅ **Account Status** - Active, Suspended, or Inactive status management

#### **2. Project Management**

- 📁 **Upload Projects** - Submit projects with details:
  - Project name, description, team leader name
  - Course, semester, and tech stack
- Multiple screenshots (up to 5 images)
- Live demo link and source code repository link
- 🔍 **Browse Projects** - Search and filter projects by:
  - Name, description, or tech stack
  - Course (MCA, BCA, B.Tech, B.Sc)
  - Technology (React, Node.js, Python, Java, Angular, etc.)
  - Sort by: Latest, Most Popular, Most Liked
- 📊 **Project Status** - Visual badges with color coding:
  - 🟡 **Pending Review** - Yellow badge for pending approval
  - 🟢 **Admin Approved** - Green badge with "Admin Approved" message
  - 🔴 **Rejected** - Red badge for rejected projects
- 🖼️ **Image Carousel** - Navigate through multiple project screenshots
- ❤️ **Like Projects** - Express appreciation for projects with one-click likes
- 👁️ **View Tracking** - Automatic view count increment on project views

#### **3. Collaboration & Access Control**

- 📩 **Request Download Access** - Send requests to project owners for source code access
- ✅ **Approve/Reject Requests** - Project owners can manage collaboration requests
- 🔄 **Re-request After Rejection** - Users can request again if rejected
- 📥 **Download Source Code** - Access approved project repositories
- 🔒 **Access States**:
  - 👑 **Owner** - Full access to own projects
  - ✅ **Approved** - Download access granted
  - ⏳ **Pending** - Request under review
  - ❌ **Rejected** - Request denied (can re-request)
  - 📩 **No Request** - Not yet requested

#### **4. Profile & Dashboard**

- 👤 **Personal Profile** - View and edit:
  - Full name, email, roll number
  - Course and semester
  - Profile initials avatar
- 📊 **Statistics Dashboard** -:
  - Total projects uploaded
  - Total collaboration requests received
  - Pending requests count
- 🔔 **Collaboration Requests** - Manage incoming requests:
  - View requester details
  - Read request messages
  - Approve or reject with one click
  - Real-time status updates
- 🔓 **Logout** - Secure session termination

---

### 🛡️ **Admin Features**

#### **1. Admin Dashboard**

Comprehensive admin panel with tabs:

##### **📊 Students Tab**

- View all registered students with details:
  - Name, Email, Roll Number, Course, Semester
  - Account Status (Active/Suspended/Inactive)
  - Project count and join date
- **Actions**:
  - 👁️ **View Details** - Complete student information modal
  - ✏️ **Edit Student** - Modify student details and account status
  - 🔑 **Change Password** - Reset student passwords
  - 🗑️ **Delete Student** - Remove student account and all related data
- **Filters**: Filter by course (All, MCA, BCA, B.Tech, B.Sc)

##### **📁 Projects Tab**

- View all projects across the platform
- **Project Information**:
  - Project name, owner details
  - Status, views, likes count
  - Tech stack and course
  - Created date
- **Actions**:
  - ✅ **Approve** - Approve pending projects
  - ❌ **Reject** - Reject projects
  - 🗑️ **Delete** - Remove projects from platform
- **Visual Status**: Color-coded status badges

##### **📨 Requests Tab**

- Monitor all collaboration requests
- See requester and project owner details
- View request messages and timestamps
- **Actions**:
  - ✅ **Approve** - Grant download access
  - ❌ **Reject** - Deny request

##### **🏆 Leaderboard Tab**

- **Top Performing Students** - Ranked by:
  - Total Projects
  - Total Collaborations (Approved Requests)
  - Total Likes on Projects
  - **Score Formula**: `Projects + Collaborations + Likes`
- Real-time data from backend
- Top 10 students displayed
- Medal icons for top 3 (🥇🥈🥉)

##### **📊 Activity Logs Tab**

- **Complete Activity Tracking**:
  - User actions (Login, Registration, Profile Updates)
  - Project operations (Upload, Edit, Delete)
  - Request actions (Send, Approve, Reject)
  - Admin actions (Approval, Deletion, Status Changes)
- **Display Information**:
  - User avatar and name
  - Action type with icon
  - Description
  - Timestamp (relative time)
  - Category (Admin, Project, User, Request)
- **Features**:
  - View all logs (no pagination limit)
  - Clear all logs with confirmation
  - Auto-refresh on tab switch

##### **📊 Statistics Cards**

- **Total Students** - Registered user count
- **Total Projects** - Platform-wide project count
- **Pending Requests** - Requests awaiting action
- **Active Collaborations** - Approved collaborations

#### **2. Bulk Email System**

Full-featured email sending tool:

- **Recipient Selection**:
  - Select registered students from list with avatars
  - Add additional recipients with name and email
  - Real-time recipient count
- **Email Composition**:
  - Subject line input
  - Rich HTML message editor
  - Attach multiple files
- **Filters**:
  - Filter students by course
  - Search students by name
- **Preview & Send**:
  - Review selected recipients
  - Remove individual recipients
  - Send to all or selected students

#### **3. Admin Profile**

- View admin information
- Crown icon with premium styling
- Rotating ring effect and shimmer animation
- Direct link to admin dashboard
- Secure logout functionality

---

## 🛠️ Tech Stack

### **Frontend**

| Technology       | Version | Purpose                                          |
| ---------------- | ------- | ------------------------------------------------ |
| React            | 19.2.3  | UI Framework                                     |
| React Router DOM | 7.11.0  | Client-side routing                              |
| Lucide React     | 0.562.0 | Icon library                                     |
| CSS3             | -       | Styling (Vanilla CSS with gradients, animations) |

### **Backend**

| Technology      | Version | Purpose                        |
| --------------- | ------- | ------------------------------ |
| Spring Boot     | 3.x     | Java framework                 |
| Spring Security | -       | Authentication & Authorization |
| Spring Data JPA | -       | Database ORM                   |
| MySQL           | 8.x     | Relational database            |
| JWT             | -       | Token-based authentication     |
| JavaMail        | -       | Email functionality            |
| Lombok          | -       | Boilerplate code reduction     |

### **Development Tools**

- Git & GitHub - Version control
- VS Code - Frontend IDE
- IntelliJ IDEA - Backend IDE
- Postman - API testing
- MySQL Workbench - Database management

---

## 📁 Project Structure

```
studenthub/
├── backend/                          # Spring Boot Backend
│   └── campus-collab-platform/
│       └── src/main/java/com/college/campuscollab/
│           ├── controller/           # REST API Controllers
│           │   ├── AdminController.java
│           │   ├── AuthController.java
│           │   ├── ProjectController.java
│           │   ├── RequestController.java
│           │   └── ActivityLogController.java
│           ├── service/              # Business Logic
│           │   ├── AdminService.java
│           │   ├── UserService.java
│           │   ├── ProjectService.java
│           │   ├── RequestService.java
│           │   ├── ActivityLogService.java
│           │   └── EmailService.java
│           ├── repository/           # Data Access Layer
│           │   ├── UserRepository.java
│           │   ├── ProjectRepository.java
│           │   ├── ContributionRequestRepository.java
│           │   ├── ProjectLikeRepository.java
│           │   └── ActivityLogRepository.java
│           ├── entity/               # Database Entities
│           │   ├── User.java
│           │   ├── Project.java
│           │   ├── ContributionRequest.java
│           │   ├── ProjectLike.java
│           │   └── ActivityLog.java
│           ├── dto/                  # Data Transfer Objects
│           ├── config/               # Configuration
│           │   ├── SecurityConfig.java
│           │   └── CorsConfig.java
│           └── util/                 # Utilities
│
├── src/                              # React Frontend
│   ├── components/                   # Reusable Components
│   │   ├── Navbar/                  # Navigation bar
│   │   ├── Footer/                  # Footer component
│   │   ├── Toast/                   # Notification system
│   │   ├── ProjectCard/             # Project display card
│   │   └── ScrollToTop/             # Scroll utility
│   │
│   ├── pages/                        # Page Components
│   │   ├── Home/                    # Landing page
│   │   ├── Login/                   # Student login
│   │   ├── Register/                # Student registration
│   │   ├── AdminRegister/           # Admin registration
│   │   ├── ForgotPassword/          # Password recovery
│   │   ├── ResetPassword/           # Password reset
│   │   ├── Projects/                # Browse projects
│   │   ├── UploadProject/           # Upload new project
│   │   ├── Profile/                 # Student profile
│   │   ├── AdminProfile/            # Admin profile
│   │   ├── AdminDashboard/          # Admin control panel
│   │   ├── BulkEmail/               # Bulk email tool
│   │   └── About/                   # About page
│   │
│   ├── services/                     # API Services
│   │   └── api.js                   # HTTP client & API calls
│   │
│   ├── hooks/                        # Custom React Hooks
│   ├── utils/                        # Utility functions
│   ├── styles/                       # Global styles
│   ├── App.js                        # Main application component
│   └── index.js                      # Application entry point
│
├── public/                           # Static assets
├── package.json                      # Dependencies
└── README.md                         # Documentation
```

---

## 💻 Installation

### **Prerequisites**

- Node.js (v16+ recommended)
- Java JDK 17+
- MySQL 8.x
- Git

### **Backend Setup**

1. **Clone the repository**

```bash
git clone https://github.com/pujarisuraj/studenthub.git
cd studenthub/backend/campus-collab-platform/campus-collab-platform
```

2. **Configure MySQL Database**

```sql
CREATE DATABASE campus_collab;
```

3. **Update `application.properties`**

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campus_collab
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

# JWT Secret
jwt.secret=your_256_bit_secret_key

# Email Configuration (for password reset)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

4. **Run the backend**

```bash
./mvnw spring-boot:run
```

Backend will start on `http://localhost:8080`

### **Frontend Setup**

1. **Navigate to project root**

```bash
cd ../../..  # Go back to project root
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure API Base URL**
   Update `src/services/api.js` if needed:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

4. **Start development server**

```bash
npm start
```

Frontend will start on `http://localhost:3000`

---

## ⚙️ Configuration

### **Email Setup (Gmail)**

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Use the generated password in `application.properties`

### **Admin Registration**

Admin registration requires an authorized email. Update in:

```java
// AuthController.java
private static final List<String> AUTHORIZED_ADMIN_EMAILS = Arrays.asList(
    "admin@example.com",
    "admin2@example.com"
);
```

---

## 📖 Usage

### **For Students**

1. **Register Account**

   - Navigate to Sign Up
   - Enter college email, name, roll number, course, semester
   - Verify email and login

2. **Browse Projects**

   - Visit Projects page
   - Use search and filters
   - Click on project cards to view details

3. **Upload Project**

   - Click "Upload Project"
   - Fill in project details
   - Upload screenshots (max 5)
   - Submit for admin approval

4. **Request Collaboration**

   - Click "📩 Request" on project cards
   - Write a message
   - Wait for owner/admin approval

5. **Manage Your Profile**
   - Click profile icon in navbar
   - View statistics
   - Handle incoming collaboration requests
   - Update information

### **For Admins**

1. **Register as Admin**

   - Use authorized email to register
   - Access Admin Dashboard from navbar

2. **Manage Students**

   - View all students
   - Edit details or change passwords
   - Suspend or delete accounts

3. **Moderate Projects**

   - Approve or reject pending projects
   - Delete inappropriate content

4. **Send Bulk Emails**

   - Select recipients
   - Compose message
   - Attach files if needed
   - Send to students

5. **Monitor Activity**
   - View activity logs
   - Check leaderboard
   - Review statistics

---

## 🌐 API Documentation

### **Base URL**

```
http://localhost:8080/api
```

### **Authentication Endpoints**

#### Register Student

```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@college.edu",
  "password": "password123",
  "rollNumber": "21MCA001",
  "course": "MCA",
  "semester": 1
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@college.edu",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "role": "STUDENT",
  "userName": "John Doe"
}
```

### **Project Endpoints**

#### Get All Projects

```http
GET /projects/search?name={name}&course={course}&techStack={tech}
Authorization: Bearer {token}
```

#### Upload Project

```http
POST /projects/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

projectData: JSON
screenshots: File[]
```

#### Like/Unlike Project

```http
POST /projects/{projectId}/like
Authorization: Bearer {token}
```

### **Admin Endpoints**

#### Get Student Leaderboard

```http
GET /admin/leaderboard?limit=10
Authorization: Bearer {token}
```

#### Approve Project

```http
PUT /admin/projects/{projectId}/approve
Authorization: Bearer {token}
```

#### Clear All Activity Logs

```http
DELETE /activity-logs/clear-all
Authorization: Bearer {token}
```

---

## 👥 User Roles

### **STUDENT**

- Default role for registered users
- Can upload and manage own projects
- Can request collaboration
- Can like projects

### **ADMIN**

- Special role with elevated privileges
- Can moderate all content
- Can manage users
- Can send bulk emails
- Can view activity logs

---

## 🎨 Design Highlights

- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Color-Coded Status** - Visual feedback with gradients and shadows
- **Toast Notifications** - Real-time user feedback
- **Loading States** - Skeleton screens and spinners
- **Empty States** - Friendly messages when no data

### **Color Scheme**

- Primary: `#4F46E5` (Indigo)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Danger: `#ef4444` (Red)
- Pending: `#f59e0b` (Yellow/Orange)

---

## 📸 Screenshots

### Student Interface

- Home page with feature highlights
- Project browsing with filters
- Project upload form
- Student profile dashboard

### Admin Interface

- Admin dashboard with tabs
- Student management table
- Leaderboard with rankings
- Bulk email composer

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Suraj Pujari**

- GitHub: [@pujarisuraj](https://github.com/pujarisuraj)
- Email: surajpujari8383@gmail.com

---

## 🙏 Acknowledgments

- MIT Vishwaprayag University - For project guidance
- React Team - For the amazing frontend framework
- Spring Team - For the robust backend framework
- Lucide - For beautiful icons

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ for student collaboration**

</div>
