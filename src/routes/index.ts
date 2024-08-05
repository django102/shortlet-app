import { Router } from "express";
import JobController from "../controllers/JobController"
import CountryController from "../controllers/CountryController";

const router: Router = Router();


router.get("/", (req, res) => res.send({ message: 'Welcome' }));


router.get("/all", JobController.getAllCountriesFromService);

router.get("/countries", CountryController.getAllCountries);


export default router;