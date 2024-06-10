import { type Infer, type SuperValidated, superForm } from "sveltekit-superforms"
import { zodClient } from "sveltekit-superforms/adapters"
import { toast } from "svelte-sonner"
import { z, type Schema } from "zod"

// Arbitrary JSON type
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]
const jsonSchema: z.ZodType<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

const name = z.string().min(2).max(50)
const description = jsonSchema
// TODO validate against existing list
const template = name.optional()

export type SuperData<S extends Schema> = SuperValidated<Infer<S>>
export const createSchema = z.object({ template, name, description })
export const editSchema = z.object({ name, description })
export function makeForm<S extends Schema>(data: SuperData<S>, schema: S, callback: (_: any) => void) {
  return superForm(data, {
    validators: zodClient(schema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success(`You submitted ${JSON.stringify(form.data, null, 2)}`)
      } else {
        toast.error("Please fix the errors in the form.")
      }
      callback(form)
    },
    onError: ({ result }) => console.log(result),
  })
}
