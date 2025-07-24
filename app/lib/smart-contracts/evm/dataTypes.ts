export interface EthereumProvider {
  request: (...args: any[]) => Promise<any>;
  // add more methods as needed
}

// export interface Window {
//   ethereum?: EthereumProvider;
// }