export function createSlug(username: string): string {
  return username
    .normalize('NFD') // decompõe caracteres especiais (ex: ç, â)
    .replace(/[\u0300-\u036f]/g, '') // remove marcas diacríticas
    .replace(/[^a-zA-Z0-9\s-]/g, '') // remove caracteres especiais
    .replace(/\s+/g, '-') // substitui espaços por hifens
    .replace(/-+/g, '-') 
    .toLowerCase() // opcional: deixa tudo minúsculo
    .trim();
}