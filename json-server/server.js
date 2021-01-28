const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const request = require('request');

const {google} = require('googleapis');
const {Storage} = require('@google-cloud/storage');

// const {TranslationServiceClient} = require('@google-cloud/translate').v3beta1;
const {TranslationServiceClient} = require('@google-cloud/translate');
const projectId = 'translate-api-295008';
const location = 'global';
const text = 'こんにちは！今日も良い天気ですね。';

// ルータ↓↓↓ ここを修正↓↓↓***************************************************************
server.use(
  jsonServer.rewriter({
    /** ユーザー情報取得API */
    '/api/words': '/words',
    // "/api/translate": "/translate"
    //,"/api/get/users*": "/get_users_v1_ERROR"
  }),
);
// ルータ↑↑↑ ここを修正↑↑↑***************************************************************

// ミドルウェアの設定 (コンソール出力するロガーやキャッシュの設定など)
server.use(middlewares);
var num_get_users = 1;
var num_get_name = 1;
// server.use(function (req, res, next) {
//    req.query = {};
//    console.log(req.query);
//    console.log(req.body);
//    console.log(req);
//    console.log(res);

// } else {

//   req.query = req.params;
//   req.params = null;
// }

//↓↓↓↓↓↓カスタマイズはここで変更↓↓↓↓↓↓******************************************
// 返却ステータス設定---------------------------------------
//console.log(req.originalUrl);
server.get('/api/translate', async function (req, res) {
  console.log(req.query.beforeWord, req.query.beforeLang, req.query.afterLang);

  // const auth = new google.auth.GoogleAuth({
  //   keyFilename: './translate-api-e48942ab872c.json',
  //   scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  // });
  // const authClient = await auth.getClient();
  // google.options({ auth: authClient });

  const keyFilename = './translate-api-295008-51b865fa85db.json';
  const storage = new Storage({projectId, keyFilename});
  // Makes an authenticated API request.

  // try {
  //   const results = await storage.getBuckets();

  //   const [buckets] = results;

  //   console.log('Buckets:');
  //   buckets.forEach((bucket) => {
  //     console.log(bucket.name);
  //   });
  // } catch (err) {
  //   console.error('ERROR:', err);
  // }

  const translationClient = new TranslationServiceClient({
    projectId,
    keyFilename,
  });
  // Construct request
  const request = {
    parent: translationClient.locationPath(projectId, location),
    contents: [req.query.beforeWord],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: req.query.beforeLang,
    targetLanguageCode: req.query.afterLang,
  };
  // Run request
  const response = await translationClient.translateText(request);

  console.log(`response: ${JSON.stringify(response)}`);
  const outputText = response[0].translations[0].translatedText;
  console.log(`Translation: ${response[0].translations[0].translatedText}`);

  var res_data = {
    text: outputText,
  };

  res.status(200).jsonp(res_data);
});

// if (req.originalUrl=='/api/get/users*') {
// res.statusCode=400;
// } else if  (req.originalUrl=='/api/get/name*') {
// res.statusCode=200;
// } else if  (req.originalUrl=='/api/get/age*') {
// res.statusCode=200;
// }

// // 同一APIを複数回呼び出す場合、レスポンス設定-------------
// if (req.originalUrl=='/api/get/users') {
//     // 奇数回目アクセスの場合
//     if (num_get_users % 2 == 0) {
//     res.req.url = '/get_users_v1_ZERO';
//     //res.req.url = '/get_users_v1_ERROR';
//     }
//     num_get_users++;
// }

// if (req.originalUrl=='/api/get/name') {
//     // 二回目アクセスの場合
//     if (num_get_name == 2) {
//     //res.req.url = '/get_name';
//     }
//     num_get_name++;
// }
//↑↑↑↑↑↑カスタマイズはここで変更↑↑↑↑↑↑******************************************
// Continue to JSON Server router
// next()
// })
// db.json をもとにデフォルトのルーティングを設定する
server.use(router);
// サーバをポート 8080 で起動する
server.listen(8080, () => {
  console.log('JSON Server is running');
});
