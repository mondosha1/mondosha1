# FSK: Feature Store Kit

# Intro

## What is the FSK?

FSK is a set of helpers and tools to help building NgRx feature stores for lazy-loaded libraries.

**Features:**

- Allows synchronization between NgRx stores, Angular forms and Angular route parameters (cf [Managing State in Angular Applications](https://blog.nrwl.io/managing-state-in-angular-applications-22b75ef5625f) by Victor Savkin).
- Avoid boilerplate: write actions, reducer and effects only if you need them!
- Not a replacement of NgRx but built on top of it. No inheritance, only composition: easily add or remove FSK from a feature store without impacting its behavior.

## What is it based on?

<img src="https://angular.io/assets/images/logos/angular/angular.png" width="50" />
<img src="https://avatars0.githubusercontent.com/u/16272733" width="45" />
<img src="https://miro.medium.com/max/1048/0*oP-zzdTtf7LvN8Jg.png" width="65" />

FSK takes benefits of standard technologies used in an Nx application:

- [Angular reactive forms](https://angular.io/guide/reactive-forms)
- [Angular router](https://angular.io/guide/router)
- [NgRx store](https://ngrx.io/guide/store)
- [NgRx effects](https://ngrx.io/guide/effects)
- [NgRx router store](https://ngrx.io/guide/router-store) with a set of [NgRx navigation actions](https://github.com/ngrx/platform/blob/039abbeeb3843a841c2db62ce1345d57a14e1db8/MIGRATION.md#navigation-actions) for routing purpose and a [custom serializer](https://github.com/ngrx/platform/blob/master/docs/router-store/api.md#custom-router-state-serializer).
- [Nx lazy-loaded library](https://nx.dev/angular/guides/misc-lazy-loading)

# How to use it?

Today you can choose how you want to integrate the FSK in your own code.

The traditional way: by your own bare hands.

This means you have to add all configuration needed inside your module, and implement all you need (state, reducer, structure, effects, etc…)

This will be necessary if you have to implement it inside an old module.

But if you create a new fresh module, we recommend you to use our schematic !

This will create you the entire module customized for your needs.

Let’s see that more in details

## With the Mondosha1 library schematic

We recommend you to use **Nx Console** for [VSCode](https://nx.dev/angular/cli/console/) or for [Webstorm](https://plugins.jetbrains.com/plugin/15000-nx-webstorm) when you want to use our schematic. This tool provide you a nice UI and let you check a dry run version of what you will generate with the schematic.

Let’s see what you have to to generate your FSK library.

As described by the gif below, first go to generate → library .

The only mandatory information is the name of your library.

![image](https://user-images.githubusercontent.com/1006426/94246544-2bf70e80-ff1c-11ea-8ca9-bccedf9182d0.png)

Now let’s see in details what options you can use in order to customize your new library.

![image](https://user-images.githubusercontent.com/1006426/94246638-44ffbf80-ff1c-11ea-9374-74e4df0ec641.png)

## With your little hands

1. Declare the state, initial state and structure
2. Inject the FeatureStoreModule
3. Add FSK onto route definition
   1. Angular Routes
   2. Dialog paths
4. Generate the form with the form helper
5. Use effect helpers
6. Create your selectors
   1. The standard NgRx way (with createFeatureSelector)
   2. Reselect on FSK (selector based on getStateWithoutMetaData w/ props)
7. Create a facade (optional but advised)

# How does it work?

## Update flow

![image](https://user-images.githubusercontent.com/1006426/94246778-78424e80-ff1c-11ea-90f6-d140723ca220.png)

_Source: [https://www.lucidchart.com/documents/edit/c71861f2-377f-4a4a-89b3-661e45090461/0?beaconFlowId=CCE36D22DB246700#](https://www.lucidchart.com/documents/edit/c71861f2-377f-4a4a-89b3-661e45090461/0?beaconFlowId=CCE36D22DB246700#)_

1. An effect on `ROUTER_NAVIGATION` (see ngrx/router for more information) parses router parameters (see difference with router params and query params) from the URL, formats them depending on the defined [structure]() and triggers the `updateStoreFromParams` action to update the store. The effect and its mechanic is only triggered if the router segment which parameters are attached on correspond to the feature store key. Then, the `updateStoreFromParams` action is handled by the feature store meta-reducer and updates the store for the matching feature store key. \
2. In the feature store form helper, the form subscribes the `stateWithoutMetaData$` method from the facade (listening to the feature store `stateWithoutMetaData` selector). When a new state is emitted by the selector, the form will patch its value and possibly make some additional controls changes (for form arrays for example). \
3. Still in the feature store form helper, a subscription on form value changes

## Reset

## Submit

# Documentation

## Module

FSK provides an Angular Module named `FeatureStoreModule` which is given a configuration object.

Below is the list of available options:

<table>
  <tr>
   <td>Name</td>
   <td>Description</td>
   <td>Mandatory</td>
  </tr>
  <tr>
   <td><strong>featureStoreKey</strong></td>
   <td>The identifier of the current FSK library. It must correspond to the <code>featureName</code> injected in the NgRx store during <code>StoreModule.forFeature</code> declaration.</td>
   <td>Yes</td>
  </tr>
  <tr>
   <td><strong>initialState</strong></td>
   <td>The initial state used as default state in the NgRx reducer and optionally injected with the feature name during <code>StoreModule.forFeature</code> declaration.</td>
   <td>Yes</td>
  </tr>
  <tr>
   <td><strong>structure</strong></td>
   <td>The description of the store with the name of the fields, their type and their validators.</td>
   <td>Yes</td>
  </tr>
  <tr>
   <td><strong>structurePathsForForm</strong></td>
   <td>A whitelist of the paths (dot-separated) in the structure to create form controls for. If not given or empty, then controls will be generated for <strong>all paths</strong> in the structure.</td>
   <td>No</td>
  </tr>
  <tr>
   <td><strong>structurePathsForParams</strong></td>
   <td>A whitelist of the paths (dot-separated) in the structure to generate route parameters for. If not given or empty, then <strong>all paths</strong> in the structure will be forwarded as route parameter.</td>
   <td>No</td>
  </tr>
  <tr>
   <td><strong>children</strong></td>
   <td>A list of feature stores which will be initialized, submitted and reset at the same time as the current store. We says this one acts as the parent feature store of these child feature stores.</td>
   <td>No</td>
  </tr>
</table>

## Structure

### Intro

The FSK structure file is a serializable representation of the state and its typing. It should make the state and its possible sub-parts easily understandable.

### Why?

The structure is used for form groups, arrays and controls generation on the one hand. And it’s used for router params parsing and formatting in the other hand.

### Structure format

The format of the structure is opinionated and is presented as a TypeScript interface.

**Why don’t we use the format of controls configs from the Angular Form Builder?**

> Because, we want the structure to be serializable in order to possibly retrieve structures dynamically, from HTTP requests for example.

> Controls configs are not serializable as they may contain Angular validators which are functions.

**Why don’t we use a JSON file following the JSON Schema specification?**

> The main benefit of a plain object is that it’s strongly typed. Interfaces and types describe how should be declared the structure. Same types are used by the structure helper in order to generate the reactive forms.
> But we could handle a JSON schema format additionally for dynamic structures retrieval.

### Form controls generation

Depending on the given structure, a reactive form will be generated with form controls, form arrays or child form groups.

Default values of form controls are handled by the NgRx `initialState` and are not duplicated in the structure to keep DRY.

See the part _To complete_

## Effects

### Intro

_To complete_

### updateStoreFromParams

_To complete_

### navigateToStore

_To complete_

### updateParamsFromForm

_To complete_

### initStoreFromParent

_To complete_

### submitIfValid

_To complete_

### resetStoreOnLeave

_To complete_

## Form

### Form groups, controls and arrays

Form controls are declared in the structure

#### Form group

The root level of the structure must be a plain object and will inevitably generate a form group. It’s the obvious behavior as the root level of an Angular Form is a form group.

It is also possible to generate child form groups, for example for structuring the store into sub-parts or into split smart components. To achieve this, the structure part corresponding to the child form group should also be an object where each key is associated a form control to.

In the example below, `engine` is a child form group of the structure where `name` and `cylinders` are controls of the child form.

```ts
{
  brand: 'Peugeot',
  engine: {
    name: 'string',
    cylinders: 'number'
  }
}
```

#### Form control

Controls are always leaves of a form group. In this way, it can be declared:

- In the simplest way, as a simple field type: 'string' **| **'number' **| **'boolean' **| **'object' **| **'date'

  ```ts
  {
    brand: 'Peugeot'
  }
  ```

- With the combination of a type and validators:

  ```ts
  {
    brand: {
      type: 'Peugeot',
      validators: ValidatorName.Required
    }
  }
  ```

- As an array of simple fied types:

  ```ts
  {
    valves: {
      items: 'number',
      type: 'array'
    }
  }
  ```

**For array of complex types, a form array will be generated instead of a form control.**

#### Form array

Array of complex items will generate Angular Form Arrays where each item will be represented as a form group with associated controls, following the item structure.

```ts
// structure of an array of complex field types
{
  wheels: {
    type: 'array',
    items: {
      width: 'number',
      height: 'number',
      diameter: 'number'
    }
  }
}

// will generate the Angular Form Array
new FormArray([
  new FormGroup({
    width: new FormControl(),
    height: new FormControl(),
    diameter: new FormControl()
  }),
  …
])
```

Array of objects do not always need to be represented as an array of complex types. A form control of type `object` may be sufficient.

To conclude, it really depends on the need to edit or not values of the array items themselves.

### Validators

Structure validators are serializable and used for Angular Forms generation only.

There are two kinds of validators:

- Angular validators
- Formulas

#### Angular validators

To remain serializable, the angular validators are declared as string in the structure.

```ts
{
  name: {
    type: 'string',
    validators: 'required'
  }
}
```

A string enum helps retrieving them.

```ts
{
  name: {
    type: 'string',
    validators: ValidatorName.Required
  }
}
```

Validators requiring parameters (like `maxLength`) can be declared using a plain object:

```ts
{
  name: {
    type: 'string',
    validators: {
      name: ValidatorName.MaxLength
      params: { maxLength: 4 }
    }
  }
}
```

Like standard Angular Form controls declaration, several validators can be given.

```ts
{
  url: {
    type: 'string',
    validators: [ValidatorName.Required,ValidatorName.Url]
  }
}
```

Sometimes, you want to apply your validator only for some use cases.
For that, you can use the `condition` property for a validator definition.
This one accept formulas.

```ts
{
  id: 'number',
  url: {
    type: 'string',
    validators: [{
      name: ValidatorName.Required,
      condition: 'ISEMPTY(id)'
    }]
  }
}
```

#### Formulas

Formulas are a way to validate a form control using an expression as a string (still serializable) in the same manner as we write formulas in Excel.

It uses the amazing [Javascript Expression Evaluator](https://silentmatt.com/javascript-expression-evaluator/) (or `expr-eval`) library for formulas parsing and evaluation. Formula expressions accept either values, arithmetic or logical operators, and functions. Each property of the feature store state is available as a value and the list of available functions can be read below.

An should evaluate to a boolean value and is accompanied by an error message which will be displayed if the expression evaluates to `TRUE`. In other words, the expression can be read as “What should throw an error?”.

```ts
{
  url: {
    type: 'string',
    validators: {
      formula: 'NOT(REGEX(url, "^http[s]?://datastudio\\\\.google\\\\.com/embed(/[a-z]/[0-9])?/reporting/[^/]/page/[a-zA-Z]{4}$"))',
      message: 'The entered URL is not a valid Google Data Studio dashboard URL'
    }
  }
}

```

Below are the set of functions are available in formulas.

**Standard**

<table>
  <tr>
   <td>Name</td>
   <td>Type</td>
   <td>Description</td>
  </tr>
  <tr>
   <td><strong>ISEMPTY</strong></td>
   <td>boolean</td>
   <td>Return true if the given expression is empty (<code>null</code>, <code>undefined</code>, <code>false</code>, <code>0</code>, <code>NaN</code>, <code>''</code>, <code>[]</code>)</td>
  </tr>
  <tr>
   <td><strong>ISUUID</strong></td>
   <td>boolean</td>
   <td>Return true if the given expression is a UUID (based on our operator idUuid from '@mondosha1/shared/util-string')</td>
  </tr>
  <tr>
   <td><strong>ISINTEGER</strong></td>
   <td>boolean</td>
   <td>Return true if the given expression is an integer</td>
  </tr>
  <tr>
   <td><strong>ISNUMBER</strong></td>
   <td>boolean</td>
   <td>Return true if the given expression is a number</td>
  </tr>
  <tr>
   <td><strong>ISURL</strong></td>
   <td>boolean</td>
   <td>Return true if the given expression is a valid URL</td>
  </tr>
  <tr>
   <td><strong>REGEX</strong></td>
   <td>boolean</td>
   <td>Return true if the given expression matches the pattern <p>ex: <code>REGEX(ip, “\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b”)</code></td>
  </tr>
  <tr>
   <td><strong>GET</strong></td>
   <td>any</td>
   <td></td>
  </tr>
  <tr>
   <td><strong>LTE</strong></td>
   <td>number</td>
   <td></td>
  </tr>
  <tr>
   <td><strong>INARRAY</strong></td>
   <td>any[]</td>
   <td>ex: NOT(fileTypes, INARRAY(["image/jpeg", "jpeg", "jpg"]))</td>
  </tr>
  <tr>
   <td><strong>MAP</strong></td>
   <td>any[], fn</td>
   <td></td>
  </tr>
</table>

**Constants**

<table>
  <tr>
   <td>Name</td>
   <td>Type</td>
   <td>Description</td>
  </tr>
  <tr>
   <td><strong>TODAY</strong></td>
   <td>number</td>
   <td>The today’s date represented as a timestamp (in seconds)</td>
  </tr>
  <tr>
   <td><strong>NOW</strong></td>
   <td>number</td>
   <td>The date at time T represented as a timestamp (in milliseconds)</td>
  </tr>
</table>

**Helpers**

<table>
  <tr>
   <td>Name</td>
   <td>Type</td>
   <td>Description</td>
  </tr>
  <tr>
   <td><strong>LENGTH</strong></td>
   <td>number</td>
   <td>Return the length of a string or an array</td>
  </tr>
  <tr>
   <td><strong>MAX</strong></td>
   <td>number</td>
   <td>Return the maximum value from the given set of numbers. <p>eg: <code>MAX(1, 2, 3)</code></td>
  </tr>
  <tr>
   <td><strong>MIN</strong></td>
   <td>number</td>
   <td>Return the minimum value from the given set of numbers. <p>eg: <code>MIN(1, 2, 3)</code></td>
  </tr>
</table>

**Logical functions**

<table>
  <tr>
   <td>Name</td>
   <td>Type</td>
   <td>Description</td>
  </tr>
  <tr>
   <td><strong>NOT</strong></td>
   <td>boolean</td>
   <td>Return the negation of the given boolean expression or function.
       <p>eg: <code>NOT(age > 18)</code></p>
       <p>eg: <code>EVERY(names, NOT(ISEMPTY))</code></p>
   </td>
  </tr>
  <tr>
   <td><strong>OR</strong></td>
   <td>boolean</td>
   <td>Return the disjunction of the given boolean expressions. <p>eg: <code>OR(ISEMPTY(age), age &lt; 18)</code></p></td>
  </tr>
  <tr>
   <td><strong>AND</strong></td>
   <td>boolean</td>
   <td>Return the conjunction of the given boolean expressions.
    <p>eg: <code>AND(age >= 18, NOT(ISEMPTY(firstName)), NOT(ISEMPTY(lastName)))</code></p></td>
  </tr>
</table>

**Advanced functions**

<table>
  <tr>
   <td>Name</td>
   <td>Type</td>
   <td>Description</td>
  </tr>
  <tr>
   <td><strong>EVERY</strong></td>
   <td>boolean</td>
   <td>Returns true if the each value of given array evaluates the given expression to true.
<p>eg: <code>EVERY(names, NOT(ISEMPTY))</code></td>
  </tr>
<tr>
   <td><strong>IF</strong></td>
   <td>any</td>
   <td>Depending of the condition, will return 1st expression if true or the 2nd else.
<p>eg (optional phoneNumber): <code>IF(ISEMPTY(phoneNumber), false, NOT(REGEX(phoneNumber, "^\\+?\\d{5,}$")))</code></td>
  </tr>
</table>

### Store binding

#### On value changes

The Angular form is tightly coupled to the store. Every change in any field of the form will trigger an update of the corresponding field in the store.

The form updates the store in two different ways depending on the chosen `FormUpdateStrategy`.

- **ToStore**: form values are directly sent to the store which is updated thanks to an action and a reducer case.
- **ToParams**: form values are sent to as segment parameters of the current route before updating the store. The route parameters are updated from an action and an effect, then the store is updated thanks to an effect listening to the router actions (see [https://ngrx.io/guide/router-store](https://ngrx.io/guide/router-store)) and a reducer.

```ts
this.formGroup = this.featureStoreFormFactory.getFormBuilder(MY_FEATURE).create({
  takeUntil$: this.destroy$,
  updateStrategy: FormUpdateStrategy.ToParams
})
```

To trigger params or store update, a subscription to the `valueChanges` observable provided by the form is used.

To avoid leaks, the subscription should be cancel when the component handling the form creation is destroyed, that’s why a `takeUntil$` prop should be fed and correspond to an observable which completes at the component destroy.

While the form values are updated in the store, the form validity is also synchronized in the metadata of the store.

#### Formatter

It is possible to give a custom formatter function to store values which differ (a bit) from the values returned from the form.

The example below store the `foo` property as a number while the form field returned it as a string.

```ts
FeatureStoreModule.forFeature<MY_FEATURE>({
  featureStoreKey,
  initialState,
  structure,
  formatter: state => ({ foo: parseInt(state.foo, 10), ...state })
})
```

It is also possible to get the previous form value in order to compare them and by the way, format the data differently.

```ts
FeatureStoreModule.forFeature<MY_FEATURE>({
  featureStoreKey,
  initialState,
  structure,
  formatter: (newState, oldState) =>
    newState.color !== oldState.color ? { colorUpdated: true, ...newState } : newState
})
```

#### Ask for validation

The feature store form subscribes to the `askForValidation$` selector which returns true when the `askForValidation` action is called (manually or via the `submitBeforeLeaving` guard).

Once validation asked, the form marks all its controls as dirty (which usually shows form fields errors if they have) and call the `submit` action. This action is responsible for checking the validity of the form (thank to the corresponding metadata) before triggering any user-defined side-effect stream.

#### Patch value

The last responsibility of the form is to listen to the store changes and update the corresponding form fields. Only the fields specified in the `structurePathsForForm` property are updated (an empty array or no property given will whitelist all the structure).

Such updates also work for Angular FormArrays and will create or remove items depending on the changes made in the store. This is a tricky part of the form update as Angular does not help us a lot (mutability, event emitting, etc).

## Meta-reducer & emptyReducer

### Meta-reducer

_To complete_

### emptyReducer

_To complete_

## Selectors and facade

### Facade

_To complete_

### Selectors

_To complete_

# Child store

_To complete_

# FAQ

**Why is a form array created while I expect a simple form control?**

> You probably declared your array entry in the structure using a flatten object as items instead of the simple type `object`.
> As explained above, a flatten object will create a form group for each object and by the way will create a form array as parent.

# Glossary
