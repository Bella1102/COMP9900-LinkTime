import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Admin from './admin';
import Home from './pages/Home/home';
import Profile from './pages/Home/profile';
import Login from './pages/Form/login';
import Register from './pages/Form/register';

import Host from './pages/Prop/postProp';
import MyProp from './pages/Prop/myProp';
import OneProp from './pages/Prop/oneProp';

import Search from './pages/Search/search';
import Order from './pages/Order/order';
import Request from './pages/Request/request';
import FourOFour from './pages/404';



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

							<Route path='/profile' exact component={ Profile }></Route>
							<Route path='/search' exact component={ Search }></Route>
							<Route path='/orders' exact component={ Order }></Route>
							<Route path='/requests' exact component={ Request }></Route>
							
							<Route path='/postProp' exact component={ Host }></Route>
							<Route path='/myProps' exact component={ MyProp }></Route>
							<Route path='/props/:id' exact component={ OneProp }></Route>
							<Route component={ FourOFour }></Route>
						</Switch>
					</Admin> }>
				</Route>
			</Switch>
        </BrowserRouter>
      )
  } 
}

export default App;




