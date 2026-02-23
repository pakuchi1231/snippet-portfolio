import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
  };

  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    // [追加] 削除機能 (DELETE)
    if (event.httpMethod === 'DELETE' && event.body) {
      const body = JSON.parse(event.body);
      if (!body.id) throw new Error('IDが指定されていません');

      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: body.id }
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: '削除に成功しました' }),
      };
    }

    if (event.httpMethod === 'POST' && event.body) {
      const body = JSON.parse(event.body);
      const item = {
        id: uuidv4(),
        title: body.title,
        language: body.language,
        code: body.code,
        createdAt: new Date().toISOString(),
      };

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      }));

      return { statusCode: 201, headers, body: JSON.stringify(item) };
    }

    if (event.httpMethod === 'GET') {
      const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
      return { statusCode: 200, headers, body: JSON.stringify(result.Items || []) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ message: 'Unsupported route' }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};