import { NextRequest, NextResponse } from 'next/server';
import { HttpAIProvider, runTutor } from '@/lib/ai';
export const runtime = 'nodejs';
export const maxDuration = 60;
let active = 0;
export async function POST(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };
  if (request.headers.get('origin') !== request.nextUrl.origin)
    return NextResponse.json(
      { error: '同一オリジンから利用してください。' },
      { status: 403, headers },
    );
  if (!process.env.AI_API_KEY || !process.env.AI_MODEL || !process.env.AI_BASE_URL)
    return NextResponse.json(
      { error: 'AI未設定です。READMEに従ってサーバーのAI環境変数を設定してください。' },
      { status: 503, headers },
    );
  if (active >= 2)
    return NextResponse.json(
      { error: 'AIが混雑しています。しばらくして再試行してください。' },
      { status: 429, headers },
    );
  active++;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw Error('Empty request');
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 16000) {
        await reader.cancel();
        return NextResponse.json({ error: '入力が長すぎます' }, { status: 413, headers });
      }
      chunks.push(value);
    }
    const raw = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    return NextResponse.json(await runTutor(raw, new HttpAIProvider()), { headers });
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    const safe = ['Objectiveが', 'このObjective', 'AI提供元', 'AI未設定'].some((prefix) =>
      message.startsWith(prefix),
    );
    return NextResponse.json(
      { error: safe ? message : '入力またはAI応答の検証に失敗しました。問題は保存していません。' },
      { status: 422, headers },
    );
  } finally {
    active--;
  }
}
