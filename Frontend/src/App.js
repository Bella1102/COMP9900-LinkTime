import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Admin from './admin';
import Home from './pages/Home/home';
import Login from './pages/Form/login';
import Register from './pages/Form/register';
import Search from './pages/Search/search';




class App extends Component {

    render() {
      return (
        <BrowserRouter> 
          	<Switch>
			  	{/* <Route path='/search' exact component={ Search }></Route> */}
				<Route path='/' render = {() => 
					<Admin>
						<Switch>
							<Route path='/' exact component={ Home }></Route>
							<Route path='/login' exact component={ Login }></Route>
							<Route path='/register' exact component={ Register }></Route>
							<Route path='/search' exact component={ Search }></Route>
						</Switch>
					</Admin> }>
				</Route>
			</Switch>
        </BrowserRouter>
      )
  } 
}

export default App;



