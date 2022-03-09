import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-singleselect-dropdown',
  templateUrl: './singleselect-dropdown.component.html',
  styleUrls: ['./singleselect-dropdown.component.css']
})
export class SingleselectDropdownComponent implements OnInit {
  
  @Input('options') options : any[];
  @Input('optionToName') optionToName: (options: any) => string = (option) => option.name;
  @Input('icons') icons : String[] = null;
  public selectedIndex : number = 0;

  @Output('onSelectEvent') onSelectEvent = new EventEmitter<any>();
  value: any;

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
      const dummy: any = {
        _id: "1",
        name: "No data available"
      }
      this.options = [dummy];
    } else {
      if(!this.optionToName(this.options[0])) throw new Error("Either pass options with 'name' field or specify suitable optionToName function")

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

  public getSelectedOption(): any {
    return this.value;
  }

  public setSelectedOption(pred: (option: any) => boolean): void {
    let option = this.options.find((o: any) => pred(o));
    if(!option) throw new Error("option not found");
    this.selectedIndex = this.options.indexOf(option);
    this.value = option;
  }

}
