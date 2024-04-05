import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {persistor, store} from "./redux/store"
import { Provider } from "react-redux";
import {PersistGate} from 'redux-persist/integration/react'
import ThemeProvider from "./components/ThemeProvider";
//so after that we want to create the slice 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <PersistGate persistor={persistor}>
<Provider store={store}> 
 <ThemeProvider>
   <App/>
 </ThemeProvider>
   </Provider>


   </PersistGate>

 

);
