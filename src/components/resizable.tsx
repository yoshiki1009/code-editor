import './resizable.css';
import { ResizableBox } from 'react-resizable';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox
      resizeHandles={['s']}
      height={300}
      width={Infinity}
      maxConstraints={[Infinity, window.innerHeight * 0.9]}
      minConstraints={[Infinity, 24]}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;
