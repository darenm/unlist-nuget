import * as core from '@actions/core'
import * as httpm from '@actions/http-client'
import {NugetPackageVersions} from './nugetPackageVersions'

export class Action {
  packageId: string
  versionRegex: RegExp
  nuGetKey: string

  constructor(
    packageId: string | null | undefined,
    versionRegex: string | null | undefined,
    nugetKey: string | null | undefined
  ) {
    if (packageId) {
      this.packageId = packageId
    } else {
      throw new Error('Must supply a valid NUGET_PACKAGE')
    }
    if (versionRegex) {
      this.versionRegex = new RegExp(versionRegex)
    } else {
      throw new Error('Must supply a valid INPUT_VERSION_REGEX')
    }
    if (nugetKey) {
      this.nuGetKey = nugetKey
    } else {
      throw new Error('Must supply a valid INPUT_NUGET_KEY')
    }
  }

  async run(): Promise<void> {
    try {
      await this.unlistMatchingPackageVersions()
    } catch (error) {
      core.setFailed(error.message)
    }
  }

  async getPackageVersions(): Promise<NugetPackageVersions> {
    const _http: httpm.HttpClient = new httpm.HttpClient('unlist-nuget')
    const uri = `https://api.nuget.org/v3-flatcontainer/${this.packageId}/index.json`

    const res: httpm.HttpClientResponse = await _http.get(uri)
    const body: string = await res.readBody()
    const versions: NugetPackageVersions = JSON.parse(body)
    return versions
  }

  async deletePackageVersion(version: string): Promise<boolean> {
    const _http: httpm.HttpClient = new httpm.HttpClient('unlist-nuget')
    const additionalHeaders = {['X-NuGet-ApiKey']: this.nuGetKey}
    const uri = `https://www.nuget.org/api/v2/package/${this.packageId}/${version}`

    console.log(uri)

    const res: httpm.HttpClientResponse = await _http.del(
      uri,
      additionalHeaders
    )

    console.log(res.message.statusCode)
    return res.message.statusCode === 204 || res.message.statusCode === 200
      ? true
      : false
  }

  async relistPackageVersion(version: string): Promise<boolean> {
    const _http: httpm.HttpClient = new httpm.HttpClient('unlist-nuget')
    const additionalHeaders = {['X-NuGet-ApiKey']: this.nuGetKey}
    const uri = `https://www.nuget.org/api/v2/package/${this.packageId}/${version}`

    const res: httpm.HttpClientResponse = await _http.post(
      uri,
      '',
      additionalHeaders
    )
    return res.message.statusCode === 200 ? true : false
  }

  matchVersionsToRegExp(versions: string[]): string[] {
    const matchedVersions: string[] = []
    for (const version of versions) {
      if (this.versionRegex.test(version)) {
        matchedVersions.push(version)
      }
    }

    return matchedVersions
  }

  async unlistMatchingPackageVersions(): Promise<number> {
    const packageVersions = await this.getPackageVersions()
    const matchedVersions = this.matchVersionsToRegExp(packageVersions.versions)
    let count = 0
    let result: boolean
    for (const version of matchedVersions) {
      result = await this.deletePackageVersion(version)
      if (!result) {
        Action.warn(`Unable to unlist ${this.packageId} - ${version}`)
      } else {
        count++
      }
    }

    return count
  }

  private static fail(message: string): void {
    console.log(`##[error]${message}`)
    throw new Error(message)
  }

  private static warn(message: string): void {
    console.log(`##[warn]${message}`)
  }
}
