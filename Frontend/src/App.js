import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Admin from './admin';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';




class App extends Component {

    render() {
      return (
        <BrowserRouter> 
          	<Switch>
				<Route path='/login' exact component={ Login }></Route>
				<Route path='/register' exact component={ Register }></Route>
				<Route path='/' render = {() => 
					<Admin>
						<Switch>
							<Route path='/' exact component={ Home }></Route>
						</Switch>
					</Admin> }>
				</Route>
			</Switch>
        </BrowserRouter>
      )
  } 
}

export default App;



