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

  useEffect(() => {
    const timer = setTimeout(async () => {
      // const output = await bundle(input);
      // const output = await bundle(cell.content);
      // setCode(output.code);
      // setErr(output.err);
      createBundle(cell.id, cell.content);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content, cell.id, createBundle]);

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
        {bundle && <Preview code={bundle.code} err={bundle.err} />}
      </div>
    </Resizable>
  );
};

export default CodeCell;
