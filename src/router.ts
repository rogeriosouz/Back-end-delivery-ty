import { Router } from 'express';
import upload from './config/multer';
import AddressController from './controllers/AddressController';

import CategoryController from './controllers/CategoryController';
import ProductController from './controllers/ProductController';
import RequestsControllers from './controllers/RequestsControllers';
import UserController from './controllers/UserController';
import ferifica from './middlewares/validateToken';

const router = Router();

router.get('/user/recoveryUser', ferifica, UserController.recoveryUser);
router.post('/user/create', UserController.create);
router.post('/user/login', UserController.login);

router.get('/products', ProductController.read);
router.get('/product/one/:id', ProductController.readOne);
router.post(
  '/product/create',
  ferifica,
  upload.single('productUrl'),
  ProductController.create
);
router.put(
  '/product/update/:id',
  ferifica,
  upload.single('productUrl'),
  ProductController.update
);
router.put(
  '/product/updateQuant/:id',
  ferifica,
  ProductController.updateQuantProduct
);

router.get('/categories', CategoryController.read);
router.post('/category/create', ferifica, CategoryController.create);
router.put('/category/update/:id', ferifica, CategoryController.update);
router.delete('/category/delete/:id', ferifica, CategoryController.delete);

router.get('/address', ferifica, AddressController.read);
router.get('/address/readOne/:id', ferifica, AddressController.readOne);
router.post('/address/create', ferifica, AddressController.create);
router.put('/address/update/:id', ferifica, AddressController.update);
router.delete('/address/delete/:id', ferifica, AddressController.delete);

router.get('/requests/all', ferifica, RequestsControllers.readAll);
router.get('/requests/one/:id', RequestsControllers.readOne);
router.post('/requests/create', ferifica, RequestsControllers.create);

export default router;
