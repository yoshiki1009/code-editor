import './code-cell.css';
import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
// import bundle from '../bundler';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  //replace local state to redux store
  // const [code, setCode] = useState('');
  // const [err, setErr] = useState('');
  // const [input, setInput] = useState('');replace update cell ↓
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  // console.log(bundle);
  const cumulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const code = [
      `
      const show = (value) =>{
        const root = document.querySelector('#root')

        if(typeof value === 'object'){
          if(value.$$typeof && value.props){
            ReactDOM.render(value, root)
          }else{
            root.innerHTML = JSON.stringify(value);
          }
        }else{
          root.innerHTML = value;
        }
      }
      `,
    ];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        code.push(c.content);
      }
      if (c.id === cell.id) {
        // stop looping when loop come current cell
        break;
      }
    }
    return code;
  });

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode.join('\n'));
      return;
    }
    const timer = setTimeout(async () => {
      // const output = await bundle(input);
      // const output = await bundle(cell.content);
      // setCode(output.code);
      // setErr(output.err);
      createBundle(cell.id, cumulativeCode.join('\n'));
      // console.log(cumulativeCode.join('\n'));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode.join('\n'), cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content} //initialValue= 'const a = 1;'
            onChange={(value) => updateCell(cell.id, value)} // onChange={(value) => setInput(value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
