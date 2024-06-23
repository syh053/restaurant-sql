# 餐廳清單
這是使用 express 與 express-handlebars 簡易打造的餐廳清單

## 專案畫面

(新增) 使用者登入頁

![image](https://imgur.com/HHLBjSF)

(新增) 使用者註冊頁

![image](https://imgur.com/1DBBsQw)

登入後頁面

![image](https://imgur.com/pQsxOIE)

查看單一餐廳

![image](https://github.com/syh053/restaurant-sql/blob/main/image/detail.png)


## 產品功能

1. 使用者可以新增一家餐廳
2. 使用者可以瀏覽一家餐廳的詳細資訊
3. 使用者可以瀏覽全部所有餐廳
4. 使用者可以修改一家餐廳的資訊
5. 使用者可以刪除一家餐廳

## 提醒

1. 操做失敗時會重新導向頁面並顯示訊息
2. 此網站擴充了分頁功能
3. 此網站擴充了頁面分類功能

## 如何使用

1. 開啟終端機，Clone 此專案至本機電腦

```
git clone https://github.com/syh053/restaurant-sql.git
```
___

2. 使用 npm 安裝所需套件

```
npm i
```

___

3. 安裝 nodemon 套件(全局安裝)

```
npm install -g nodemon
```

4. (更新) 依據 .env 檔案設定環境境變數，.env.example 說明了需要設定哪些環境變數

___

5. 啟動方式

 ```
npm run dev
```

## 使用補充

1. 設定環變數


## 更新內容

- 使用者可以註冊帳號，註冊內容為 : 名字、email、密碼、確認密碼。

- 使用者可以透過 Facebook Login 直接登入。

- 使用者的密碼經過 bcrypt 處理。

- 使用者必須登入後才能進入餐廳清單頁面。

    - 使用使若沒登入，會被導向登入頁面。

    - 登入後，使用者可以建立並管理專屬他的一個餐廳清單。

- 使用者登出、註冊失敗、或登入失敗時，使用者都會在畫面上看到正確而清楚的系統訊息。

- 新增 users 種子資料 `user1@example.com` 及 `user2@example.com`