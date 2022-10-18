import cors from 'cors';
import express, { Express, json } from 'express';
import path from 'path';
import router from './router';

class App {
  server: Express;
  constructor() {
    this.server = express();
    this.controllers();
    this.routers();
  }

  controllers() {
    this.server.use(json());
    this.server.use(cors());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );
  }

  routers() {
    this.server.use(router);
  }
}

export default new App().server;
