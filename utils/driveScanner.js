const { google } = require('googleapis');

const drive = google.drive({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
});

async function scanDriveStructure(folderId) {
  const structure = [];

  async function listFolderContents(parentId, sectionName = '') {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
      pageSize: 1000
    });

    const videos = [];
    for (const file of res.data.files) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        const subSection = await listFolderContents(file.id, file.name);
        if (subSection.videos.length > 0) structure.push(subSection);
      } else if (file.mimeType.startsWith('video/')) {
        const previewLink = `https://drive.google.com/file/d/${file.id}/preview`;
        videos.push({ name: file.name, preview: previewLink });
      }
    }

    return { section: sectionName, videos };
  }

  const result = await listFolderContents(folderId);
  if (result.videos.length > 0) structure.push(result);

  return structure;
}

module.exports = scanDriveStructure;
