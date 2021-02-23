export const FolderSchema = {
  name: 'Folder',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    frontLangCode: 'string',
    backLangCode: 'string',
    createdAt: 'date',
  },
};

export const WordSchema = {
  name: 'Word',
  primaryKey: 'id',
  properties: {
    id: 'string',
    frontWord: 'string',
    backWord: 'string',
    createdAt: 'date',
    folderId: 'string',
  },
};
