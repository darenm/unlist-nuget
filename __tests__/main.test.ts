import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {Action} from '../src/action'

test('Create instance of Action - should throw', () => {
  let a: Action | undefined = undefined
  try {
    a = new Action('', '', '')
  } catch (Error) {}
  expect(a).toBeUndefined()
})

test('Create instance of Action - succeed', () => {
  let a: Action | undefined = undefined
  try {
    a = new Action(
      'CustomMayd.Services.Serialization',
      '^(\\d+\\.\\d+\\.\\d+)-d(\\d+)-alpha',
      '<A DUMMY KEY>'
    )
  } catch (Error) {}
  expect(a).toBeInstanceOf(Action)
})

test('getPackageVersions', async () => {
  let a: Action | undefined = undefined
  a = new Action(
    'CustomMayd.Services.Serialization',
    '^(\\d+\\.\\d+\\.\\d+)-d(\\d+)-alpha',
    '<A DUMMY KEY>'
  )

  const result = await a.getPackageVersions()
  expect(result).toBeDefined()
})

// 1.0.0-d200220-alpha

test('relistPackageVersion - succeed', async () => {
  let nugetKey: string = process.env['NUGET_KEY'] || 'missing env variable'
  expect(nugetKey).not.toBe('missing env variable')

  let a: Action | undefined = undefined
  a = new Action(
    'CustomMayd.Services.Serialization',
    '^(\\d+\\.\\d+\\.\\d+)-d(\\d+)-alpha',
    nugetKey
  )

  const result = await a.relistPackageVersion('1.0.0-d200220-alpha')
  expect(result).toBeTruthy()
})

test('deletePackageVersion - succeed', async () => {
  let nugetKey: string = process.env['NUGET_KEY'] || 'missing env variable'
  expect(nugetKey).not.toBe('missing env variable')

  let a: Action | undefined = undefined
  a = new Action(
    'CustomMayd.Services.Serialization',
    '^(\\d+\\.\\d+\\.\\d+)-d(\\d+)-alpha',
    nugetKey
  )

  const result = await a.deletePackageVersion('1.0.0-d200220-alpha')
  expect(result).toBeTruthy()
})

test('relistPackageVersion - fail', async () => {
  let nugetKey: string = process.env['NUGET_KEY'] || 'missing env variable'
  expect(nugetKey).not.toBe('missing env variable')

  let a: Action | undefined = undefined
  a = new Action(
    'CustomMayd.Services.Serialization',
    '^(\\d+\\.\\d+\\.\\d+)-d(\\d+)-alpha',
    nugetKey
  )

  const result = await a.relistPackageVersion('fred')
  expect(result).toBeFalsy()
})

test('deletePackageVersion - fail', async () => {
  let nugetKey: string = process.env['NUGET_KEY'] || 'missing env variable'
  expect(nugetKey).not.toBe('missing env variable')

  let a: Action | undefined = undefined
  a = new Action(
    'CustomMayd.Services.Serialization',
    '^(\\d+\\.\\d+\\.\\d+)-d(\\d+)-alpha',
    nugetKey
  )

  const result = await a.deletePackageVersion('fred')
  expect(result).toBeFalsy()
})

test('matchVersionsToRegExp - succeed', () => {
  const versions: string[] = [
    '1.0.0-d200220-alpha',
    '1.0.0-d20022000-alpha',
    '1.0.0-d20022001-alpha',
    '1.0.0-d2002200400-alpha',
    '2.0.0-d2002200408-alpha',
    '1.0.0-d2002200412-beta',
    '1.0.0-d2002200418-alpha',
    '1.0.0-d2002200419-alpha',
    '2.0.0-d2002200427-alpha',
    '1.0.0-d2002200436-alpha',
    '1.1.0-d20022009-alpha',
    '1.0.0-d20022010-alpha',
    '1.0.5-d20022027-alpha',
    '1.0.0-d20022053-alpha',
    '1.0.0-d2002220611-alpha',
    '1.0.0-d2002220612-alpha',
    '1.0.0'
  ]

  let nugetKey: string = process.env['NUGET_KEY'] || 'missing env variable'
  expect(nugetKey).not.toBe('missing env variable')

  let a: Action | undefined = undefined
  a = new Action(
    'CustomMayd.Services.Serialization',
    '^(1\\.0\\.0)-d(\\d+)-alpha',
    'nugetKey'
  )

  const result = a.matchVersionsToRegExp(versions)
  expect(result.length).toEqual(11)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_NUGET_PACKAGE'] = 'CustomMayd.Services.Serialization'
  process.env['INPUT_VERSION_REGEX'] = '^(\\d+\\.\\d+\\.\\d+)-d(\\d+)-alpha'
  process.env['INPUT_NUGET_KEY'] = '<A DUMMY KEY>'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }
  console.log(cp.execSync(`node ${ip}`, options).toString())
})
