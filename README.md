# 🐾 PetCare - Smart Pet Management System

**PetCare** is a comprehensive mobile application built with **React Native (Expo)** designed to help pet owners manage their pets' health, medical history, and daily care routines with ease. 

The app features a modern, intuitive interface to track vet visits, vaccinations, and medications while ensuring data consistency through secure cloud synchronization.

---

## 📌 Project Overview
Caring for a pet requires meticulous tracking of medical records and schedules. **PetCare** simplifies this process by:
* **Managing Multiple Pets:** Create detailed profiles for all your pets in one place.
* **Tracking Medical History:** Log VET visits, vaccinations, and medication schedules.
* **Automated Reminders:** Never miss a check-up with integrated push notifications.
* **Data Persistence:** Seamlessly access your data even after app restarts using local storage persistence.

---

## ✨ Key Features

🌱 **Pet Profile Management**
* Add, edit, and delete pet profiles with custom images.
* View comprehensive history for each individual pet.

🏥 **Medical Records Tracking**
* Categorized logs for **VET Visits**, **Vaccines**, and **Medicine**.
* Automatic status tracking (e.g., "Completed").

⏰ **Smart Reminders & Notifications**
* Schedule reminders for upcoming medical tasks directly within the app.
* Permission-based push notification system for Android.

👤 **User Authentication & Security**
* Secure Login/Register via **Firebase Authentication**.
* **Auth Persistence:** Stays logged in even after closing the app using `AsyncStorage`.

🎨 **Modern & Responsive UI**
* Nature-inspired color palette with high-fidelity icons.
* Smooth transitions and tab-based navigation for a clean user experience.

---

## 🛠️ Technologies Used

* **Frontend:** React Native (Expo SDK 54)
* **Language:** TypeScript for type safety
* **Backend:** Firebase Firestore (Real-time Database)
* **Authentication:** Firebase Auth with AsyncStorage Persistence
* **Navigation:** Expo Router (File-based routing)
* **Styling:** NativeWind (Tailwind CSS for React Native)
* **Icons:** Expo Vector Icons (MaterialCommunityIcons)

---

## 📁 Folder Structure

```text
 pet-care/
 ├── app/                   # Expo Router screens & layouts
 │   ├── (auth)/            # Login & Registration flow
 │   ├── (tabs)/            # Main Dashboard & Navigation
 │   └── PetMedicalRecords/ # Medical history logic
 ├── assets/                # Images, splash screens, and icons
 ├── components/            # Reusable UI components
 ├── config/                # Firebase & Global configurations
 ├── services/              # API calls & Notification logic
 ├── constants/             # Theme colors and static values
 ├── app.json               # Expo & Plugin configuration
 ├── tsconfig.json          # TypeScript path mappings
 └── package.json           # Project dependencies
