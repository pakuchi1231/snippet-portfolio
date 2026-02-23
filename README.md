# ポートフォリオ

インフラ構築からフロントエンドのデプロイまで、担当しました。
実際のサイトや使った技術については以下のとおりです。

## 🚀 デモサイト
**[こちらから実際に動作を確認いただけます] (https://snippet-portfolio.vercel.app/)**
※データの保存・取得がリアルタイムに行えます。

## 🛠 使った技術
今回は2つのIaCツールを採用し、同じインフラを構築・管理できる構成にしています。
* Frontend: HTML5, CSS3, JavaScript (Vercelでホスティング)
* Backend: Node.js, TypeScript (AWS Lambda)
* Database: Amazon DynamoDB
* Infrastructure: AWS CDK (Infrastructure as Code) , Terraform
* API: Amazon API Gateway

## 📂 フォルダ構成
* frontend/: ブラウザ用ソースコード
* app/: AWS Lambda用ロジック（TypeScript）
* infra-cdk/: AWS CDK用定義
* infra-tf/: Terraform用定義

## 🏗 Architecture (構成図)

```mermaid
graph LR
    User((ユーザー)) -->|ブラウザ| Vercel["Vercel (Frontend)"]
    Vercel -->|APIリクエスト| APIGW[API Gateway]
    APIGW -->|起動| Lambda["AWS Lambda (Node.js/TypeScript)"]
    Lambda -->|保存・取得| DDB[(DynamoDB)]