# ポートフォリオ

AWS Serverlessアーキテクチャを採用した、技術スニペット共有のためのバックエンドAPIです。
Infrastructure as Code (IaC) ツールである **AWS CDK** を用いて、インフラ構築の完全自動化を行っています。

## 🚀 デモサイト
**[こちらから実際に動作を確認いただけます] (https://snippet-portfolio.vercel.app/)**
※データの保存・取得がリアルタイムに行えます。

## 🛠 使った技術
* Frontend: HTML5, CSS3, JavaScript (Vercelでホスティング)
* Backend: Node.js, TypeScript (AWS Lambda)
* Database: Amazon DynamoDB
* Infrastructure: AWS CDK (Infrastructure as Code)
* API: Amazon API Gateway

## 🏗 Architecture (構成図)

```mermaid
graph LR
    User((ユーザー)) -->|ブラウザ| Vercel["Vercel (Frontend)"]
    Vercel -->|APIリクエスト| APIGW[API Gateway]
    APIGW -->|起動| Lambda["AWS Lambda (Node.js/TypeScript)"]
    Lambda -->|保存・取得| DDB[(DynamoDB)]