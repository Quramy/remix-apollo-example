export function notFound(): never {
  throw new Response(null, { status: 404 });
}
