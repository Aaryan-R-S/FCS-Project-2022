import { Fragment, React } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Admin from './components/Admin';
import Patient from "./components/Patient";
import Expert from './components/Expert';
import View from './components/View';

function App() {
    return (
        <>
            <BrowserRouter>
                <NavBar />
                <Fragment>
                    <ScrollToTop />
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/admin">
                            <Admin />
                        </Route>
                        <Route exact path="/patient">
                            <Patient />
                        </Route>
                        <Route exact path="/expert">
                            <Expert />
                        </Route>
                        <Route exact path="/view">
                            <View />
                        </Route>
                        <Route component={Home} />
                    </Switch>
                </Fragment>
            </BrowserRouter>
        </>
    );
}

export default App;
