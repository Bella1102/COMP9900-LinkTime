import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Admin from './admin';
import Home from './pages/Home/home';
import Login from './pages/Form/login';
import Register from './pages/Form/register';

import Search from './pages/Prop/search';
import OneProp from './pages/Prop/oneProp';
import Order from './pages/Prop/order';
import Host from './pages/Prop/postProp';
import MyProp from './pages/Prop/myProp';
import Request from './pages/Prop/request';




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
							<Route path='/myProp' exact component={ MyProp }></Route>
							<Route path='/myProp/:detail' exact component={ OneProp }></Route>
						</Switch>
					</Admin> }>
				</Route>
			</Switch>
        </BrowserRouter>
      )
  } 
}

export default App;



