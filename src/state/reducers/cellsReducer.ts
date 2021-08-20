import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      // using immer
      state.data[action.payload.id].content = action.payload.content;
      return state;

    // Code without immer
    // return {
    //   ...state,
    //   data: {
    //     ...state.data,
    //     [action.payload.id]: {
    //       ...state.data[action.payload.id],
    //       content: action.payload.content,
    //     },
    //   },
    // };

    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
      return state;

    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }
      //swap order
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return state;

    case ActionType.INSERT_CELL_BEFORE:
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId(),
      };

      state.data[cell.id] = cell;

      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );

      if (foundIndex < 0) {
        state.order.push(cell.id);
      } else {
        state.order.splice(foundIndex, 0, cell.id);
      }

      return state;
    default:
      return state;
  }
}, initialState);

//create 5 didits random id using 0-9 and a-z
const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
