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
  },
};
