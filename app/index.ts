// app/index.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || '';

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json"
};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("リクエスト受信:", JSON.stringify(event));

  try {
    // 【POST】データを新しく保存する処理
    if (event.httpMethod === 'POST' && event.body) {
      const body = JSON.parse(event.body);
      const item = {
        id: uuidv4().slice(0, 8),
        title: body.title || '無題',
        code: body.code || '',
        language: body.language || 'text',
        createdAt: new Date().toISOString()
      };
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return { statusCode: 201, headers, body: JSON.stringify(item) };
    }

    // 【GET】指定したIDのデータを読み込む処理
    if (event.httpMethod === 'GET' && event.pathParameters?.id) {
      const { id } = event.pathParameters;
      const data = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
      if (!data.Item) return { statusCode: 404, headers, body: JSON.stringify({ msg: '見つかりません' }) };
      return { statusCode: 200, headers, body: JSON.stringify(data.Item) };
    }

    // ★★★ これが抜けていました！ 【GET】すべての一覧を取得する処理 ★★★
    if (event.httpMethod === 'GET') {
      const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME, Limit: 20 }));
      return { statusCode: 200, headers, body: JSON.stringify(data.Items || []) };
    }

    return { statusCode: 400, headers, body: '不正なリクエストです' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'サーバーエラー' }) };
  }
};