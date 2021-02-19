export const FolderSchema = {
  name: 'Folder',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    defaultFrontLang: 'string',
    defaultBackLang: 'string',
    createdAt: 'date',
  },
};

export const WordSchema = {
  name: 'Word',
  primaryKey: 'id',
  properties: {
    id: 'string',
    frontWord: 'string',
    frontLang: 'string',
    backWord: 'string',
    backLang: 'string',
    createdAt: 'date',
    folderId: 'string',
  },
};
