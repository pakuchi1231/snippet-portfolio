// infra-cdk/lib/infra-cdk-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class InfraCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. データベース (DynamoDB) を作る指示
    const table = new dynamodb.Table(this, 'SnippetTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // 使った分だけ課金（基本無料）
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 練習用: スタック削除時にDBも消す
    });

    // 2. プログラム (Lambda) を作る指示
    const fn = new nodejs.NodejsFunction(this, 'SnippetFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      // 先ほど作った app フォルダの index.ts を中身として使います！
      entry: path.join(__dirname, '../../app/index.ts'), 
      handler: 'handler',
      environment: { 
        TABLE_NAME: table.tableName // Lambdaにデータベースの名前を教える
      },
    });

    // Lambdaがデータベースを読み書きしていいよ、という権限を与える
    table.grantReadWriteData(fn);

    // 3. 外部からアクセスするためのURL (API Gateway) を作る指示
    const api = new apigateway.RestApi(this, 'SnippetApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS, // どこからでもアクセスOK
      }
    });

    // URLとLambdaを紐付ける
    const integration = new apigateway.LambdaIntegration(fn);
    const snippets = api.root.addResource('snippets');
    
    // 使える通信方法を設定する
    snippets.addMethod('GET', integration);  // 一覧取得
    snippets.addMethod('POST', integration); // 新規作成
    snippets.addMethod('PUT', integration);    // 【追加】更新（編集）
    snippets.addMethod('DELETE', integration); // 【追加】削除
    snippets.addResource('{id}').addMethod('GET', integration); // 詳細取得
  }
}