# ✨ Publish NuGet
GitHub action to unlist nuget packages automatically when a project is updated

## Usage
Create new `.github/workflows/publish.yml` file:

```yml
name: publish to nuget
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

      # Required for a specific dotnet version that doesn't come with ubuntu-latest / windows-latest
      # Visit bit.ly/2synnZl to see the list of SDKs that are pre-installed with ubuntu-latest / windows-latest
      # - name: Setup dotnet
      #   uses: actions/setup-dotnet@v1
      #   with:
      #     dotnet-version: 3.1.100
      
      # Publish
      - name: publish on version change
        uses: darenm/unlist-nuget@v1
        with:
          VERSION_REGEX: <Version>(.*)<\/Version> # Regex pattern to extract version info in a capturing group
          NUGET_KEY: ${{secrets.NUGET_API_KEY}} # nuget.org API key
```

- With all settings on default, updates to project version are monitored on every push / PR merge to master & a new tag is created
- If a `NUGET_KEY` is present then the project gets built, packed & published to nuget.org

## Inputs
Most of the inputs are optional

Input | Default Value | Description
--- | --- | ---
VERSION_REGEX | `<Version>(.*)<\/Version>` | Regex pattern to extract version info in a 
NUGET_KEY | | API key to authorize the package upload to nuget.org

**Note:**  
For multiple projects, every input except `PROJECT_FILE_PATH` can be given as `env` variable at [job / workflow level](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#env)

## License
[MIT](LICENSE)