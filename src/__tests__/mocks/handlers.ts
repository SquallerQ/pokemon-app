import { http } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', () => {
    return new Response(
      JSON.stringify({
        count: 100,
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25' },
        ],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),
  http.get('https://pokeapi.co/api/v2/pokemon/:idOrName', ({ params }) => {
    const { idOrName } = params;
    if (idOrName === 'pikachu' || idOrName === '25') {
      return new Response(
        JSON.stringify({
          name: 'pikachu',
          types: [{ type: { name: 'electric' } }],
          sprites: { front_default: 'pikachu.png' },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    return new Response(JSON.stringify({ message: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
];
