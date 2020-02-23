import {Action} from './action'

const action = new Action(
  process.env.INPUT_NUGET_PACKAGE || process.env.NUGET_PACKAGE,
  process.env.INPUT_VERSION_REGEX || process.env.VERSION_REGEX,
  process.env.INPUT_NUGET_KEY || process.env.NUGET_KEY
)
action.run()
