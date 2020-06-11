import {
  Component,
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { LoggerService } from '../../helper/logger.service';

@Component({
  selector: 'disabled-parent',
  templateUrl: './disabled-parent.component.html',
  styles: ['.parent {background: moccasin}'],
  providers: [LoggerService],
})
export class DisabledParentComponent
  implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {
  hasChild = true;
  hookLog: string[];

  heroName = 'Windstorm';

  componentName = 'Disblaed Parent';

  constructor(private logger: LoggerService, private ref: ChangeDetectorRef) {
    this.logger = logger;
    this.hookLog = logger.logs;
    this.logger.log(`${this.componentName}: detach at constructor`);
    this.ref.detach();
  }

  ngOnInit() {
    this.logger.log(`${this.componentName}: ngOnInit`);
  }

  ngOnChanges() {
    this.logger.log(`${this.componentName}: ngOnChanges`);
  }

  ngDoCheck() {
    this.logger.log(`${this.componentName}: : DoCheck`);
  }

  ngAfterContentInit() {
    this.logger.log(`${this.componentName}: : AfterContentInit`);
  }

  // Beware! Called frequently!
  // Called in every change detection cycle anywhere on the page
  ngAfterContentChecked() {
    this.logger.log(`${this.componentName}: : AfterContentChecked`);
  }

  ngAfterViewInit() {
    this.logger.log(`${this.componentName}: : AfterViewInit`);
  }

  // Beware! Called frequently!
  // Called in every change detection cycle anywhere on the page
  ngAfterViewChecked() {
    this.logger.log(`${this.componentName}: : AfterViewChecked`);
  }

  ngOnDestroy() {
    this.logger.log(`${this.componentName}: : OnDestroy`);
  }

  toggleChild() {
    this.hasChild = !this.hasChild;
    if (this.hasChild) {
      this.heroName = 'Windstorm';
      // this.logger.log('**************************');
      this.logger.clear(); // clear log on create
    }
    this.hookLog = this.logger.logs;
    this.logger.tick();
  }

  updateHero() {
    this.heroName += '!';
    this.logger.tick();
  }

  showLog() {
    this.ref.detectChanges();
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
