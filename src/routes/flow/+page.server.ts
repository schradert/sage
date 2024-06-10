import { fail } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import type { PageServerLoad, Actions } from "./$types"
import { editSchema, createSchema } from "./forms"

export const load: PageServerLoad = async () => {
  return {
    forms: {
      create: await superValidate(zod(createSchema)),
      edit: await superValidate(zod(editSchema)),
    },
  }
}

export const actions: Actions = {
  create: async event => {
    const form = await superValidate(event, zod(createSchema))
    if (!form.valid) return fail(400, { form })
    return { form }
  },
  edit: async event => {
    const form = await superValidate(event, zod(editSchema))
    if (!form.valid) return fail(400, { form })
    return { form }
  },
}
