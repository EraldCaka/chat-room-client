import Client from "./Client";

type Room = {
  id: string;
  name: string;
  clients: Map<string, Client>;
};

export default Room;
