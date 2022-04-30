import {endGroup, getInput, info, setFailed, startGroup} from "@actions/core"
import {cleanupRef} from "../_utils/cleanupRef"
import {context, getOctokit} from "@actions/github"

async function main() {
    const pkg = getInput("package")

    if (pkg !== "components" && pkg !== "utils") {
        throw new Error(`Unknown package name: ${pkg}.`)
    }

    const octokit = getOctokit(getInput("token"))

    const octokitArgs = {
        org: context.repo.owner,
        package_type: "npm",
        package_name: `sg_frontend-common-${pkg}`,
    } as const
    const listPackageVersionsResponse: { id: number, name: string }[] = await octokit.paginate("GET /orgs/{org}/packages/{package_type}/{package_name}/versions", octokitArgs)

    const ref = cleanupRef(getInput("ref"))
    startGroup(`Filtering versions by ref ${ref}.`)
    const branchVersions = listPackageVersionsResponse
        .filter(version => {
            info(`Version: ${version.name}.`)
            return version.name.includes(ref)
        })
    endGroup()

    startGroup(`Deleting versions.`)
    await Promise.all(branchVersions.map(async version => {
            info(`Deleting version '${version.name}'.`)
            return octokit.request("DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}", {
                ...octokitArgs,
                package_version_id: version.id
            })
        }
    ))
    endGroup()
}

main().catch(e => {
    setFailed(e)
    process.exit(1)
})
