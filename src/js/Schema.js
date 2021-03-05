export const FolderSchema = {
  name: 'Folder',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    frontLangCode: 'string',
    backLangCode: 'string',
    displayStarFrom: 'int',
    displayStarTo: 'int',
    createdAt: 'date',
  },
};

export const WordSchema = {
  name: 'Word',
  primaryKey: 'id',
  properties: {
    id: 'string',
    folderId: 'string',
    frontWord: 'string',
    backWord: 'string',
    proficiencyLevel: 'int',
    order: 'int',
    createdAt: 'date',
  },
};
