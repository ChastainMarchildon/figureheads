import React from 'react'
import ReactDOM from'react-dom'
const listings = React.createElement

class Listing extends React.Component{

    render() {
            return(
                <h1>Hi</h1>
            )
      }
}


const domContainer = document.querySelector('#reactdom');
ReactDOM.render(<Listing/>, domContainer);
