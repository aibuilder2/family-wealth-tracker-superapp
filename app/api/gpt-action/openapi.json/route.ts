import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Family Wealth & Stock SuperApp API',
      description: 'ChatGPT Action plugin to view family cashflow, member ledgers, goals and rental businesses.',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'https://family-wealth-tracker-tawny.vercel.app'
      }
    ],
    paths: {
      '/api/gpt-action': {
        get: {
          summary: 'Get Family Financial Summary and Member Hisab',
          operationId: 'getFamilySummary',
          parameters: [
            {
              name: 'action',
              in: 'query',
              required: false,
              schema: { type: 'string', default: 'summary' }
            },
            {
              name: 'family_id',
              in: 'query',
              required: false,
              schema: { type: 'string', default: 'fam-1' }
            }
          ],
          responses: {
            '200': {
              description: 'Successful response with family financial metrics.'
            }
          }
        },
        post: {
          summary: 'Query Family AI Advisor',
          operationId: 'queryAdvisor',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    action: { type: 'string' },
                    query: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Advisor response returned successfully.'
            }
          }
        }
      }
    }
  };

  return NextResponse.json(spec);
}
