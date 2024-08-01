import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_API_BASE_URL as string;
const socket: Socket = io(URL);

export default socket;