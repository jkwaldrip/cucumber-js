import { ParameterTypeRegistry } from 'cucumber-expressions'
import SupportCodeLibraryBuilder from './builder'

describe('SupportCodeLibraryBuilder', function() {
  describe('no support code fns', function() {
    beforeEach(function() {
      this.attachFn = sinon.stub()
      this.options = SupportCodeLibraryBuilder.build({
        cwd: 'path/to/project',
        fns: []
      })
    })

    it('returns the default options', function() {
      expect(this.options.afterFeaturesHookDefinitions).to.eql([])
      expect(this.options.afterScenarioHookDefinitions).to.eql([])
      expect(this.options.beforeFeaturesHookDefinitions).to.eql([])
      expect(this.options.beforeScenarioHookDefinitions).to.eql([])
      expect(this.options.defaultTimeout).to.eql(5000)
      expect(this.options.listeners).to.eql([])
      expect(this.options.stepDefinitions).to.eql([])
      expect(this.options.parameterTypeRegistry).to.be.instanceOf(
        ParameterTypeRegistry
      )
      const worldInstance = new this.options.World({
        attach: this.attachFn,
        parameters: { some: 'data' }
      })
      expect(worldInstance.attach).to.eql(this.attachFn)
      expect(worldInstance.parameters).to.eql({ some: 'data' })
    })
  })

  describe('AfterEach', function() {
    describe('function only', function() {
      beforeEach(function() {
        const hook = function() {}
        const fn = ({ AfterEach }) => {
          AfterEach(hook) // eslint-disable-line babel/new-cap
        }
        this.hook = hook
        this.options = SupportCodeLibraryBuilder.build({
          cwd: 'path/to/project',
          fns: [fn]
        })
      })

      it('adds a scenario hook definition', function() {
        expect(this.options.afterScenarioHookDefinitions).to.have.lengthOf(1)
        expect(this.options.afterScenarioHookDefinitions[0].code).to.eql(this.hook)
      })
    })

    describe('tag and function', function() {
      beforeEach(function() {
        const hook = function() {}
        const fn = ({ AfterEach }) => {
          AfterEach('@tagA', hook) // eslint-disable-line babel/new-cap
        }
        this.hook = hook
        this.options = SupportCodeLibraryBuilder.build({
          cwd: 'path/to/project',
          fns: [fn]
        })
      })

      it('adds a scenario hook definition', function() {
        expect(this.options.afterScenarioHookDefinitions).to.have.lengthOf(1)
        expect(this.options.afterScenarioHookDefinitions[0].options.tags).to.eql(
          '@tagA'
        )
        expect(this.options.afterScenarioHookDefinitions[0].code).to.eql(this.hook)
      })
    })

    describe('options and function', function() {
      beforeEach(function() {
        const hook = function() {}
        const fn = ({ AfterEach }) => {
          AfterEach({ tags: '@tagA' }, hook) // eslint-disable-line babel/new-cap
        }
        this.hook = hook
        this.options = SupportCodeLibraryBuilder.build({
          cwd: 'path/to/project',
          fns: [fn]
        })
      })

      it('adds a scenario hook definition', function() {
        expect(this.options.afterScenarioHookDefinitions).to.have.lengthOf(1)
        expect(this.options.afterScenarioHookDefinitions[0].options.tags).to.eql(
          '@tagA'
        )
        expect(this.options.afterScenarioHookDefinitions[0].code).to.eql(this.hook)
      })
    })

    describe('multiple', function() {
      beforeEach(function() {
        this.hook1 = function hook1() {}
        this.hook2 = function hook2() {}
        const fn = ({ AfterEach }) => {
          AfterEach(this.hook1) // eslint-disable-line babel/new-cap
          AfterEach(this.hook2) // eslint-disable-line babel/new-cap
        }
        this.options = SupportCodeLibraryBuilder.build({
          cwd: 'path/to/project',
          fns: [fn]
        })
      })

      it('adds the scenario hook definitions in the reverse order of definition', function() {
        expect(this.options.afterScenarioHookDefinitions).to.have.lengthOf(2)
        expect(this.options.afterScenarioHookDefinitions[0].code).to.eql(this.hook2)
        expect(this.options.afterScenarioHookDefinitions[1].code).to.eql(this.hook1)
      })
    })
  })

  describe('this.BeforeEach', function() {
    describe('function only', function() {
      beforeEach(function() {
        const hook = function() {}
        const fn = ({ BeforeEach }) => {
          BeforeEach(hook) // eslint-disable-line babel/new-cap
        }
        this.hook = hook
        this.options = SupportCodeLibraryBuilder.build({
          cwd: 'path/to/project',
          fns: [fn]
        })
      })

      it('adds a scenario hook definition', function() {
        expect(this.options.beforeScenarioHookDefinitions).to.have.lengthOf(1)
        expect(this.options.beforeScenarioHookDefinitions[0].code).to.eql(this.hook)
      })
    })

    describe('tag and function', function() {
      beforeEach(function() {
        const hook = function() {}
        const fn = ({ BeforeEach }) => {
          BeforeEach('@tagA', hook) // eslint-disable-line babel/new-cap
        }
        this.hook = hook
        this.options = SupportCodeLibraryBuilder.build({
          cwd: 'path/to/project',
          fns: [fn]
        })
      })

      it('adds a scenario hook definition', function() {
        expect(this.options.beforeScenarioHookDefinitions).to.have.lengthOf(1)
        expect(this.options.beforeScenarioHookDefinitions[0].options.tags).to.eql(
          '@tagA'
        )
        expect(this.options.beforeScenarioHookDefinitions[0].code).to.eql(this.hook)
      })
    })

    describe('options and function', function() {
      beforeEach(function() {
        const hook = function() {}
        const fn = ({ BeforeEach }) => {
          BeforeEach({ tags: '@tagA' }, hook) // eslint-disable-line babel/new-cap
        }
        this.hook = hook
        this.options = SupportCodeLibraryBuilder.build({
          cwd: 'path/to/project',
          fns: [fn]
        })
      })

      it('adds a scenario hook definition', function() {
        expect(this.options.beforeScenarioHookDefinitions).to.have.lengthOf(1)
        expect(this.options.beforeScenarioHookDefinitions[0].options.tags).to.eql(
          '@tagA'
        )
        expect(this.options.beforeScenarioHookDefinitions[0].code).to.eql(this.hook)
      })
    })

    describe('multiple', function() {
      beforeEach(function() {
        this.hook1 = function hook1() {}
        this.hook2 = function hook2() {}
        const fn = ({ BeforeEach }) => {
          BeforeEach(this.hook1) // eslint-disable-line babel/new-cap
          BeforeEach(this.hook2) // eslint-disable-line babel/new-cap
        }
        this.options = SupportCodeLibraryBuilder.build({
          cwd: 'path/to/project',
          fns: [fn]
        })
      })

      it('adds the scenario hook definitions in the order of definition', function() {
        expect(this.options.beforeScenarioHookDefinitions).to.have.lengthOf(2)
        expect(this.options.beforeScenarioHookDefinitions[0].code).to.eql(this.hook1)
        expect(this.options.beforeScenarioHookDefinitions[1].code).to.eql(this.hook2)
      })
    })
  })
})
