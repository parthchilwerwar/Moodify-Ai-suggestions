import assert from 'node:assert/strict';
import { test } from 'node:test';
import { NextRequest } from 'next/server';

delete process.env.GROQ_API_KEY;

test('playlist route loads without a configured Groq key', async () => {
  const { POST } = await import('../app/api/generate-playlist/route');
  const response = await POST(new NextRequest('http://localhost/api/generate-playlist', {
    method: 'POST',
    body: JSON.stringify({ mood: 'happy' }),
    headers: { 'Content-Type': 'application/json' },
  }));
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'Playlist generation is not configured' });
});

for (const body of ['{', 'null', '[]', '{}', '{"mood":42}', '{"mood":"  "}', '{"mood":"😀"}']) {
  test(`playlist route rejects invalid input: ${body}`, async () => {
    const { POST } = await import('../app/api/generate-playlist/route');
    const response = await POST(new NextRequest('http://localhost/api/generate-playlist', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    }));
    assert.equal(response.status, 400);
  });
}
