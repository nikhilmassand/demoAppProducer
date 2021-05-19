import { stat } from "fs";
import io from "socket.io-client";

interface IDCache {
  [id: string] : boolean;
}

class AtomicKafkaClient {
  address: string;
  idCache: IDCache;
  constructor(kafkaServer){
    this.address = kafkaServer;
    this.idCache = {};
  }

  consumer(state, setState, inv = null, setInv = null){
    const socket = io(this.address);

    socket.on("newMessage", (arg) => {
      console.log('*** this.idCache',this.idCache);
      const latest = JSON.parse(arg);
      const newInv = {...inv};
      // console.log(`*** latest`,latest)
      const boolTest = this.idCache.hasOwnProperty(latest.id);
      console.log('*** BOOLTEST',boolTest);
      if(!this.idCache[latest.id]){
        console.log(this.idCache, latest.id);
        this.idCache[latest.id] = true;
        console.log('*** is latest', this.idCache[latest.id])
        setState([...state, arg]);
        if (inv && arg) {
          newInv[latest.SKU] -= latest.qty;
          setInv(newInv);
        }
      }
      console.log("new data: ", arg);
      // console.log("data type: ", typeof arg);
      console.log("new truck state: ", state);
      // if(arg.SKU === state[state.length - 1].SKU) return;
      // if(!state.length && arg.id === state[state.length - 1].id)
      
    });
    return () => {
      console.log("is App ever off?");
      socket.off();
    }
  }
}



export default AtomicKafkaClient;
