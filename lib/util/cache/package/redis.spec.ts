import { commandOptions, createClient } from 'redis';

describe('util/cache/package/redis', () => {
  it('works', async () => {
    const client = createClient({
      url: 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          // Reconnect after this time
          return Math.min(retries * 100, 3000);
        },
      },
      pingInterval: 30000, // 30s
    });
    await client.connect();

    const buf = Buffer.from('test');
    await client.set('foo', buf, { EX: 10 * 60 });
    const x = await client.get(commandOptions({ returnBuffers: true }), 'foo');
    console.log(x);

    ///
    expect(true).toBeTrue();
  });
});
