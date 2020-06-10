import { SpyDirective } from './spy.directive';
import { SpyParentComponent } from './spy.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpyDirectiveRoutingModule } from './spy-directive-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SpyParentComponent, SpyDirective],
  imports: [SpyDirectiveRoutingModule, CommonModule, FormsModule],
})
export class SpyDirectiveModule {}
