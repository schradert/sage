<script lang="ts">
import { flatten } from "flat"
import * as R from "remeda"
import {
  type BodyRow,
  type Column,
  type DataLabel,
  type HeaderRow,
  Render,
  Subscribe,
  type TableAttributes,
  type TableBodyAttributes,
  createRender,
  createTable,
} from "svelte-headless-table"
import { addSortBy } from "svelte-headless-table/plugins"
import { type Readable, derived } from "svelte/store"

import * as Table from "$lib/components/ui/table"
import { nodes, selectedGraphs, selectedNodes } from "$lib/stores"
import { capitalize, typeOf } from "$lib/utils"

import EditableCell from "./EditableCell.svelte"
import StaticCell from "./StaticCell.svelte"
import TextEditorModalCell from "./TextEditorModalCell.svelte"

const nodesInTable = derived([nodes, selectedNodes], ([$nodes, $selectedNodes]) =>
  $selectedNodes.length > 0 ? $selectedNodes : $nodes,
)
const table = createTable(
  nodesInTable,
  Object.keys($selectedGraphs).length > 0
    ? { sort: addSortBy({ initialSortKeys: [{ id: "data.label", order: "asc" }] }) }
    : {},
)
let headerRows: Readable<HeaderRow<Node>[]>
let pageRows: Readable<BodyRow<Node>[]>
let tableAttrs: Readable<TableAttributes<Node>>
let tableBodyAttrs: Readable<TableBodyAttributes<Node>>
$: {
  // Must explicitly pass arrow function arguments in mergeDeep to avoid "Wrong number of arguments"
  const monsterNode = R.reduce($nodesInTable, (acc, x) => R.mergeDeep(acc, x), {})
  const schema = R.mapValues(flatten(monsterNode), typeOf)
  const onUpdateValue = (rowDataId: string, columnId: string, newValue: unknown) => {
    const schemaType = schema[columnId]
    const newValueParsed = schemaType === "Number" && newValue ? Number(newValue) : newValue
    const node = $nodesInTable[Number(rowDataId)]
    $nodes[$nodes.indexOf(node)] = R.setPath(node, R.stringToPath(columnId), newValueParsed)
    $nodes = $nodes
  }
  const EditableCellLabel: DataLabel<unknown> = ({ column, row, value }) =>
    createRender(EditableCell, { row, column, value, onUpdateValue })

  const specialCellsByColumnId: Record<string, DataLabel<unknown> | undefined> = {
    "data.description": ({ column, row, value: { content } }) =>
      createRender(TextEditorModalCell, {
        row,
        column,
        content,
        onUpdateContent: (r, c, newContent) => onUpdateValue(r, c, { content: newContent }),
      }),
  }

  const generateColumns = (obj, roots: string[] = []): Column<Node>[] =>
    Object.entries(obj).map(([key, value]) => {
      const path = roots.concat([key])
      const id = path.join(".")
      const specialCell = specialCellsByColumnId[id]

      const makeColumn = (cell: DataLabel<unknown>) =>
        table.column({
          header: capitalize(key),
          cell: ({ value, ...rest }) =>
            value === undefined ? createRender(StaticCell, { value: "-" }) : cell({ value, ...rest }),
          id,
          accessor: item => R.pathOr(item, path, undefined),
          plugins: { sort: { getSortValue: value => (typeof value === "string" ? value.toLowerCase() : value) } },
        })
      if (specialCell) {
        return makeColumn(specialCell)
      }
      return Object.prototype.toString.call(value) === "[object Object]"
        ? table.group({
            header: capitalize(key),
            columns: generateColumns(value, path),
          })
        : makeColumn(EditableCellLabel)
    })
  const columns = table.createColumns(generateColumns(monsterNode ?? {}))
  ;({ headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns))
}
</script>

<Table.Root {...$tableAttrs}>
  <Table.Header>
    {#each $headerRows as headerRow}
      <Subscribe rowAttrs={headerRow.attrs()}>
        <Table.Row>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
              <Table.Head {...attrs}>
                <Render of={cell.render()} />
              </Table.Head>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Header>
  <Table.Body {...$tableBodyAttrs}>
    {#each $pageRows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <Table.Row {...rowAttrs}>
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <Table.Cell {...attrs}>
                <Render of={cell.render()} />
              </Table.Cell>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Body>
</Table.Root>
