# Angular: Change Detection

## What does it do
There are two main building blocks of change detection in Angular:
	
  * a component view
  * the associated bindings.

Every component in Angular has  a template with HTML elements. Angular refers to the template to render the contents (real DOM nodes) on the screen -> it needs a place to store the references to those DOM nodes. 
For that purpose, internally there’s a data structure known as [VIEW](https://github.com/angular/angular/blob/master/packages/core/src/view/types.ts), which is used to store the [reference](https://github.com/angular/angular/blob/master/packages/core/src/view/types.ts#L373) to the component instance and the previous values of binding expressions.  The relationship between VIEW and Component is 1-1. 

![](Angular%20Change%20Detection/1_JJMutO1ZNwTX2iWiVjcP1g.png)

As the compiler analyses the template, it identifies properties of the DOM elements that may need to be updated during change detection. For each property, the compiler creates a **BINDING**. The **BINDING** defines the property name to update and the expression that Angular uses to obtain the new value.

![](Angular%20Change%20Detection/11.png)

> In the actual implementation the binding is not a single object with all required information. A **viewDefinition** defines actual bindings for template elements and the properties to update. The expression used for a binding is placed in the **updateRenderer** function.  

#### Checking a component view

Change detection is performed for each component. **It is actually performed for each view**.

How it does for a **view** (_a component_)?
	1. Run over all bindings generated for a view by the compiler.
	2. Evaluate expressions and compare the results to the values stored in the `oldValues` array on the view.
	3. Update the relevant DOM property relevant to the binding if it detects the difference.
	4. Put the new value into the `oldValues` arrays on the view.
	5. Done and run change detection (same above steps) for child components. [Child nodes references](https://github.com/angular/angular/blob/master/packages/core/src/view/types.ts#L380)

```
To see the views and bindings inside Angular. here’s a function named checkAndUpdateView inside the @angular/core module. (Look up core.uml.js and search the method name)
```

- - - -

## ExpressionChangedAfterItWasChecked
**Why it happens?**
After each change detection cycle, in the development mode, Angular **synchronously** runs another check to ensure that expressions produce the same values as during the preceding change detection run. . This check is not part of the original change detection cycle. It runs **after**the check is finished for the entire tree of components and performs exactly the same steps. However, this time, as Angular detects the difference, it doesn’t update the DOM. Instead, it throws the **ExpressionChangedAfterItHasBeenCheckedError**.

### Why we have this check?
Avoid an infinity loop of change detection runs.
The additional check is used to force developers to follow  [Angular: unidirectional data flow](bear://x-callback-url/open-note?id=220AFC24-C389-4FBA-A0F5-BAF57DDEC723-6760-00005C95A3B2016D)

The unidirectional data flow restriction you can’t change some properties of a component during change detection after this component has been checked.

- - - -
## Hook Order
Inside the  `checkAndUpdateView` function:
```javascript
function checkAndUpdateView(view, ...) {
    ...       
    // update input bindings on child views (components) & directives,
    // call NgOnInit, NgDoCheck and ngOnChanges hooks if needed
    Services.updateDirectives(view, CheckType.CheckAndUpdate);
    
    // DOM updates, perform rendering for the current view (component)
    Services.updateRenderer(view, CheckType.CheckAndUpdate);
    
    // run change detection on child views (components)
    execComponentViewsAction(view, ViewAction.CheckAndUpdate);
    
    // call AfterViewChecked and AfterViewInit hooks
    callLifecycleHooksChildrenFirst(…, NodeFlags.AfterViewChecked…);
    ...
}
```

> **some hooks are called before the rendering part when Angular processes bindings and some are called after that**  

![](Angular%20Change%20Detection/image-2.png)

At the current component
	1. Update the input bindings for the **child** component/directive instance
	2. Run Change detection for embedded views (created by using `ng-template`)
	3. Call **OnChanges** lifecycle hook on a child component if bindings changed
	4.  Then call the **OnInit**, **DoCheck** hooks on the **child** component (**OnInit** is only called during first check)	
	5.  updates  **ContentChildren** query list on a child view component instance (ng-content)
	6.  [calls](https://github.com/angular/angular/blob/6b79ab5abec8b5a4b43d563ce65f032990b3e3bc/packages/core/src/view/provider.ts#L503)  **AfterContentInit** and **AfterContentChecked** lifecycle hooks on child component instance (**AfterContentInit** is called only during first check)
	7. **Angular performs rendering for the current component**
	8. It runs change detection for child components
	9. Finally, it calls **AfterViewChecked** and **AfterViewInit** hooks on the **child** component to let it know that it’s been checked. (**AfterViewInit** is called only during first check)

Note for the step `7`  The templates are rendered before the first check. What I refer to as DOM update is actually interpolation update. So if you have `<span>some {{name}}</span>`, the DOM element span will be rendered before the first check. During the check only `{{name}}` part will be rendered.

So if you have the following components hierarchy: A -> B -> C, here is the order of hooks calls and bindings updates:
```
A: AfterContentInit
A: AfterContentChecked
A: Update bindings
    B: AfterContentInit
    B: AfterContentChecked
    B: Update bindings
        C: AfterContentInit
        C: AfterContentChecked
        C: Update bindings
        C: AfterViewInit
        C: AfterViewChecked
    B: AfterViewInit
    B: AfterViewChecked
A: AfterViewInit
A: AfterViewChecked
```

- - - -
## ChangeDetectorRef
This method is used for obtaining the associated view of a component.

```typescript
class ChangeDetectorRef {
  markForCheck() : void
  detach() : void
  reattach() : void
  
  detectChanges() : void
  checkNoChanges() : void
}
```

### Detach
If we call changeDetectorRef.detach() on a component, change detection will be disabled for that component and its child component. -> DOM in their templates will not be updated even there are some changes in attributes.

### Reattach
Enable change detection:

```typescript
export class AComponent {
  @Input() inputAProp;

  constructor(public cd: ChangeDetectorRef) {
    this.cd.detach();
  }

  ngOnChanges(values) {
    this.cd.reattach();
    setTimeout(() => {
      this.cd.detach();
    })
  }
```
-> This is almost equivalent to what is done when `ChangeDetectionStrategy` is set to `OnPush`.


### MarkForCheck
The **reattached** method enables checks for the current component only, but if change detection is not enabled for its parent component, it will not bring any effect. It means that **reattached** method is only useful for top-most component in the disabled branch.

**MarkForCheck** will enable check for all parent components up to root component.

```typescript
Component({
   ...,
   changeDetection: ChangeDetectionStrategy.OnPush
})
MyComponent {
   @Input() items;
   prevLength;
   constructor(cd: ChangeDetectorRef) {}

   ngOnInit() {
      this.prevLength = this.items.length;
   }

   ngDoCheck() {
      if (this.items.length !== this.prevLength) {
         this.cd.markForCheck(); 
         this.prevLenght = this.items.length;
      }
   }
```


### DetectChanges
There is a way to run change detection **once** for the current component and all its children

```typescript
export class AComponent {
  @Input() inputAProp;

  constructor(public cd: ChangeDetectorRef) {
    this.cd.detach();
  }

  ngOnChanges(values) {
    this.cd.detectChanges();
  }
```

DOM is updated when input property changes even though change detector reference remains detached.

- - - -
## References
[A gentle introduction into change detection in Angular - Angular inDepth](https://indepth.dev/a-gentle-introduction-into-change-detection-in-angular/)

[Everything you need to know about change detection in Angular - Angular inDepth](https://indepth.dev/everything-you-need-to-know-about-change-detection-in-angular/)

[These 5 articles will make you an Angular Change Detection expert - Angular inDepth](https://indepth.dev/these-5-articles-will-make-you-an-angular-change-detection-expert/)
