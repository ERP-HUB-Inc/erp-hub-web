Here’s a **high-quality UI/UX prompt** you can use for designing or generating a **Next.js prototype** (e.g., with Figma AI, v0.dev, or any AI UI generator). I’ve structured it so it’s practical for real product development.

---

# 🎯 Full Design Prompt (Next.js UI / Prototype)

## 🧩 Product Overview

Design a modern **Document Management & Collaboration Platform** similar to Google Drive and Microsoft OneDrive, built with **Next.js (App Router)**, **Tailwind CSS**, and **component-based architecture**.

The platform must support:

* Document collaboration workflows
* File repository & organization
* Cloud storage-like experience (Drive-style UI)

---

# 1️⃣ Document Collaboration Module

## 🎯 Goal

Allow users to **create documents, attach metadata, assign collaborators, and upload files**.

## 🖥️ UI Requirements

### Page: `Create / Edit Document`

* Clean form layout (card-based UI)
* Sections:

  1. **Document Info**

     * Title (input)
     * Description (textarea)
     * Category (dropdown)
     * Tags (multi-select with chips)
  2. **File Upload**

     * Drag & drop zone
     * File preview (list/grid)
     * Upload progress indicator
  3. **Collaborators**

     * Add users (search autocomplete)
     * Roles:

       * Owner
       * Editor
       * Viewer
       * Observer
     * Avatar + role badge UI
  4. **Permissions Panel**

     * Toggle:

       * Public / Private
       * Share via link
     * Expiration date (optional)

## ⚙️ Interaction

* Real-time validation
* Optimistic UI when adding collaborators
* Toast notifications (success/error)

## 💡 Components

* `<DocumentForm />`
* `<FileUploader />`
* `<UserSelector />`
* `<PermissionSettings />`

---

# 2️⃣ Document Repository (Drive-like System)

## 🎯 Goal

Provide a **central file management system** like Google Drive.

## 🖥️ UI Layout

### Page: `Repository Dashboard`

* Left Sidebar:

  * My Files
  * Shared with Me
  * Recent
  * Starred
  * Trash

* Top Bar:

  * Search input (global search)
  * Filter (type, date, owner)
  * Sort dropdown

* Main Content:

  * Toggle:

    * Grid view
    * List view
  * File cards:

    * Icon (file type)
    * Name
    * Owner
    * Last modified
    * Actions (⋮ menu)

## 📂 File Actions

* Open
* Rename
* Move
* Share
* Delete
* Download

## ⚙️ Interaction

* Right-click context menu
* Drag & drop folder organization
* Infinite scroll or pagination

## 💡 Components

* `<FileGrid />`
* `<FileTable />`
* `<SidebarNav />`
* `<SearchBar />`
* `<FileContextMenu />`

---

# 3️⃣ OneDrive-like Experience (Advanced File Management)

## 🎯 Goal

Replicate advanced UX patterns inspired by Microsoft OneDrive

## 🖥️ UI Enhancements

* Breadcrumb navigation (folder hierarchy)
* Activity panel (right side)
* File preview panel (PDF, image, doc)
* Version history UI
* Shared link management

## 🔄 Key Features

* File versioning timeline
* Activity logs (who edited/viewed)
* Quick preview modal
* Bulk selection actions

## ⚙️ Interaction

* Multi-select (checkbox or drag)
* Keyboard shortcuts:

  * Delete
  * Rename
  * Copy/Paste
* Hover quick actions

## 💡 Components

* `<Breadcrumbs />`
* `<FilePreviewDrawer />`
* `<ActivityPanel />`
* `<VersionHistory />`

---

# 🎨 Design System

## Style

* Minimal, clean (like Google Drive)
* Rounded corners (2xl)
* Soft shadows
* Light & dark mode

## Colors

* Primary: Blue (cloud/storage theme)
* Neutral grayscale for layout
* Status:

  * Success: Green
  * Warning: Yellow
  * Error: Red

## Typography

* Headings: bold, large
* Body: clean, readable

---

# ⚛️ Next.js Technical Requirements

## Architecture

* App Router (`/app`)
* Server + Client Components separation
* API routes for file handling

## Suggested Structure

```
/app
  /dashboard
  /repository
  /document
/components
  /file
  /document
  /layout
/lib
  /api
  /hooks
```

## State Management

* React Query or SWR for data fetching
* Context or Zustand for global state

---

# ✨ Bonus Features (Optional)

* Real-time collaboration (WebSocket)
* Comments on documents
* Notifications system
* AI document tagging/search

---

# 🚀 Example Prompt for AI UI Generator

You can copy this directly into tools like v0.dev or Figma AI:

```
Design a modern document management web app using Next.js and Tailwind CSS.

Features:
1. Document collaboration form with file upload, collaborators, roles (owner, editor, viewer, observer), and permission settings.
2. File repository dashboard similar to Google Drive with sidebar navigation, grid/list view, search, filters, and file actions.
3. Advanced OneDrive-like UI with file preview panel, breadcrumbs, activity logs, and version history.

Style:
Minimal, clean, soft shadows, rounded corners, responsive layout, light/dark mode.

Components:
File grid, file table, sidebar, top navbar, uploader, collaborator selector, preview drawer.

Focus on usability, scalability, and modern SaaS design patterns.
```

---

If you want next step, I can:

* Convert this into **actual Next.js code (App Router + Tailwind)**
* Or design **API schema (NestJS + Firebase/S3)**
* Or create **DB schema for collaboration roles & permissions**

Just tell me 👍
