Here’s a **refined, production-ready UI prompt** tailored to your screenshot style and requirement (ASEAN branding + Microsoft AD login as primary + fallback login):

---

# 🎯 Login Screen UI Prompt (ASEAN System with Microsoft AD)

## 🧩 Context

Design a **modern enterprise login screen** for an ASEAN internal system, inspired by the layout of Association of Southeast Asian Nations portal UI.

The screen must support:

* Primary login via Microsoft Azure Active Directory (SSO)
* Secondary login via username/password (external users)

---

# 🖥️ Layout Structure

## 🌆 Split Screen Layout (Same as Image)

* **Left Side (70%)**

  * Full-height background image (ASEAN building or regional landmark)
  * Slight dark overlay (for contrast)
  * Optional tagline:

    * “Secure ASEAN Risk Management Platform”

* **Right Side (30%)**

  * Centered login card
  * Light gray or white background
  * Soft shadow, rounded corners

---

# 🔐 Login Card UI

## 🏷️ Header

* ASEAN logo (top center)
* Title:

  * “ASEAN Risk Management System”
* Subtitle:

  * “Secure access for internal and external users”

---

## 🟦 Primary Login (SSO - Microsoft AD)

* Large primary button:

  * Label: **“Sign in with Microsoft”**
  * Icon: Microsoft logo (left)
  * Style:

    * Blue button (#2563EB or Microsoft blue)
    * Full width
    * Rounded-lg

* Behavior:

  * Redirect to Azure AD SSO
  * Show loading spinner on click

---

## ➖ Divider

* Horizontal divider with text:

  * “OR”
  * subtle gray line

---

## 🔑 Secondary Login (External Access)

### Form Fields

* Email Address (input)
* Password (input with show/hide toggle)

### Options

* “Remember me” checkbox
* “Forgot password?” link

### Button

* Label: **“Login with Credentials”**
* Secondary style (outline or muted color)

---

# ⚙️ Interaction & UX

* Input validation (email format, required fields)
* Error states:

  * Invalid credentials
  * Unauthorized access
* Loading states:

  * Button spinner
* Accessibility:

  * Keyboard navigation
  * Focus states

---

# 🎨 Design Style

## Theme

* Clean enterprise UI (similar to Microsoft / OneDrive style)
* Minimal, professional

## Colors

* Primary: ASEAN blue / Microsoft blue
* Neutral: gray-100 to gray-700
* Accent: subtle red for errors

## Typography

* Title: bold, large
* Inputs: clean and readable

---

# ⚛️ Next.js Implementation Notes

* Use App Router (`/app/login`)

* Components:

  * `<LoginCard />`
  * `<MicrosoftLoginButton />`
  * `<CredentialLoginForm />`

* Auth integration:

  * Microsoft SSO via:

    * MSAL.js or NextAuth with Azure AD
  * Credential login via API route

---

# ✨ AI Generator Prompt (Copy & Paste)

```txt
Design a modern enterprise login page for an ASEAN system using Next.js and Tailwind CSS.

Layout:
- Split screen (70% left image, 30% right login panel)
- Left side: ASEAN building image with dark overlay and tagline
- Right side: centered login card with ASEAN logo and title

Login Options:
1. Primary: “Sign in with Microsoft” button (Azure AD SSO, large, blue, with Microsoft icon)
2. Divider with “OR”
3. Secondary: email + password form for external users

Features:
- Input validation
- Error messages
- Loading states
- Remember me checkbox
- Forgot password link

Style:
- Clean, modern, enterprise UI (similar to Microsoft OneDrive)
- Rounded corners, soft shadows
- Responsive design

Components:
Login card, SSO button, credential form

Focus on usability, security, and professional government-style design.
```

---
