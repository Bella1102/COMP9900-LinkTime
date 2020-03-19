import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Admin from './admin';
import Home from './pages/Home/home';
import Login from './pages/Form/login';
import Register from './pages/Form/register';
import Search from './pages/Search/search';
import Order from './pages/Order/order';
import Request from './pages/Request/request';
import Host from './pages/Host/host';
import Property from './pages/Host/property';
import PropDeatil from './pages/Host/propDetail';




class App extends Component {

    render() {
      return (
        <BrowserRouter> 
          	<Switch>

				<Route path='/' render = {() => 
					<Admin>
						<Switch>
							<Route path='/' exact component={ Home }></Route>
							<Route path='/login' exact component={ Login }></Route>
							<Route path='/signup' exact component={ Register }></Route>
							<Route path='/search' exact component={ Search }></Route>
							<Route path='/order' exact component={ Order }></Route>
							<Route path='/request' exact component={ Request }></Route>
							<Route path='/host' exact component={ Host }></Route>
							<Route path='/property' exact component={ Property }></Route>
							<Route path='/property/:detail' exact component={ PropDeatil }></Route>
						</Switch>
					</Admin> }>
				</Route>
			</Switch>
        </BrowserRouter>
      )
  } 
}

export default App;



