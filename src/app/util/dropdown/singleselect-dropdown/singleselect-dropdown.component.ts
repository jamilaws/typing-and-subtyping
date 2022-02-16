import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Selectable } from '../selectable';

export { Selectable };

@Component({
  selector: 'app-singleselect-dropdown',
  templateUrl: './singleselect-dropdown.component.html',
  styleUrls: ['./singleselect-dropdown.component.css']
})
export class SingleselectDropdownComponent implements OnInit {
  
  @Input('options') options : Selectable[];
  @Input('icons') icons : String[] = null;
  public selectedIndex : number = 0;

  @Output('onSelectEvent') onSelectEvent = new EventEmitter<Selectable>();
  value: Selectable;

  isMenuOpen : boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (this.icons !== null) {
      // Icons available -> check if dimensions match
      if (this.options.length !== this.icons.length) {
        throw new Error("dimensions of options and icons do not match");
      }
    }
    if(!this.options || this.options.length === 0){
      const dummy: Selectable = {
        _id: "1",
        name: "No data available"
      }
      this.options = [dummy];
    } else {
      // Add _id fields if not defined
      if(!this.options[0]._id){
        this.options = this.options.map((o, index) => {
          o._id = index + "";
          return o;
        });
      }
    }
    this.value = this.options[0];
  }

  public _onSelect(index: number) {
    this.selectedIndex = index;
    this.value = this.options[this.selectedIndex]

    this.onSelectEvent.emit(this.options[index]);

  }

  public getSelectedOption(): Selectable {
    return this.value;
  }

  public setSelectedOption(id: string): void {
    let option = this.options.find(o => o._id === id);
    if(!option) throw new Error("setSelectedOption called with invalid id");
    this.selectedIndex = this.options.indexOf(option);
    this.value = option;
  }

}
