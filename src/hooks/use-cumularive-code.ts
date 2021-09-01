import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';
    var show = (value) =>{
      const root = document.querySelector('#root')

      if(typeof value === 'object'){
        if(value.$$typeof && value.props){
          _ReactDOM.render(value, root)
        }else{
          root.innerHTML = JSON.stringify(value);
        }
      }else{
        root.innerHTML = value;
      }
    }
    `;
    const showFuncNoop = 'var show = () =>{}';
    const cumulariveCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellId) {
          cumulariveCode.push(showFunc);
        } else {
          cumulariveCode.push(showFuncNoop);
        }
        cumulariveCode.push(c.content);
      }
      if (c.id === cellId) {
        // stop looping when loop come current cell
        break;
      }
    }
    return cumulariveCode;
  }).join('\n');
};
