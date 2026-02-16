# 🐾 PetCare App - Comprehensive Pet Management App

PetCare Connect is an all-in-one mobile ecosystem designed to simplify pet ownership by integrating health tracking, e-commerce, and social networking into a single platform. The app empowers pet parents to manage medical records with automated VET reminders while offering a specialized shop and professional service bookings tailored to their pet's needs. Built for high performance, it utilizes Firebase for real-time data and Cloudinary for optimized image delivery. Whether you're tracking vaccinations or sharing pet milestones in the social feed, PetCare Connect ensures your pet's well-being is always a priority.

---

## ✨ Key Features

* **🔐 Secure Auth:** Reliable Login/Register with persistent user sessions.
* **🏠 Smart Dashboard:** Quick overview of pets, reminders, and easy navigation.
* **🛒 Pet Shop:** Category filtering (Dogs/Cats), smart cart, and seamless checkout.
* **🏥 Health Hub:** Track medical records & VET visits with **Auto-Push Notifications**.
* **🐕 Services:** Book professional groomers and trainers directly via the app.
* **📱 Social Feed:** Share pet updates and photos with a community of pet lovers.
* **👤 Dual Profiles:** Manage both owner and multiple pet profiles (CRUD).

---

## 🛠️ Tech Stack

* **Framework:** React Native (Expo)
* **Language:** TypeScript
* **State Management:** Redux Toolkit
* **Backend/Database:** Firebase (Authentication & Firestore)
* **Local Notifications:** Expo Notifications
* **UI/UX:** Vector Icons, KeyboardAvoidingView, and Custom Styled Components

---
## ☁️ Optimized Image Management (Firebase + Cloudinary)

To ensure high performance and low database costs, the app uses a hybrid cloud strategy:

