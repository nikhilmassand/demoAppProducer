import React, { useState, useEffect } from "react";
import { render } from 'react-dom'
import io from 'socket.io-client'


// const socket = io("http://localhost:3001");

interface SaleOrder {
  SKU: string,
  qty: number,
}


function Producer() {
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState(0);
  

  function socketProducerInvoke() {
    console.log("the state of num is now...", qty);
    const socket = io('http://localhost:3001');


   
    socket.emit('postMessage', {
      SKU: sku,
      qty: qty
    })

    return () => {
      console.log("is Producer ever off?");
      socket.off();
    }
  }
  const handleSubmit = (evt) => {
    evt.preventDefault();
  }


    return (
      <div className="produceData">
        <form onSubmit = {handleSubmit}>
          <label>
            <input type="text" className="skuInput" placeholder='Enter Sku' onChange={e => setSku(e.target.value)} />
            <input type="number" className="qtyInput" placeholder='Enter Qty' onChange={e => setQty(e.target.value)} />
          </label>
        </form>
        <button className="produceDataButton" onClick={() => socketProducerInvoke()}>PRODUCE</button>
        <h2>I am responsive from Producer: {sku}</h2>
      </div>
    )
}

export default Producer;