import {getInput, info, setOutput} from "@actions/core"
import {context} from "@actions/github"
import {cleanupRef} from "../_utils/cleanupRef"

// github defaults to short shas' length of 6
const shortLength = 7

const isMain = () => context.ref.includes("main")

const isV2 = () => context.ref.includes("v2")

function calculateVersion(): string {
    const { ref, runNumber, sha } = context

    if (isMain() || isV2()) {
        return `${getInput("major")}.${getInput("minor")}.${runNumber}`
    } else {
        const shortSha = sha.slice(0, shortLength)
        return `0.0.0-${cleanupRef(ref)}-${shortSha}`
    }
}

function calculateTag(): string {
    if (isMain())
        return "latest"

    if (isV2())
        return "next"

    return cleanupRef(context.ref)
}

function main() {
    const version = calculateVersion()
    const tag = calculateTag()

    info(`Version: ${version}, tag: ${tag}`)
    setOutput("version", version)
    setOutput("tag", tag)
}

main()
