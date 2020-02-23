# ✨ Publish NuGet
GitHub action to unlist existing nuget packages that match a regex automatically when a project is updated

## Usage
Create new `.github/workflows/build-publish.yml` file:

```yml
name: build/publish to nuget

on:
  push:
    branches:
      - master # Your default release branch
jobs:
  publish:
    name: unlist on nuget
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      # build your solution and generate packages
      
      # Unlist
      - name: unlist previous alpha 1.0.x alpha packages
        uses: darenm/unlist-nuget@v1
        with:
          NUGET_PACKAGE: Company.Namespace.Package # Full Package ID
          VERSION_REGEX: ^1.0.\d+-d(\d+)-alpha # Regex pattern to match version
          NUGET_KEY: ${{secrets.NUGET_API_KEY}} # nuget.org API key

      # publish your new package
```

* The regex `^1.0.\d+-d(\d+)-alpha` matches patterns like:
  * 1.0.0-d200220-alpha
  * 1.0.1-d20022000-alpha
  * 1.0.2-d20022001-alpha
  * 1.0.3-d2002200400-alpha
  * 1.0.4-d2002200412-beta
  * 1.0.5-d20022027-alpha

## Inputs
All of the inputs are required.

Input | Example Value | Description
--- | --- | ---
NUGET_PACKAGE | `Company.Namespace.Package` | The NuGet Package ID
VERSION_REGEX | `^1.0.\d+-d(\d+)-alpha` | Regex pattern to match versions that should be unlisted
NUGET_KEY | `${{secrets.NUGET_API_KEY}}` | API key to authorize the package unlist on nuget.org

## License
[MIT](LICENSE)