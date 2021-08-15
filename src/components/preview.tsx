import './preview.css';
import { useRef, useEffect } from 'react';

interface PreviewProps {
  code: String;
  err: string;
}

const html = `
    <html>
      <head>
        <style>html {background-color: white;}</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
        const handleError = (err) =>{
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
          console.error(err)
        }
          //only invoked when error wasn't caught by try catch handleError scripts below
          window.addEventListener('error', (event) =>{
            // to prevent default browser's console err display as I do manually in handleError
            event.preventDefault();
            handleError(event.error)
          })

          //receive code as a message from parents
          window.addEventListener('message', (event) =>{
            try{
              console.log(event.data)
              eval(event.data)
            }catch(err){
              handleError(err)
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcDoc = html;
    setTimeout(() => {
      //send code to iframe
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    //set wrapper to let size change bar work properly
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