* **Image Hosting:** All images (Pets, User Profiles, Social Posts) are uploaded to **Cloudinary**.
* **Database:** Only the optimized **CDN URL** is stored in **Firebase Firestore**.
* **Efficiency:** This reduces Firestore storage usage and ensures lightning-fast image loading for users.

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/petcare-connect.git](https://github.com/yourusername/petcare-connect.git)

---

## 📂 Folder Structure

```text

📁 PET-CARE (Root)
├── 📁 .expo                # Expo configuration files
├── 📁 .vscode              # VS Code workspace settings
├── 📁 app                  # Main application screens and logic
│   ├── AddAppointmentScreen.tsx
│   ├── AddProductScreen.tsx
│   ├── AskFidoScreen.tsx
│   ├── CartScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── index.tsx           # Entry point (AppContent)
│   ├── LoginScreen.tsx
│   ├── MyAppointmentsScreen.tsx
│   ├── MyProfileScreen.tsx
│   ├── PetMedicalReportsScreen.tsx
│   ├── ProductDetailsScreen.tsx
│   ├── ProfileEditScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── ServiceDetailsScreen.tsx
│   ├── ServiceMenuScreen.tsx
│   ├── ServiceProvidersScreen.tsx
│   ├── ShopScreen.tsx
│   └── SocialiseScreen.tsx
├── 📁 assets               # Images, fonts, and static files
├── 📁 component            # Reusable UI components (buttons, cards)
├── 📁 components           # Additional UI elements
├── 📁 config               # Firebase and third-party configurations
│   └── firebase.ts
├── 📁 constants            # App constants (Colors, Strings)
├── 📁 hooks                # Custom React hooks
├── 📁 navigations          # Navigation stacks (Root, Profile, Shop, etc.)
│   ├── ProfileStack.tsx
│   ├── RootNavigator.tsx
│   ├── ServiceStack.tsx
│   └── ShopStack.tsx
├── 📁 node_modules         # Installed packages
├── 📁 redux                # Redux store and slices
│   ├── cartSlice.ts
│   └── store.ts
├── 📁 scripts              # Deployment or utility scripts
├── 📁 services             # API and database service functions
│   ├── authService.ts
│   ├── cartService.ts
│   ├── medicalService.ts
│   └── notificationService.ts
├── 📁 store                # Global store configuration
├── 📁 utils                # Helper functions and validators
│   └── validators.ts
├── app.json                # Expo app configuration
├── babel.config.js         # Babel compiler settings
├── eas.json                # Expo Application Services config
├── global.css              # Global styles (Tailwind/NativeWind)
├── metro.config.js         # Metro bundler config
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
└── tsconfig.json           # TypeScript configuration
```
---

## 🚀 Installation & Setup

Follow these steps to get the project running locally on your machine:

### 1. Clone the Repository
```bash
git clone [https://github.com/yashodha-gunawardana/plants-care-app-AMD.git](https://github.com/yashodha-gunawardana/plants-care-app-AMD.git)
cd plants-care-app-AMD

```
### 2. Install Dependencies
```bash
npm install

```

### 3. Install Expo CLI (If not already installed)
To manage the project and run it on your device, you need the Expo CLI:
```bash
npm install -g expo-cli

```
Check installation:
```bash
expo --version

```

### 4. Configure Firebase

Create a Firebase project at https://firebase.google.com.

Enable Authentication (Email & Password) and Firestore Database.

Create a config/firebase.ts file and add your configuration:

```bash
export const firebaseConfig = {
   apiKey: "YOUR_API_KEY",
   authDomain: "YOUR_AUTH_DOMAIN",
   projectId: "YOUR_PROJECT_ID",
   storageBucket: "YOUR_STORAGE_BUCKET",
   messagingSenderId: "YOUR_MESSAGING_ID",
   appId: "YOUR_APP_ID",
};
```
### 5. Start the App
Start the development server:
```bash
expo start

```
This opens the Expo Developer Tools in your browser.

### 6. Open the App
Physical Device: Use the Expo Go app to scan the QR code.

Emulator/Simulator: Run on Android Studio or Xcode simulator.

✨ The app should now be running locally!

************************************************************************************************************************************************************************

## 📲 Download & Demo
[![Expo Build](https://img.shields.io/badge/Expo-Go-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/artifacts/eas/tV5gD4dfCRLj3ea6mbV1d7.apk)

************************************************************************************************************************************************************************

## 📸 App Screenshots
| Login Page |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/44691a4e-17ed-4b85-9eaa-f08a95b35927" />

| Register Page |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/8dcbe1e4-2e07-401d-943f-50517523b7d7" />

| Dashboard |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/200dff95-8752-4509-8ae3-ae7f08f76ae3" />
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/3d914c90-6bf9-4899-9c27-52816882f5cd" />
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/a48b8b80-00c9-4af1-9372-f3056826c9d4" />


Add Pet Screen
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/648018a5-712f-4c2b-87b4-e0f302a0c608" />


| Shop Screen |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/67a8f7b2-ffff-49f6-a0e8-e8a850ab3db0" />
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/80e7206b-420d-471b-a5c5-2f74009ba072" />
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/cb3fd150-9f9f-447f-82fe-ebdceed3529c" />
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/dd268b4a-be2a-4a1b-b976-70b7ff62af91" />


Cart Screen
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/8551106b-5b54-4cf8-8d02-6f0f60d2f1e5" />

Order Screen
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/d2f9de9e-189d-4377-a07f-f1a734b0d017" />

| Services Screen |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/6b8565cd-6df7-49eb-8d2b-c1cd99e56d6d" />

| Service Providers |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/7b23675e-0989-4afa-8e4f-2aaa26cd4bdb" />

| Service Booking Screen |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/4a3146f1-1a1c-405e-9639-86971945f189" />
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/179a58e9-837c-4ba2-a707-8ce7426c89d1" />

My Appointments Screen
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/58c62eef-72da-4b8d-bfd1-372837699b13" />

| Socialise Screen |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/2993edb6-9ccc-4695-ad85-2ae998e33faf" />
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/869a14de-0de5-41ea-9d03-f2c6cb29729a" />


Add Post Screen
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/6319a15a-c8c4-48a2-af1a-a6861ef30d52" />

| Profile Screen |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/906ac6c1-918f-4a71-86eb-be7c1fb6445d" />

User Profile Edit Screen
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/48ffb04e-e431-49d9-98f3-01bcb103be79" />

Pet Profile Edit Screen
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/07770583-cd86-4ce2-b610-48c2042256d5" />

Notification Screen
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/0beabd62-424c-4f0e-8df4-0d8908487c4f" />

| AI Screen |
---
<img width="250" height="1520" alt="image" src="https://github.com/user-attachments/assets/8c2c6f89-7470-4e24-b923-d64185bddd1c" />








