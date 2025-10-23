import { NextResponse } from 'next/server';

/**
 * GET handler for Farcaster account association and frame configuration
 * Returns account association data and frame metadata for Farcaster integration
 */
export async function GET() {
  return NextResponse.json(
    {
      accountAssociation: {
        header:
          'eyJmaWQiOjg1NjI4NiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGUxMzQyZGQ1NzUzYzQ1NDE3MDU0MTU3NDgxNjMyNkQwNmM2ZjAzMTgifQ',
        payload: 'eyJkb21haW4iOiJ2My50YWRsZS5jb20ifQ',
        signature:
          'MHg5MTNmMTNmMDc3YTUxZDE2MGQzYWYyNjYzMTRhYjM0OGJmNDQyMTkyOTY2NTk5OWY2ZGJkNTYwN2JiYTYzYmI3MWJmMjdiZGYwN2UwNjIxZTA1MjJhZWQ1OWY3ZTQ3ZGJjMjhjNjFmNzZkYjA5NDdlODAwNWRlZjZmNWU0MmJmZjFi',
      },
      frame: {
        version: 'next',
        imageUrl: 'https://cdn.tadle.com/images/thumbnail-1800_945.jpg',
        button: {
          title: 'Launch Frame',
          action: {
            type: 'launch_frame',
            name: 'Tadle',
            url: 'https://v3.tadle.com',
            splashImageUrl: 'https://cdn.tadle.com/images/thumbnail-1800_945.jpg',
            splashBackgroundColor: '#6e75f9',
          },
        },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
}