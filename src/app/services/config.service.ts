// src/app/services/config.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfigState {
  headerBackColor: string;
  collapseTabMenu: boolean;
  collapseHeaderMenu: boolean;
  collapseLayout: string;   
  isOpen: string[];        
  isTrigger: string[];
}

export enum ActionType {
  COLLAPSE_MENU = 'COLLAPSE_MENU',
  EXPAND_MENU = 'EXPAND_MENU',
  COLLAPSE_TOGGLE = 'COLLAPSE_TOGGLE'
}

export interface ConfigAction {
  type: ActionType;
  payload?: any; // để truyền thêm dữ liệu nếu cần
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private stateSubject = new BehaviorSubject<ConfigState>({
    headerBackColor: 'default-header', // giá trị mặc định
    collapseTabMenu: false,
    collapseHeaderMenu: false,
    collapseLayout: 'vertical',
    isOpen: [],
    isTrigger: []
  });

  state$ = this.stateSubject.asObservable();

  getState(): ConfigState {
    return this.stateSubject.value;
  }

  setState(newState: Partial<ConfigState>) {
    this.stateSubject.next({ ...this.stateSubject.value, ...newState });
  }

  // 👇 dispatch kiểu Redux
  dispatch(action: ConfigAction) {
    const currentState = this.stateSubject.value;

    switch (action.type) {
      case ActionType.COLLAPSE_MENU:
        this.stateSubject.next({
          ...currentState,
          collapseTabMenu: !currentState.collapseTabMenu
        });
        break;

      case ActionType.EXPAND_MENU:
        this.stateSubject.next({
          ...currentState,
          collapseTabMenu: false
        });
        break;

      case ActionType.COLLAPSE_TOGGLE:
        this.stateSubject.next({
          ...currentState,
          collapseHeaderMenu: !currentState.collapseHeaderMenu
        });
        break;

      default:
        break;
    }
  }
}
