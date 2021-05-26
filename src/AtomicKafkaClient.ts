import io from "socket.io-client";

interface IDCache {
  [id: string] : boolean;
}

class AtomicKafkaClient {
  address: string;
  idCache: IDCache;
  //user passes in their kafka server used for client/server side connection
  constructor(kafkaServer){
    this.address = kafkaServer;
    this.idCache = {};
  }


  consumer(state, setState, inv = null, setInv = null){
    const socket = io(this.address);

    //event based socket listening coming soon
    socket.on("newMessage", (arg) => {

      const latest = JSON.parse(arg);
      const newInv = {...inv};

      //check if the id has been used
      if(!this.idCache[latest.id]){
        this.idCache[latest.id] = true;
        setState([...state, arg]);
        if (inv && arg) {
          newInv[latest.SKU] -= latest.qty;
          setInv(newInv);
        }
      }
      console.log("Consumed Data: ", arg);
    });
    return () => {
      socket.off();
    }
  }
}



export default AtomicKafkaClient;
