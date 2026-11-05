// Cableado de la Lambda chat-agentes: conecta crearHandler con Bedrock y DynamoDB. Sin lógica propia.
// El SDK v3 viene incluido en el runtime de Lambda (Node 22).
import { readFileSync } from 'node:fs';
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { crearHandler } from './nucleo.mjs';

const contenido = JSON.parse(readFileSync(new URL('./contenido.json', import.meta.url), 'utf-8'));
const bedrock = new BedrockRuntimeClient({});
const dynamo = new DynamoDBClient({});

export const handler = crearHandler({
  contenido,
  topeUsd: Number(process.env.TOPE_USD),
  ahora: () => new Date(),
  invocar: async (sistema, mensajes) => {
    const r = await bedrock.send(new ConverseCommand({
      modelId: process.env.MODELO_ARN,
      system: [{ text: sistema }],
      messages: mensajes,
      inferenceConfig: { maxTokens: 300, temperature: 0.3 },
    }));
    return {
      texto: (r.output?.message?.content ?? []).map((c) => c.text ?? '').join(''),
      inputTokens: r.usage?.inputTokens ?? 0,
      outputTokens: r.usage?.outputTokens ?? 0,
    };
  },
  leerGasto: async (mes) => {
    const r = await dynamo.send(new GetItemCommand({ TableName: process.env.TABLA, Key: { mes: { S: mes } } }));
    return Number(r.Item?.microUsd?.N ?? 0) / 1e6;
  },
  sumarGasto: async (mes, usd) => {
    await dynamo.send(new UpdateItemCommand({
      TableName: process.env.TABLA,
      Key: { mes: { S: mes } },
      UpdateExpression: 'ADD microUsd :n',
      ExpressionAttributeValues: { ':n': { N: String(Math.ceil(usd * 1e6)) } },
    }));
  },
});
