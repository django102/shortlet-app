import { Router } from "express";
import { CountryService } from "../services/CountryService";

const router: Router = Router();


router.get("/", (req, res) => res.send({ message: 'Welcome' }));


router.get("/all", CountryService.getAllCountriesFromService);


export default router;