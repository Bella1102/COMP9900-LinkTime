import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Admin from './admin';
import Home from './pages/Home/home';
import Login from './pages/Form/login';
import Register from './pages/Form/register';

import Host from './pages/Prop/postProp';
import MyProp from './pages/Prop/myProp';
import OneProp from './pages/Prop/oneProp';

import Search from './pages/Search/search';
import Order from './pages/Order/order';
import Request from './pages/Request/request';

import Success from './pages/success';
import FourOFour from './pages/404';
import FourOThree from './pages/403';

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
							<Route path='/prop/:id' exact component={ OneProp }></Route>

							<Route path='/success' exact component={ Success }></Route>
							<Route path='/404' exact component={ FourOFour }></Route>
							<Route path='/403' exact component={ FourOThree }></Route>
						</Switch>
					</Admin> }>
				</Route>
			</Switch>
        </BrowserRouter>
      )
  } 
}

export default App;




