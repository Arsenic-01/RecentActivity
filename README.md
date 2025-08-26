# Appwrite Function: `get-recent-activity`

## 1. Purpose

This is an on-demand, HTTP-triggered function that provides a unified and accurately sorted list of the most recent activities across multiple database collections.

The admin dashboard needs to show a feed of "what just happened," regardless of whether it was a new user signing up, a teacher uploading a note, or a new link being added. Fetching the last 2-3 items from each collection on the client-side is inefficient and inaccurate—the 3rd most recent note could be older than the 10th most recent user.

This function solves the problem by fetching a larger pool of recent items from all relevant collections on the server, merging them into a single list, sorting them by their creation date, and returning the *truly* most recent items overall.

---

## 2. Trigger

This function is designed to be executed via a **GET HTTP Request**.

Your frontend application (e.g., a Next.js Server Action) should call this function's endpoint to get the activity feed data whenever the dashboard is loaded.

---

## 3. Setup & Configuration

### 3.1. Environment Variables

The function requires the following environment variables to be set in your Appwrite function's settings:

| Variable                         | Description                                          | Example Value         |
| -------------------------------- | ---------------------------------------------------- | --------------------- |
| `APPWRITE_ENDPOINT`              | Your Appwrite project endpoint.                      | `https://cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT`               | Your Appwrite project ID.                            | `65a1b2c3d4e5f6a7b8c9` |
| `APPWRITE_API_KEY`               | A server-side API key with database read access.     | `your_secret_api_key` |
| `APPWRITE_DATABASE_ID`           | The ID of your main database.                        | `main_db`             |
| `APPWRITE_NOTE_COLLECTION_ID`    | The ID of your `Notes` collection.                   | `notes`               |
| `APPWRITE_USER_COLLECTION_ID`    | The ID of your `Users` collection.                   | `users`               |
| `APPWRITE_FORM_COLLECTION_ID`    | The ID of your `Forms` collection.                   | `forms`               |
| `APPWRITE_YOUTUBE_COLLECTION_ID` | The ID of your `YouTube Links` collection.           | `youtube_links`       |

---

## 4. Output

Upon successful execution, this function returns a `200 OK` response with a JSON array as the body. The array will contain up to 8 of the most recent activity objects, sorted chronologically.

**Example Response Body:**

```json
[
  {
    "type": "note",
    "title": "Advanced Calculus Chapter 5",
    "user": "Teacher A",
    "timestamp": "2025-08-27T10:30:00.000Z"
  },
  {
    "type": "user",
    "title": "New student registered",
    "user": "New Student Name",
    "timestamp": "2025-08-27T10:28:15.000Z"
  },
  {
    "type": "form",
    "title": "Quiz on Thermodynamics",
    "user": "Teacher B",
    "timestamp": "2025-08-27T09:55:45.000Z"
  }
]