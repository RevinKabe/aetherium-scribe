import { Hono } from "hono";
import type { Env } from './core-utils';
import { CharacterEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { Character } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CHARACTERS
  app.get('/api/characters', async (c) => {
    const page = await CharacterEntity.list(c.env);
    return ok(c, page);
  });
  app.get('/api/characters/:id', async (c) => {
    const { id } = c.req.param();
    const character = await CharacterEntity.get(c.env, id);
    if (!character) {
      return notFound(c, 'Character not found');
    }
    return ok(c, character);
  });
  app.post('/api/characters', async (c) => {
    const characterData = (await c.req.json()) as Omit<Character, 'id'>;
    if (!characterData.name || !characterData.race || !characterData.dndClass || !characterData.background) {
      return bad(c, 'Incomplete character data');
    }
    const character: Character = {
      ...characterData,
      id: crypto.randomUUID(),
    };
    const created = await CharacterEntity.create(c.env, character);
    return ok(c, created);
  });
  app.put('/api/characters/:id', async (c) => {
    const { id } = c.req.param();
    const characterData = (await c.req.json()) as Partial<Character>;
    const updatedCharacter = await CharacterEntity.update(c.env, id, characterData);
    if (!updatedCharacter) {
      return notFound(c, 'Character not found for update');
    }
    return ok(c, updatedCharacter);
  });
  app.delete('/api/characters/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await CharacterEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Character not found');
    }
    return ok(c, { id });
  });
  // AI PORTRAIT GENERATION
  app.post('/api/characters/generate-portrait', async (c) => {
    try {
      if (!c.env.AI) {
        console.error('AI binding is not configured.');
        return c.json({ success: false, error: 'AI service is not configured on the server.' }, 501);
      }
      const { race, dndClass, customPrompt } = await c.req.json<{ race: string; dndClass: string; customPrompt?: string }>();
      if (!race || !dndClass) {
        return bad(c, 'Race and class are required for portrait generation.');
      }
      let prompt = `A high-quality, detailed, photorealistic fantasy portrait of a ${race} ${dndClass}. Dungeons and Dragons character art, epic, stunning, cinematic lighting.`;
      if (customPrompt) {
        prompt += ` ${customPrompt}`;
      }
      const inputs = { prompt };
      const response = await c.env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', inputs);
      return new Response(response, {
        headers: {
          'Content-Type': 'image/png',
        },
      });
    } catch (error) {
      console.error('AI Portrait Generation Failed:', error);
      return c.json({ success: false, error: 'Failed to generate character portrait.' }, 500);
    }
  });
}