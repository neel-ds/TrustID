import {create, useStore} from 'zustand';
interface State {
    name: string;
  }

const Usestore = create<State>(set => ({
    name: 'zustand',
    setName: (name: string) => set({name}),
    }));
export default Usestore;