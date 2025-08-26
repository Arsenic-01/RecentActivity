// Function: get-recent-activity
// Trigger: HTTP Request (GET)

import { Client, Databases, Query } from 'node-appwrite';

export default async ({ res, log, error }) => {
  const {
    APPWRITE_DATABASE_ID,
    APPWRITE_NOTE_COLLECTION_ID,
    APPWRITE_USER_COLLECTION_ID,
    APPWRITE_YOUTUBE_COLLECTION_ID,
    APPWRITE_FORM_COLLECTION_ID,
  } = process.env;

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new Databases(client);

  try {
    log('Fetching recent activities from all collections...');

    // Fetch a larger pool of recent items from each collection
    const [recentNotes, recentUsers, recentYoutube, recentForms] =
      await Promise.all([
        db.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_NOTE_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(10),
        ]),
        db.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_USER_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(10),
        ]),
        db.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_YOUTUBE_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(10),
        ]),
        db.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_FORM_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(10),
        ]),
      ]);

    // Map all documents to a unified activity format
    const activities = [
      ...recentNotes.documents.map((doc) => ({
        type: 'note',
        title: doc.title,
        user: doc.userName || 'Unknown',
        timestamp: doc.$createdAt,
      })),
      ...recentUsers.documents.map((doc) => ({
        type: 'user',
        title: `New ${doc.role} registered`,
        user: doc.name,
        timestamp: doc.$createdAt,
      })),
      ...recentYoutube.documents.map((doc) => ({
        type: 'youtube',
        title: doc.title,
        user: doc.createdBy,
        timestamp: doc.$createdAt,
      })),
      ...recentForms.documents.map((doc) => ({
        type: 'form',
        title: doc.title,
        user: doc.createdBy,
        timestamp: doc.$createdAt,
      })),
    ];

    // Sort the combined list to find the truly most recent items
    activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Return the top 8 most recent activities overall
    const finalActivities = activities.slice(0, 8);
    log(`Recent Activities: ${JSON.stringify(finalActivities)}`);
    log(`Successfully compiled ${finalActivities.length} recent activities.`);

    return res.json(finalActivities);
  } catch (e) {
    error('Error fetching recent activity:', e);
    return res.json({ success: false, error: e.message }, 500);
  }
};