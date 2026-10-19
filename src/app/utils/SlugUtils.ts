export function toSlug(value: string | null | undefined): string {
  if (!value?.trim()) {
    return '';
  }

  return value
    // Normalisation Unicode
    .normalize('NFD')
    // Supprimer les marques diacritiques
    .replace(/\p{M}+/gu, '')
    // Minuscules
    .toLowerCase()
    // Remplacer les caractères non alphanumériques
    .replace(/[^a-z0-9]+/g, '-')
    // Supprimer les tirets aux extrémités
    .replace(/^-|-$/g, '');
}