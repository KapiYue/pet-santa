import { OUTFITS, BACKGROUNDS } from "@/components/pets-santa/data";

export function buildPortraitPrompt(
  outfitId: string,
  backgroundId: string,
): string {
  const outfit = OUTFITS.find((item) => item.id === outfitId) ?? OUTFITS[0];
  const background =
    BACKGROUNDS.find((item) => item.id === backgroundId) ?? BACKGROUNDS[0];

  return [
    "Create a festive, photorealistic Christmas portrait of the pet in the reference image.",
    outfit.promptAccent + ".",
    `Place the pet in a ${background.name} holiday scene with warm festive lighting, seasonal decorations, and cozy Christmas atmosphere.`,
    "Preserve the pet's facial features, fur texture, and expression.",
    "High quality, detailed, professional pet portrait photography.",
  ].join(" ");
}
