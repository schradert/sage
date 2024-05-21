<script lang="ts">
import { Scatter } from "$lib/components/data_vis/scatter"
import Dropzone from "svelte-file-dropzone"

let file: File | undefined
let errorCode = ""
let csvText = ""

const ERROR_MAP: { [_: string]: string | undefined } = {
  "file-invalid-type": "Uploaded file was not a CSV.",
}

async function readFile(file: File) {
  csvText = await file.text()
}

function handleFilesSelect(e: CustomEvent): void {
  const { acceptedFiles, fileRejections } = e.detail
  if (fileRejections.length) {
    console.log(fileRejections)
    file = undefined
    errorCode = fileRejections[0].errors[0].code
    csvText = ""
  } else if (acceptedFiles.length) {
    errorCode = ""
    file = acceptedFiles[0]
    readFile(acceptedFiles[0])
  }
}
</script>

<Dropzone on:drop={handleFilesSelect} multiple={false} accept="text/csv" />

{#if errorCode}
  <p>{ERROR_MAP[errorCode] ?? errorCode}</p>
{/if}

{#if csvText}
  <div style="width: 60rem; height: 40rem">

    <Scatter csvData={csvText} channels={{x: "a", y: "b"}} />
  </div>
{/if}
