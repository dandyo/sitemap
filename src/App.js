import React, { useEffect } from 'react';
import UrlList from './UrlList';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css"

Fancybox.bind('[data-fancybox]', {
  //
});

function App() {
  useEffect(() => {
    document.title = 'Sitemap Generator';
  }, []);

  // render() {
  return (
    <div className="App">
      <div className="container">
        <div className="wrap">
          <h1>Sitemap</h1>
          <p>12 websites to generate. <a href='#list' data-fancybox>Edit list</a></p>

          <div className="progress mb-2" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '25%' }}></div>
          </div>

          <div className='mb-4'>Status</div>

          <button className='btn btn-primary'>Generate</button>

          <div id='list' style={{ display: 'none' }}>
            <UrlList />
          </div>
        </div>
      </div>
    </div >
  );
  // }
}

export default App;
