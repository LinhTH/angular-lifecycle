import { Component, OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { LoggerService } from '../../helper/logger.service';

@Component({
  selector: 'parent',
  templateUrl: './parent.component.html',
  styles: ['.parent {background: moccasin}'],
  providers: [LoggerService],
})
export class ParentComponent
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
  private logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
    this.hookLog = logger.logs;
  }

  ngOnInit() {
    this.logger.log('Parent: ngOnInit');
  }

  ngOnChanges() {
    this.logger.log('Parent: ngOnChanges');
  }

  ngDoCheck() {
   this.logger.log(`Parent: DoCheck`);
  }

  ngAfterContentInit() {
    this.logger.log(`Parent: AfterContentInit`);
  }

  // Beware! Called frequently!
  // Called in every change detection cycle anywhere on the page
  ngAfterContentChecked() {
    this.logger.log(`Parent: AfterContentChecked`);
  }

  ngAfterViewInit() {
    this.logger.log(`Parent: AfterViewInit`);
  }

  // Beware! Called frequently!
  // Called in every change detection cycle anywhere on the page
  ngAfterViewChecked() {
    this.logger.log(`Parent: AfterViewChecked`);
  }

  ngOnDestroy() {
    this.logger.log(`Parent: OnDestroy`);
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
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
