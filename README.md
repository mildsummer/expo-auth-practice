# expo-auth-practice

Expo + Firebase Authenticationのサンプルです。  
目的については以下Qiita記事を参照してください。  

* [Expo + Firebase Auth覚え書き](https://qiita.com/mildsummer/items/553840293a18553a4b80)
* [Expo + Firebase Authでパスワード再設定・メール確認覚え書き](https://qiita.com/mildsummer/items/e6c9588865b5a661aebc)
* [Expo + Firebase Auth で電話番号認証](https://qiita.com/mildsummer/items/1940f430d4191b5c5fd9)

Firebase側のコードは[こちら](https://github.com/mildsummer/expo-auth-practice-firebase)

## 使い方
インストールと実行に関しては通常のExpoプロジェクトと同じです。  
実行には環境設定が必要です。
Firebaseプロジェクトを作成し、上記の記事を参考に`.env`ファイルを作成してください。
  
```text:.env
GOOGLE_AUTH_IOS_CLIENT_ID=<clientId>
FIREBASE_API_KEY=<apiKey>
FIREBASE_AUTH_DOMAIN=<authDomain>
FIREBASE_DATABASE_URL=<databaseURL>
FIREBASE_PROJECT_ID=<projectId>
FIREBASE_STORAGE_BUCKET=<storageBucket>
FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
FIREBASE_APP_ID=<appId>
FIREBASE_MEASUREMENT_ID=<measurementId>
CAPTCHA_URL_BASE=<url of captcha html>
```
