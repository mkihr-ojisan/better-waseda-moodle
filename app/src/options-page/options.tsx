// #!debug
import 'react-devtools';

import React from 'react';
import ReactDOM from 'react-dom';
import Options from './components/Options';

// #!blink_only
document.body.style.height = '572px';

ReactDOM.render(<Options />, document.getElementById('container'));