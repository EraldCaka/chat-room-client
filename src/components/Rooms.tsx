import APIClient from "../core/application/lib/apiClient";

export interface Room {
  id: string;
  name: string;
  clientCount: number;
  clients: string[];
}

const Rooms = {
  fetchRooms: async (): Promise<Room[]> => {
    try {
      const apiClient = new APIClient<Room[]>("/ws/getRooms");
      const rooms = await apiClient.get();
      return rooms;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }
  },
};

export default Rooms;
