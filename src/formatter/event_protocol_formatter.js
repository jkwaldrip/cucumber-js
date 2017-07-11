import Formatter from './'
import path from 'path'

const EVENT_NAMES = [
  'source',
  'attachment',
  'gherkin-document',
  'pickle',
  'pickle-accepted',
  'pickle-rejected',
  'test-run-started',
  'test-case-prepared',
  'test-case-started',
  'test-step-started',
  'test-step-attachment',
  'test-step-finished',
  'test-case-finished',
  'test-run-finished'
]

export default class EventProtocolFormatter extends Formatter {
  constructor(options) {
    super(options)
    EVENT_NAMES.forEach(eventName => {
      options.eventBroadcaster.on(eventName, data =>
        this.logEvent(eventName, data)
      )
    })
  }

  logEvent(eventName, data) {
    const text = JSON.stringify(
      { type: eventName, ...data },
      ::this.formatJsonData
    )
    this.log(text + '\n')
  }

  formatJsonData(key, value) {
    if (value instanceof Error) {
      return value.stack.replace(new RegExp(this.cwd + path.sep, 'g'), '')
    } else {
      return value
    }
  }
}
